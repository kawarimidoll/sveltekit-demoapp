import type { Actions, PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { checkEmailAvailability, verifyEmailInput } from '$lib/server/email';
import * as ev from '$lib/server/email-verification';
import { hashPassword, verifyPasswordInput, verifyPasswordStrength } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/');
  }
  const email = ev.getEmailVerificationCookie(event);
  if (!email) {
    return redirect(302, '/verify-email');
  }
  return { email };
};

export const actions: Actions = {
  register: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const code = formData.get('code');
    const password = formData.get('password');

    // check email
    if (!verifyEmailInput(email)) {
      return fail(400, { message: 'Invalid email' });
    }
    const emailAvailable = await checkEmailAvailability(email);
    if (!emailAvailable) {
      return fail(400, { message: 'Email is already used' });
    }

    // check code
    if (!validateCode(code)) {
      return fail(400, { message: 'Invalid code' });
    }
    const emalVerification = await ev.getEmailVerification(email, code);
    if (!emalVerification) {
      return fail(400, { message: 'Invalid code' });
    }
    const codeExpired = Date.now() >= emalVerification.expiresAt.getTime();
    if (codeExpired) {
      return fail(400, { message: 'Code expired' });
    }
    await ev.deleteEmailVerification(email);

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
        .values({ email, passwordHash })
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

function validateCode(code: unknown): code is string {
  return (
    typeof code === 'string'
    && code.length === table.emailVerification.code.length
  );
}
