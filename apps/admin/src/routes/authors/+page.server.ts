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

  const sort = getOptionsParam(params, 'sort', ['name', 'description']);
  const order = getOptionsParam(params, 'order', ['asc', 'desc']);

  const filters: SQL[] = [];
  if (search) {
    filters.push(or(
      ilike(schema.author.name, `%${search}%`),
      ilike(schema.author.description, `%${search}%`),
    )!,
    );
  }

  const per = 10;

  const authors = await db.query.author.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
    extras: (author, { sql }) => ({
      count: (sql<number>`count(${author.id}) over()`).as('count'),
    }),
  });
  const count = authors[0]?.count || 0;
  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(event.url, page, maxPage);

  return {
    authors,
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
  const description = formData.get('description') || '';

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
        .update(schema.author)
        .set({ name, description })
        .where(eq(schema.author.id, id));
    }
    else {
      await db
        .insert(schema.author)
        .values({ name, description });
    }
  }
  catch (e) {
    console.error(e);
    return fail(500, { message: 'An error has occurred' });
  }

  return { message: isUpdate ? 'Author updated!' : 'Author created!' };
}

export const actions: Actions = {

  create: async (event) => {
    return upsert(event, false);
  },
  update: async (event) => {
    return upsert(event, true);
  },
};
