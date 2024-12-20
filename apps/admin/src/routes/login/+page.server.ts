import type { Actions, PageServerLoad } from './$types';
import { i18n } from '$lib/i18n';
import * as auth from '$lib/server/auth';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { verifyEmailInput } from '@shared/logic/email';
import { verifyPasswordHash, verifyPasswordInput } from '@shared/logic/password';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
  if (event.locals.admin) {
    return redirect(302, i18n.resolveRoute('/'));
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    // check email
    if (!verifyEmailInput(email)) {
      return fail(400, { message: 'Invalid email' });
    }

    // check password
    if (!verifyPasswordInput(password)) {
      return fail(400, { message: 'Invalid password' });
    }

    const [existingAdmin] = await db
      .select()
      .from(table.admin)
      .where(eq(table.admin.email, email));
    if (!existingAdmin) {
      return fail(400, { message: 'Incorrect email or password' });
    }

    const validPassword = await verifyPasswordHash(existingAdmin.passwordHash, password);
    if (!validPassword) {
      return fail(400, { message: 'Incorrect email or password' });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingAdmin.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, i18n.resolveRoute('/'));
  },
};
