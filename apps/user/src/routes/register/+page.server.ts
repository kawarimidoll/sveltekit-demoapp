import type { Actions, PageServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { checkUserEmailAvailability, verifyEmailInput } from '@shared/logic/email';
import * as ev from '@shared/logic/email-verification';
import { hashPassword, verifyPasswordInput, verifyPasswordStrength } from '@shared/logic/password';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, i18n.resolveRoute('/'));
  }
  const email = ev.getEmailVerificationCookie(event);
  if (!email) {
    return redirect(302, i18n.resolveRoute('/verify-email'));
  }
  ev.deleteEmailVerificationCookie(event);
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
    const emailAvailable = await checkUserEmailAvailability(email);
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
    return redirect(302, i18n.resolveRoute('/'));
  },
};

function validateCode(code: unknown): code is string {
  return (
    typeof code === 'string'
    && code.length === table.emailVerification.code.length
  );
}
