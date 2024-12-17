import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';
import { and, asc, desc, eq, ilike, inArray, or } from 'drizzle-orm';

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

  const per = 2;

  // NOTE: order param is confusing for some reason...
  // console.log({ page, per, sort, order });

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

  // const sq = db.$with('sq')
  //   .as(
  //     db.selectDistinct({ id: schema.book.id })
  //       .from(schema.book)
  //       .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
  //       .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
  //       .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
  //       .where(and(...filters)),
  //   );

  const sq = db.selectDistinct({ id: schema.book.id })
    .from(schema.book)
    .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
    .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
    .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
    .where(and(...filters))
    .orderBy(order === 'desc' ? desc(schema.book[sort]) : asc(schema.book[sort]))
    .limit(per)
    .offset((page - 1) * per);

  const rows = await db.select()
    .from(schema.book)
    .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
    .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
    .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
    .where(inArray(schema.book.id, sq));

  // const rows = await db.select()
  //   .from(schema.book)
  //   .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
  //   .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
  //   .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
  //   .where(and(...filters))
  //   .orderBy(order === 'desc' ? desc(schema.book[sort]) : asc(schema.book[sort]))
  //   .limit(per)
  //   .offset((page - 1) * per);

  // https://orm.drizzle.team/docs/joins#aggregating-results
  type Book = typeof schema.book.$inferSelect;
  type Publisher = typeof schema.publisher.$inferSelect;
  type Author = typeof schema.author.$inferSelect;
  console.log(rows);
  const result = rows
    .reduce<Record<string, { book: Book; publisher: Publisher; authors: Author[] }>>(
      (acc, row) => {
        const { book, publisher, author } = row;
        if (!acc[book.id]) {
          acc[book.id] = { book, publisher, authors: [] };
        }
        acc[book.id].authors.push(author);
        return acc;
      },
      {},
    );

  // const count = books[0]?.count || 0;
  // TODO: count
  const count = 10;

  const maxPage = Math.ceil(count / per);

  const pagination = genPagination(url, page, maxPage);

  return {
    items: Object.values(result),
    page,
    per,
    count,
    pagination,
    search,
  };
};
