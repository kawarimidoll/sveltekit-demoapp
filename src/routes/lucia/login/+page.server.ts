import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// recommended minimum parameters
const hashParams = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/lucia');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!validateUsername(username)) {
      return fail(400, { message: 'Invalid username' });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password' });
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: 'Incorrect username or password' });
    }

    const validPassword = await verify(existingUser.passwordHash, password, hashParams);
    if (!validPassword) {
      return fail(400, { message: 'Incorrect username or password' });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/lucia');
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!validateUsername(username)) {
      return fail(400, { message: 'Invalid username' });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password' });
    }

    const passwordHash = await hash(password, hashParams);

    try {
      // return value of db.insert() is array
      const [insertedUser] = await db
        .insert(table.user)
        .values({ username, passwordHash })
        .returning({ id: table.user.id });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, insertedUser.id);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return redirect(302, '/lucia');
  },
};

function validateUsername(username: unknown): username is string {
  // note: Checking length in regexp is simple but potentially vulnerable to a super long string.
  // /^[a-z0-9_-]{3,31}$/.test(username);
  return (
    typeof username === 'string'
    && username.length >= 3
    && username.length <= table.USERNAME_MAX_LENGTH
    && /^[a-z0-9_-]+$/.test(username)
  );
}

function validatePassword(password: unknown): password is string {
  return (
    typeof password === 'string'
    && password.length >= 6
    && password.length <= 255
  );
}
