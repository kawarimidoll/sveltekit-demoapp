import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';
import { getOptionsParam, getPositiveIntParam } from '@shared/logic/params';
import { and, ilike, or } from 'drizzle-orm';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const url = new URL(event.url);
  const params = new URLSearchParams(event.url.search);

  const page = getPositiveIntParam(params, 'page');
  const per = getOptionsParam(params, 'per', [10, 20, 50]);

  const search = params.get('search') || '';

  const sort = getOptionsParam(params, 'sort', ['id', 'username', 'email']);
  const order = getOptionsParam(params, 'order', ['asc', 'desc']);

  const filters: SQL[] = [];
  if (search) {
    filters.push(or(
      // TODO: sanitize search input
      ilike(schema.user.username, `%${search}%`),
      ilike(schema.user.email, `%${search}%`),
    )!,
    );
  }

  const users = await db.query.user.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
  });
  const count = await db.$count(schema.user, and(...filters));
  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(url, page, maxPage);

  return {
    users,
    page,
    per,
    count,
    pagination,
    search,
  };
};
