import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { checkAdminEmailAvailability, verifyEmailInput } from '@shared/logic/email';
import { hashPassword } from '@shared/logic/password';
import { generateRandomCode } from '@shared/logic/utils';
import { fail } from '@sveltejs/kit';
import { and, eq, ilike, inArray, or } from 'drizzle-orm';

function getValidPageParam(params: URLSearchParams): number {
  const page = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export const load: PageServerLoad = async (event: RequestEvent) => {
  const url = new URL(event.url);
  const params = new URLSearchParams(event.url.search);

  const page = getValidPageParam(params);

  const search = params.get('search') || '';
  const levels = params.has('levels') ? params.getAll('levels') : table.adminLevel.enumValues;
  const statuses = params.has('statuses') ? params.getAll('statuses') : ['active'];

  const sort = params.has('sort') ? params.get('sort') : 'id';
  const order = params.get('order') === 'desc' ? 'desc' : 'asc';

  const filters: SQL[] = [];
  filters.push(inArray(table.admin.level, levels));
  filters.push(inArray(table.admin.status, statuses));
  if (search) {
    filters.push(or(
      // TODO: sanitize search input
      ilike(table.admin.name, `%${search}%`),
      ilike(table.admin.email, `%${search}%`),
    )!,
    );
  }

  const per = 10;

  // NOTE: order param is confusing for some reason...
  // console.log({ page, per, sort, order });

  const admins = await db.query.admin.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
  });
  const count = await db.$count(table.admin, and(...filters));
  const maxPage = Math.ceil(count / per);

  const pagination: Record<string, number | string> = {
    current: page,
    max: maxPage,
  };
  if (page > 1) {
    params.set('page', `${page - 1}`);
    url.search = params.toString();
    pagination.prev = url.toString();

    params.set('page', '1');
    url.search = params.toString();
    pagination.first = url.toString();
  }

  if (page < maxPage) {
    params.set('page', `${page + 1}`);
    url.search = params.toString();
    pagination.next = url.toString();

    params.set('page', `${maxPage}`);
    url.search = params.toString();
    pagination.last = url.toString();
  }

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
