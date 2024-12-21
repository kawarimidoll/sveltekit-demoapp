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

  const sort = getOptionsParam(params, 'sort', ['code', 'description']);
  const order = getOptionsParam(params, 'order', ['asc', 'desc']);

  const filters: SQL[] = [];
  if (search) {
    filters.push(or(
      ilike(schema.genre.code, `%${search}%`),
      ilike(schema.genre.description, `%${search}%`),
    )!,
    );
  }

  const per = 10;

  const genres = await db.query.genre.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
    extras: (genre, { sql }) => ({
      count: (sql<number>`count(${genre.id}) over()`).as('count'),
    }),
  });
  const count = genres[0]?.count || 0;
  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(event.url, page, maxPage);

  return {
    genres,
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
  const code = formData.get('code');
  const description = formData.get('description');

  if (isUpdate && (typeof id !== 'string' || !id)) {
    return fail(400, { message: 'Invalid id' });
  }

  // check code
  if (typeof code !== 'string' || !code) {
    return fail(400, { message: 'Invalid code' });
  }

  // check description
  if (typeof description !== 'string' || !description) {
    return fail(400, { message: 'Invalid description' });
  }

  try {
    if (isUpdate) {
      await db
        .update(schema.genre)
        .set({ code, description })
        .where(eq(schema.genre.id, id));
    }
    else {
      await db
        .insert(schema.genre)
        .values({ code, description });
    }
  }
  catch (e) {
    console.error(e);
    return fail(500, { message: 'An error has occurred' });
  }

  return { message: isUpdate ? 'Genre updated!' : 'Genre created!' };
}

export const actions: Actions = {

  create: async (event) => {
    return upsert(event, false);
  },
  update: async (event) => {
    return upsert(event, true);
  },
};
