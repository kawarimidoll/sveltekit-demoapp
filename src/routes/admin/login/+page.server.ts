import type { Actions, PageServerLoad } from './$types';
import * as m from '$lib/paraglide/messages.js';
import * as auth from '$lib/server/admin-auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
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
  if (event.locals.admin) {
    return i18nRedirect(event.url, '/admin');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email)) {
      return fail(400, { message: m.invalidEmail() });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: m.invalidPassword() });
    }

    const results = await db
      .select()
      .from(table.admin)
      .where(eq(table.admin.email, email));

    const existingAdmin = results.at(0);
    if (!existingAdmin) {
      return fail(400, { message: m.incorrectCredential() });
    }

    const validPassword = await verify(existingAdmin.passwordHash, password, hashParams);
    if (!validPassword) {
      return fail(400, { message: m.incorrectCredential() });
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingAdmin.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return i18nRedirect(event.url, '/admin');
  },
  register: async (event) => {
    console.info('admin register');
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email)) {
      return fail(400, { message: m.invalidEmail() });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: m.invalidPassword() });
    }

    const passwordHash = await hash(password, hashParams);

    try {
      // return value of db.insert() is array
      const [insertedAdmin] = await db
        .insert(table.admin)
        .values({ email, name: email, passwordHash })
        .returning({ id: table.admin.id });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, insertedAdmin.id);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return i18nRedirect(event.url, '/admin');
  },
};

function validateEmail(email: unknown): email is string {
  // note: Checking length in regexp is simple but potentially vulnerable to a super long string.
  return (
    typeof email === 'string'
    && email.length >= 3
    && email.length < 256
    && /^[^@]+@[^.]+\..+$/.test(email)
  );
}

function _validateName(name: unknown): name is string {
  // note: Checking length in regexp is simple but potentially vulnerable to a super long string.
  return (
    typeof name === 'string'
    && name.length >= 3
    && name.length <= table.ADMIN_NAME_MAX_LENGTH
  );
}

function validatePassword(password: unknown): password is string {
  return (
    typeof password === 'string'
    && password.length >= 6
    && password.length <= 255
  );
}
