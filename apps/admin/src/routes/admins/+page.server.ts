import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { checkAdminEmailAvailability, verifyEmailInput } from '@shared/logic/email';
import { genPagination } from '@shared/logic/pagination';
import { getOptionsParam, getPositiveIntParam } from '@shared/logic/params';
import { hashPassword } from '@shared/logic/password';
import { generateRandomCode } from '@shared/logic/utils';
import { fail } from '@sveltejs/kit';
import { and, eq, ilike, inArray, or } from 'drizzle-orm';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const url = new URL(event.url);
  const params = new URLSearchParams(event.url.search);

  const page = getPositiveIntParam(params, 'page');
  const per = getOptionsParam(params, 'per', [10, 20, 50]);

  const search = params.get('search') || '';
  const levels = params.has('levels') ? params.getAll('levels') : schema.admin.level.enumValues;
  const statuses = params.has('statuses') ? params.getAll('statuses') : ['active'];

  const sort = getOptionsParam(params, 'sort', ['id', 'name']);
  const order = getOptionsParam(params, 'order', ['asc', 'desc']);

  const filters: SQL[] = [];
  filters.push(inArray(schema.admin.level, levels));
  filters.push(inArray(schema.admin.status, statuses));
  if (search) {
    filters.push(or(
      // TODO: sanitize search input
      ilike(schema.admin.name, `%${search}%`),
      ilike(schema.admin.email, `%${search}%`),
    )!,
    );
  }

  // NOTE: order param is confusing for some reason...
  // console.log({ page, per, sort, order });

  const admins = await db.query.admin.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
  });
  const count = await db.$count(schema.admin, and(...filters));
  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(url, page, maxPage);

  return {
    admins,
    page,
    per,
    count,
    pagination,
    search,
    levels,
    statuses,
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
        .insert(schema.admin)
        .values({ name, email, passwordHash, level, status })
        .returning({ id: schema.admin.id });
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
      .from(schema.admin)
      .where(eq(schema.admin.id, id))
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
        .update(schema.admin)
        .set({ name, email, level, status })
        .where(eq(schema.admin.id, id));

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

function verifyLevelInput(level: unknown): level is typeof schema.admin.level.enumValues[number] {
  return typeof level === 'string' && (schema.admin.level.enumValues as string[]).includes(level);
};

function verifyStatusInput(status: unknown): status is typeof schema.admin.status.enumValues[number] {
  return typeof status === 'string' && (schema.admin.status.enumValues as string[]).includes(status);
}

function sendEmail(email: string, text: string) {
  // NOTE: use send mail api in production
  console.log('--- Send Email ---');
  console.log(`To ${email}:`);
  console.log(text);
  console.log('--------------------------');
}
