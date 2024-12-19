import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';
import { error } from '@sveltejs/kit';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

function getValidPageParam(params: URLSearchParams): number {
  const page = Number.parseInt(params.get('page') || '1', 10);
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

// this may cause error when `options` is empty but it's ok for now
function getValidSortParam(params: URLSearchParams, options: string[]): string {
  const sort = params.get('sort') || '';
  return options.includes(sort) ? sort : options[0];
}

export const load: PageServerLoad = async (event: RequestEvent) => {
  const url = new URL(event.url);
  const params = new URLSearchParams(event.url.search);

  const page = getValidPageParam(params);

  const search = params.get('search') || '';

  const sort = getValidSortParam(params, ['id', 'title']);
  const order = params.get('order') === 'desc' ? 'desc' : 'asc';

  const per = 2;

  const filters: SQL[] = [];
  if (search) {
    filters.push(
      or(
        ilike(schema.book.title, `%${search}%`),
        ilike(schema.author.name, `%${search}%`),
        ilike(schema.publisher.name, `%${search}%`),
      ),
    );
  }

  // it needs to join all tables and filter by each column
  // it needs to use distinct to avoid duplicate rows
  // it needs to select all columns to sort by any of them
  const withFilteredBooks = db.$with('withFilteredBooks')
    .as(
      db.selectDistinct({ ...schema.book })
        .from(schema.book)
        .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
        .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
        .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
        .where(and(...filters))
        .orderBy(order === 'desc' ? desc(schema.book[sort]) : asc(schema.book[sort])),
    );

  // it needs only ids to paginate
  // we get total count using window function here to use less sql queries
  const withPagedIds = db.$with('withPagedIds')
    .as(
      db.with(withFilteredBooks)
        .select({
          id: withFilteredBooks.id,
          count: (sql<number>`count(*) over()`).as('count'),
        })
        .from(withFilteredBooks)
        .limit(per)
        .offset((page - 1) * per),
    );

  // map relations to paginated ids
  const rows = await db.with(withPagedIds)
    .select({
      book: schema.book,
      publisher: schema.publisher,
      author: schema.author,
      count: withPagedIds.count,
    })
    .from(withPagedIds)
    .innerJoin(schema.book, eq(schema.book.id, withPagedIds.id))
    .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
    .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
    .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId));
  console.log({ rows });

  const count = rows[0]?.count || 0;
  const maxPage = Math.ceil(count / per);

  if (page > maxPage) {
    return error(404, 'Page not found');
  }

  // https://orm.drizzle.team/docs/joins#aggregating-results
  type BookWithRelation = typeof schema.book.$inferSelect & {
    authors: typeof schema.author.$inferSelect[];
    publisher: typeof schema.publisher.$inferSelect;
  };
  const result = rows
    .reduce<Record<string, BookWithRelation>>(
      (acc, row) => {
        const { book, publisher, author } = row;
        if (!acc[book.id]) {
          acc[book.id] = { ...book, publisher, authors: [] };
        }
        acc[book.id].authors.push(author);
        return acc;
      },
      {},
    );

  const pagination = genPagination(url, page, maxPage);

  return {
    books: Object.values(result),
    page,
    per,
    count,
    pagination,
    search,
  };
};
