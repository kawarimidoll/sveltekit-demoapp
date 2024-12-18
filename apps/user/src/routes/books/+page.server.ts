import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db, schema } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';
import { and, asc, countDistinct, desc, eq, ilike, or, sql } from 'drizzle-orm';

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

  // generated SQL (by chatgpt):
  //
  // WITH filtered_books AS (
  //   -- 書籍と著者をJOINし、タイトルまたは著者名にキーワードが含まれるものを取得
  //   SELECT
  //     b.id AS book_id,
  //     b.title AS book_title,
  //     a.name AS author_name
  //   FROM book b
  //   INNER JOIN book_author ba ON b.id = ba.book_id
  //   INNER JOIN author a ON ba.author_id = a.id
  //   WHERE b.title LIKE '%6%' OR a.name LIKE '%6%'
  // ),
  // grouped_books AS (
  //   -- 書籍ごとにユニークにし、ページングを適用
  //   SELECT DISTINCT
  //     fb.book_id,
  //     fb.book_title,
  //     fb.author_name
  //   FROM filtered_books fb
  // -- ソート：書籍IDと著者名で並べ替え
  // ORDER BY fb.book_id ASC, fb.author_name ASC
  // -- 書籍単位でページングを適用（LIMIT 5）
  // LIMIT 2 OFFSET 0  -- ここでは書籍数のページングを行っています
  // ),
  // count_books AS (
  //   -- 検索結果の総数を取得（書籍数）
  //   SELECT COUNT(DISTINCT book_id) AS total_count
  //   FROM filtered_books
  // )
  // -- 最終的な結果を取得（ページングとソートを考慮）
  // SELECT
  //   gb.book_id,
  //   gb.book_title,
  //   fb.author_name,
  //   cb.total_count
  // FROM grouped_books gb
  // -- 書籍ごとの著者名を表示するためにJOIN
  // INNER JOIN filtered_books fb ON gb.book_id = fb.book_id
  // -- 検索結果の総数
  // CROSS JOIN count_books cb

  // const filteredBooks
  //   = await db.select({ ...schema.book })
  //     .from(schema.book)
  //     .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
  //     .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
  //     .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
  //     .where(and(...filters));
  // console.log('filteredBooks');
  // console.log(filteredBooks);
  // console.log(filteredBooks.length);

  const withFilteredBooks = db.$with('withFilteredBooks')
    .as(
      db.select({ ...schema.book })
        .from(schema.book)
        .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
        .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
        .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
        .where(and(...filters))
        .orderBy(order === 'desc' ? desc(schema.book[sort]) : asc(schema.book[sort])),
    );

  const withPagedIds = db.$with('withPagedIds')
    .as(
      db.with(withFilteredBooks)
        .selectDistinct({ id: withFilteredBooks.id })
        .from(withFilteredBooks)
        .limit(per)
        .offset((page - 1) * per),
    );

  const withCount = db.$with('withCount')
    .as(
      db.with(withFilteredBooks)
        .select({ count: countDistinct(withFilteredBooks.id).as('count') })
        .from(withFilteredBooks),
    );

  // https://github.com/drizzle-team/drizzle-orm/issues/1414#issuecomment-1777668880
  // Workaround: simulate cross join using full join with constant true condition:
  // fullJoin(column, sql`true`)

  const rows = await db.with(withPagedIds, withCount)
    .select({
      book: schema.book,
      publisher: schema.publisher,
      author: schema.author,
      count: withCount.count,
    })
    .from(withPagedIds)
    .innerJoin(schema.book, eq(schema.book.id, withPagedIds.id))
    .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
    .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
    .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
    .fullJoin(withCount, sql`true`);
  console.log({ rows });

  // const sq = db.selectDistinctOn([schema.book.id], {
  //   id: schema.book.id,
  //   count: (sql<number>`count(${schema.book.id}) over()`).as('count'),
  // })
  //   .from(schema.book)
  //   .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
  //   .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
  //   .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId))
  //   .where(and(...filters))
  //   .orderBy(order === 'desc' ? desc(schema.book[sort]) : asc(schema.book[sort]))
  //   .limit(per)
  //   .offset((page - 1) * per)
  //   .as('sq');

  // const rows = await db.select({
  //   book: schema.book,
  //   publisher: schema.publisher,
  //   author: schema.author,
  //   count: (sql<number>`count(${schema.book.id}) over()`).as('count'),
  // })

  // const rows = await db.select({
  //   book: schema.book,
  //   publisher: schema.publisher,
  //   author: schema.author,
  //   // count: (sql<number>`count(${sq.id}) over()`).as('count'),
  //   count: sq.count,
  // })
  //   .from(sq)
  //   .innerJoin(schema.book, eq(schema.book.id, sq.id))
  //   .innerJoin(schema.publisher, eq(schema.book.publisherId, schema.publisher.id))
  //   .innerJoin(schema.bookAuthor, eq(schema.book.id, schema.bookAuthor.bookId))
  //   .innerJoin(schema.author, eq(schema.author.id, schema.bookAuthor.authorId));

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
  // console.log('result');
  // console.log(result);

  const count = rows[0]?.count || 0;

  const maxPage = Math.ceil(count / per);

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
