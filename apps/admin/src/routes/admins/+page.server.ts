import type { RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { checkAdminEmailAvailability, verifyEmailInput } from '@shared/logic/email';
import { hashPassword } from '@shared/logic/password';
import { generateRandomCode } from '@shared/logic/utils';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

function getValidPageParam(params: URLSearchParams): number {
  const page = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export const load: PageServerLoad = async (event: RequestEvent) => {
  const url = new URL(event.url);
  const params = new URLSearchParams(event.url.search);

  const page = getValidPageParam(params);

  const per = 10;
  const admins = await db.select().from(table.admin).limit(per).offset((page - 1) * per);
  const count = await db.$count(table.admin);
  const maxPage = Math.ceil(count / per);

  let prevUrl: string | null = null;
  let firstUrl: string | null = null;
  if (page > 1) {
    params.set('page', `${page - 1}`);
    url.search = params.toString();
    prevUrl = url.toString();

    params.set('page', '1');
    url.search = params.toString();
    firstUrl = url.toString();
  }

  let nextUrl: string | null = null;
  let lastUrl: string | null = null;
  if (page < maxPage) {
    params.set('page', `${page + 1}`);
    url.search = params.toString();
    nextUrl = url.toString();

    params.set('page', `${maxPage}`);
    url.search = params.toString();
    lastUrl = url.toString();
  }

  return {
    admins,
    page,
    per,
    count,
    maxPage,
    prevUrl,
    firstUrl,
    nextUrl,
    lastUrl,
  };
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
  update: async (event) => {
    const formData = await event.request.formData();
    const id = formData.get('id');
    const name = formData.get('name');
    const email = formData.get('email');
    const level = formData.get('level');
    const status = formData.get('status');

    // check id
    if (typeof id !== 'string' || !id) {
      return fail(400, { message: 'Invalid id' });
    }
    const [currentAdmin] = await db.select()
      .from(table.admin)
      .where(eq(table.admin.id, id))
      .limit(1);

    if (!currentAdmin) {
      return fail(400, { message: 'Invalid id' });
    }

    // check name
    if (typeof name !== 'string' || !name) {
      return fail(400, { message: 'Invalid name' });
    }

    // check email
    if (!verifyEmailInput(email)) {
      return fail(400, { message: 'Invalid email' });
    }
    const currentEmail = currentAdmin.email;
    if (email !== currentEmail) {
      const emailAvailable = await checkAdminEmailAvailability(email);
      if (!emailAvailable) {
        return fail(400, { message: 'Email is already used' });
      }
    }

    // check level
    if (!verifyLevelInput(level)) {
      return fail(400, { message: 'Invalid level' });
    }

    // check status
    if (!verifyStatusInput(status)) {
      return fail(400, { message: 'Invalid status' });
    }

    try {
      await db
        .update(table.admin)
        .set({ name, email, level, status })
        .where(eq(table.admin.id, id));

      if (email !== currentEmail) {
        sendEmail(currentEmail, `Your email has been changed. ${currentEmail} -> ${email}`);
        sendEmail(email, `Your email has been changed. ${currentEmail} -> ${email}`);
      }
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return { message: 'Admin updated!' };
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
