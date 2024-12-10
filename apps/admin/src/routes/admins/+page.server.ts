import type { RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { checkAdminEmailAvailability, verifyEmailInput } from '@shared/logic/email';
import { hashPassword } from '@shared/logic/password';
import { generateRandomCode } from '@shared/logic/utils';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (_event: RequestEvent) => {
  const admins = await db.select().from(table.admin);
  return { admins };
};

export const actions: Actions = {
  create: async (event) => {
    const formData = await event.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const level = formData.get('level');
    const status = formData.get('status');

    // check name
    if (typeof name !== 'string' || !name) {
      return fail(400, { message: 'Invalid name' });
    }

    // check email
    if (!verifyEmailInput(email)) {
      return fail(400, { message: 'Invalid email' });
    }
    const emailAvailable = await checkAdminEmailAvailability(email);
    if (!emailAvailable) {
      return fail(400, { message: 'Email is already used' });
    }

    // check level
    if (!verifyLevelInput(level)) {
      return fail(400, { message: 'Invalid level' });
    }

    // check status
    if (!verifyStatusInput(status)) {
      return fail(400, { message: 'Invalid status' });
    }

    // generate password
    const password = generateRandomCode(12);
    const passwordHash = await hashPassword(password);

    try {
      await db
        .insert(table.admin)
        .values({ name, email, passwordHash, level, status })
        .returning({ id: table.admin.id });
      sendEmail(email, `Your account has been created. Your password is: ${password}`);
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return { message: 'Admin created!' };
  },
};

function verifyLevelInput(level: unknown): level is typeof table.adminLevel.enumValues[number] {
  return typeof level === 'string' && (table.adminLevel.enumValues as string[]).includes(level);
};

function verifyStatusInput(status: unknown): status is typeof table.adminStatus.enumValues[number] {
  return typeof status === 'string' && (table.adminStatus.enumValues as string[]).includes(status);
}

function sendEmail(email: string, text: string) {
  // NOTE: use send mail api in production
  console.log('--- Send Email ---');
  console.log(`To ${email}:`);
  console.log(text);
  console.log('--------------------------');
}
