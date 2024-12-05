import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { verifyPasswordHash } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
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

    const [existingUser] = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));
    if (!existingUser) {
      return fail(400, { message: 'Incorrect username or password' });
    }

    const validPassword = await verifyPasswordHash(existingUser.passwordHash, password);
    if (!validPassword) {
      return fail(400, { message: 'Incorrect username or password' });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/');
  },
};

function validateUsername(username: unknown): username is string {
  // NOTE: Limit the length first, as checking the length using
  //       a regexp can be vulnerable to extremely long input
  return (
    typeof username === 'string'
    && username.length >= 3
    && username.length <= table.user.username.length
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
