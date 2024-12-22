import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';
import { getOptionsParam, getPositiveIntParam } from '@shared/logic/params';
import { fail } from '@sveltejs/kit';
import { and, eq, ilike, or } from 'drizzle-orm';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const params = new URLSearchParams(event.url.search);

  const page = getPositiveIntParam(params, 'page');

  const search = params.get('search') || '';

  const sort = getOptionsParam(params, 'sort', ['name']);
  const order = getOptionsParam(params, 'order', ['asc', 'desc']);

  const filters: SQL[] = [];
  if (search) {
    filters.push(or(
      ilike(schema.publisher.name, `%${search}%`),
    )!,
    );
  }

  const per = 10;

  const publishers = await db.query.publisher.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
    extras: (publisher, { sql }) => ({
      count: (sql<number>`count(${publisher.id}) over()`).as('count'),
    }),
  });
  const count = publishers[0]?.count || 0;
  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(event.url, page, maxPage);

  return {
    publishers,
    page,
    per,
    count,
    pagination,
    search,
  };
};

async function upsert(event: RequestEvent, isUpdate: boolean) {
  const formData = await event.request.formData();
  const id = formData.get('id');
  const name = formData.get('name');

  if (isUpdate && (typeof id !== 'string' || !id)) {
    return fail(400, { message: 'Invalid id' });
  }

  // check name
  if (typeof name !== 'string' || !name) {
    return fail(400, { message: 'Invalid name' });
  }

  try {
    if (isUpdate) {
      await db
        .update(schema.publisher)
        .set({ name })
        .where(eq(schema.publisher.id, id));
    }
    else {
      await db
        .insert(schema.publisher)
        .values({ name });
    }
  }
  catch (e) {
    console.error(e);
    return fail(500, { message: 'An error has occurred' });
  }

  return { message: isUpdate ? 'Publisher updated!' : 'Publisher created!' };
}

export const actions: Actions = {

  create: async (event) => {
    return upsert(event, false);
  },
  update: async (event) => {
    return upsert(event, true);
  },
};
