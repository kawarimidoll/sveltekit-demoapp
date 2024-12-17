import type { RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';

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

  const per = 20;

  // NOTE: order param is confusing for some reason...
  // console.log({ page, per, sort, order });

  const books = await db.query.book.findMany({
    where: (book, { ilike }) => search ? ilike(book.title, `%${search}%`) : undefined,
    orderBy: (columns, { asc, desc }) =>
      [order === 'desc' ? desc(columns[sort]) : asc(columns[sort])],
    limit: per,
    offset: (page - 1) * per,
    extras: (book, { sql }) => ({
      count: (sql<number>`count(${book.id}) over()`).as('count'),
    }),
    with: {
      bookAuthors: {
        with: {
          author: true,
          // NOTE: this doesn't seem to work well
          // author: {
          //   where: (author, { ilike }) => search ? ilike(author.name, `%${search}%`) : undefined,
          // },
        },
      },
      publisher: true,
    },
  });

  const count = books[0]?.count || 0;

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
