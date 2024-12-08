import type { Actions, RequestEvent } from './$types';
import { i18n } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { checkUserEmailAvailability, verifyEmailInput } from '@shared/logic/email';
import * as ev from '@shared/logic/email-verification';
import {
  hashPassword,
  verifyPasswordHash,
  verifyPasswordInput,
  verifyPasswordStrength,
} from '@shared/logic/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load(event: RequestEvent) {
  if (event.locals.user === null) {
    return redirect(302, i18n.resolveRoute('/login'));
  }
  return { user: event.locals.user };
}

export const actions: Actions = {
  request_verify: requestVerifyAction,
  update_password: updatePasswordAction,
  update_email: updateEmailAction,
  update_username: updateUsernameAction,
  unregister: unregisterAction,
};

async function requestVerifyAction(event: RequestEvent) {
  if (event.locals.user === null) {
    return fail(401, {
      code: {
        message: 'Not authenticated',
      },
    });
  }

  const { email } = event.locals.user;
  const emailVerification = await ev.createEmailVerification(email);
  ev.sendVerificationEmail(emailVerification.email, emailVerification.code);
  return {
    code: {
      message: 'Sent verification code to email',
    },
  };
}

async function updatePasswordAction(event: RequestEvent) {
  if (!auth.isAuth(event) || event.locals.user === null) {
    return fail(401, {
      password: {
        message: 'Not authenticated',
      },
    });
  }

  const formData = await event.request.formData();
  const newPassword = formData.get('new_password');
  const code = formData.get('code');
  if (!verifyPasswordInput(newPassword)) {
    return fail(400, {
      password: {
        message: 'Invalid password',
      },
    });
  }
  const strongPassword = await verifyPasswordStrength(newPassword);
  if (!strongPassword) {
    return fail(400, {
      password: {
        message: 'Weak password',
      },
    });
  }

  // check code
  if (!validateCode(code)) {
    return fail(400, { password: { message: 'Invalid code' } });
  }
  const emalVerification = await ev.getEmailVerification(event.locals.user.email, code);
  if (!emalVerification) {
    return fail(400, { password: { message: 'Invalid code' } });
  }
  const codeExpired = Date.now() >= emalVerification.expiresAt.getTime();
  if (codeExpired) {
    return fail(400, { password: { message: 'Code expired' } });
  }
  await ev.deleteEmailVerification(event.locals.user.email);

  await auth.invalidateSession(event.locals.session.encodedToken);

  const passwordHash = await hashPassword(newPassword);

  const [updatedUser] = await db
    .update(table.user)
    .set({ passwordHash })
    .where(eq(table.user.id, event.locals.user.id))
    .returning({ id: table.user.id });

  const sessionToken = auth.generateSessionToken();
  const session = await auth.createSession(sessionToken, updatedUser.id);
  auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

  return {
    password: {
      message: 'Updated password',
    },
  };
}

async function updateEmailAction(event: RequestEvent) {
  if (event.locals.user === null) {
    return fail(401, {
      email: {
        message: 'Not authenticated',
      },
    });
  }

  const formData = await event.request.formData();
  const email = formData.get('email');
  const code = formData.get('code') as string;

  if (!verifyEmailInput(email)) {
    return fail(400, {
      email: {
        message: 'Invalid email',
      },
    });
  }
  const emailAvailable = checkUserEmailAvailability(email);
  if (!emailAvailable) {
    return fail(400, {
      email: {
        message: 'This email is already used',
      },
    });
  }

  // check code
  if (!validateCode(code)) {
    return fail(400, { email: { message: 'Invalid code' } });
  }
  const emalVerification = await ev.getEmailVerification(event.locals.user.email, code);
  if (!emalVerification) {
    return fail(400, { email: { message: 'Invalid code' } });
  }
  const codeExpired = Date.now() >= emalVerification.expiresAt.getTime();
  if (codeExpired) {
    return fail(400, { email: { message: 'Code expired' } });
  }
  await ev.deleteEmailVerification(event.locals.user.email);

  await db
    .update(table.user)
    .set({ email })
    .where(eq(table.user.id, event.locals.user.id));

  return {
    email: {
      message: 'Updated email',
    },
  };
}

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

async function updateUsernameAction(event: RequestEvent) {
  if (event.locals.user === null) {
    return fail(401, {
      username: {
        message: 'Not authenticated',
      },
    });
  }

  const formData = await event.request.formData();
  const username = formData.get('username');
  if (!validateUsername(username)) {
    return fail(400, {
      username: {
        message: 'Invalid username',
      },
    });
  }
  const [existingUser] = await db
    .select()
    .from(table.user)
    .where(eq(table.user.username, username));
  if (existingUser) {
    return fail(400, {
      username: {
        message: 'This username is already used',
      },
    });
  }

  await db
    .update(table.user)
    .set({ username })
    .where(eq(table.user.id, event.locals.user.id));

  return {
    username: {
      message: 'Updated username',
    },
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
    return fail(400, { delete: { message: 'Incorrect password' } });
  }

  // check code
  if (!validateCode(code)) {
    return fail(400, { delete: { message: 'Invalid code' } });
  }
  const emalVerification = await ev.getEmailVerification(event.locals.user.email, code);
  if (!emalVerification) {
    return fail(400, { delete: { message: 'Invalid code' } });
  }
  const codeExpired = Date.now() >= emalVerification.expiresAt.getTime();
  if (codeExpired) {
    return fail(400, { delete: { message: 'Code expired' } });
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
