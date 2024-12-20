import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { genPagination } from '@shared/logic/pagination';
import { and, ilike, or } from 'drizzle-orm';

function getValidPageParam(params: URLSearchParams): number {
  const page = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export const load: PageServerLoad = async (event: RequestEvent) => {
  const url = new URL(event.url);
  const params = new URLSearchParams(event.url.search);

  const page = getValidPageParam(params);

  const search = params.get('search') || '';

  const sort = params.get('sort') || 'id';
  const order = params.get('order') === 'desc' ? 'desc' : 'asc';

  const filters: SQL[] = [];
  if (search) {
    filters.push(or(
      // TODO: sanitize search input
      ilike(table.user.username, `%${search}%`),
      ilike(table.user.email, `%${search}%`),
    )!,
    );
  }

  const per = 10;

  const users = await db.query.user.findMany({
    where: and(...filters),
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
  });
  const count = await db.$count(table.user, and(...filters));
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
