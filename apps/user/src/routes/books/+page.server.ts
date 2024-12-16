import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '@shared/db';
import * as table from '@shared/db/schema';
import { genPagination } from '@shared/logic/pagination';
import { ilike, or } from 'drizzle-orm';

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
      // TODO: search by author name
      ilike(table.book.title, `%${search}%`),
      ilike(table.author.name, `%${search}%`),
    )!,
    );
  }

  const per = 20;

  // NOTE: order param is confusing for some reason...
  // console.log({ page, per, sort, order });

  const books = await db.query.book.findMany({
    where: (book, { ilike }) => search ? ilike(book.title, `%${search}%`) : undefined,
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
    with: {
      bookAuthors: {
        with: {
          author: true,
          // NOTE: this is 'and' query, but I want to use 'or' query
          // author: {
          //   where: (author, { ilike }) => search ? ilike(author.name, `%${search}%`) : true,
          // },
        },
      },
      publisher: true,
    },
  });

  const count = (await db.query.book.findMany({
    where: (book, { ilike }) => search ? ilike(book.title, `%${search}%`) : undefined,
    with: {
      bookAuthors: { with: { author: true } },
      publisher: true,
    },
  })).length;

  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(url, page, maxPage);

  return {
    books,
    page,
    per,
    count,
    pagination,
    search,
  };
};
