import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { checkEmailAvailability, verifyEmailInput } from '$lib/server/email';
import { hashPassword, verifyPasswordInput, verifyPasswordStrength } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
  return {};
};

export const actions: Actions = {
  register: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    // check email
    if (!verifyEmailInput(email)) {
      return fail(400, { message: 'Invalid email' });
    }
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return fail(400, { message: 'Email is already used' });
    }

    // check username
    if (!validateUsername(username)) {
      return fail(400, { message: 'Invalid username' });
    }
    const [existingUser] = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));
    if (existingUser) {
      return fail(400, { message: 'Username is already used' });
    }

    // check password
    if (!verifyPasswordInput(password)) {
      return fail(400, { message: 'Invalid password' });
    }
    const isStrongPassword = await verifyPasswordStrength(password);
    if (!isStrongPassword) {
      return fail(400, { message: 'Weak password' });
    }

    const passwordHash = await hashPassword(password);

    try {
      // return value of db.insert() is array
      const [insertedUser] = await db
        .insert(table.user)
        .values({ username, email, passwordHash })
        .returning({ id: table.user.id });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, insertedUser.id);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
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
