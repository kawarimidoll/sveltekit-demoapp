import type { Actions, PageServerLoad } from './$types';
import * as m from '$lib/paraglide/messages.js';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/user-auth';
import { i18nRedirect } from '$lib/server/utils';
import { hash, verify } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
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
    return i18nRedirect(event.url, '/');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!validateUsername(username)) {
      return fail(400, { message: m.invalidUsername() });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: m.invalidPassword() });
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { message: m.incorrectCredential() });
    }

    const validPassword = await verify(existingUser.passwordHash, password, hashParams);
    if (!validPassword) {
      return fail(400, { message: m.incorrectCredential() });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return i18nRedirect(event.url, '/');
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!validateUsername(username)) {
      return fail(400, { message: m.invalidUsername() });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: m.invalidPassword() });
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
    return i18nRedirect(event.url, '/');
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
