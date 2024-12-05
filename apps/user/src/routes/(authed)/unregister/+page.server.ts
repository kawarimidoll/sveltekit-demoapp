import type { Actions, RequestEvent } from './$types';
import { i18n } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as ev from '$lib/server/email-verification';
import { verifyPasswordHash } from '$lib/server/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
  request_verify: requestVerifyAction,
  unregister: unregisterAction,
};

async function requestVerifyAction(event: RequestEvent) {
  if (!auth.isAuth(event) || event.locals.user === null) {
    return fail(401, {
      message: 'Not authenticated',
    });
  }

  const { email } = event.locals.user;
  const emailVerification = await ev.createEmailVerification(email);
  ev.sendVerificationEmail(emailVerification.email, emailVerification.code);
  return {
    message: 'Sent verification code to email',
  };
}

async function unregisterAction(event: RequestEvent) {
  if (!auth.isAuth(event) || event.locals.user === null) {
    return fail(401, {
      password: {
        message: 'Not authenticated',
      },
    });
  }

  const formData = await event.request.formData();
  const agree = formData.get('agree');
  const password = formData.get('password') as string;
  const code = formData.get('code');

  if (!agree) {
    return fail(400, {
      message: 'Need to agree',
    });
  }

  const [existingUser] = await db
    .select()
    .from(table.user)
    .where(eq(table.user.id, event.locals.user.id));
  const validPassword = await verifyPasswordHash(existingUser.passwordHash, password);
  if (!validPassword) {
    return fail(400, { message: 'Incorrect password' });
  }

  // check code
  if (!validateCode(code)) {
    return fail(400, { message: 'Invalid code' });
  }
  const emalVerification = await ev.getEmailVerification(event.locals.user.email, code);
  if (!emalVerification) {
    return fail(400, { message: 'Invalid code' });
  }
  const codeExpired = Date.now() >= emalVerification.expiresAt.getTime();
  if (codeExpired) {
    return fail(400, { message: 'Code expired' });
  }
  await ev.deleteEmailVerification(event.locals.user.email);

  // logout
  await auth.invalidateAllSession(event.locals.user.id);
  auth.deleteSessionTokenCookie(event);

  await db.delete(table.user).where(eq(table.user.id, event.locals.user.id));

  return redirect(302, i18n.resolveRoute('/'));
}

function validateCode(code: unknown): code is string {
  return (
    typeof code === 'string'
    && code.length === table.emailVerification.code.length
  );
}
