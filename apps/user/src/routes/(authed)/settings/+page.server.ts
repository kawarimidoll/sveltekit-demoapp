import type { Actions, RequestEvent } from './$types';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { checkEmailAvailability, verifyEmailInput } from '$lib/server/email';
import {
  hashPassword,
  verifyPasswordHash,
  verifyPasswordInput,
  verifyPasswordStrength,
} from '$lib/server/password';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
  update_password: updatePasswordAction,
  update_email: updateEmailAction,
  update_username: updateUsernameAction,
};

async function updatePasswordAction(event: RequestEvent) {
  if (!auth.isAuth(event) || event.locals.user === null) {
    return fail(401, {
      password: {
        message: 'Not authenticated',
      },
    });
  }

  const formData = await event.request.formData();
  const currentPassword = formData.get('current_password') as string;
  const newPassword = formData.get('new_password');
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

  const [existingUser] = await db
    .select()
    .from(table.user)
    .where(eq(table.user.id, event.locals.user.id));
  const validPassword = await verifyPasswordHash(existingUser.passwordHash, currentPassword);
  if (!validPassword) {
    return fail(400, {
      password: {
        message: 'Incorrect password',
      },
    });
  }
  await auth.invalidateSession(event.locals.session.id);

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
  if (!verifyEmailInput(email)) {
    return fail(400, {
      email: {
        message: 'Invalid email',
      },
    });
  }
  const emailAvailable = checkEmailAvailability(email);
  if (!emailAvailable) {
    return fail(400, {
      email: {
        message: 'This email is already used',
      },
    });
  }

  // TODO verify email
  // return redirect(302, "/verify-email");

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
