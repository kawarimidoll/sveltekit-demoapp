import type { RequestEvent } from '@sveltejs/kit';
import type { SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db, handler, schema } from '@shared/db';
import { genPagination } from '@shared/logic/pagination';
import { getOptionsParam, getPositiveIntParam } from '@shared/logic/params';
import { distinct } from '@std/collections/distinct';
import { parse } from '@std/datetime';
import { error, fail } from '@sveltejs/kit';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

export const load: PageServerLoad = async (event: RequestEvent) => {
  const params = new URLSearchParams(event.url.search);

  const page = getPositiveIntParam(params, 'page');
  const per = getOptionsParam(params, 'per', [10, 20, 50]);

  const search = params.get('search') || '';

  const sort = getOptionsParam(params, 'sort', ['id', 'title']);
  const order = getOptionsParam(params, 'order', ['asc', 'desc']);

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

  const pagination = genPagination(event.url, page, maxPage);

  return {
    books: Object.values(result),
    page,
    per,
    count,
    pagination,
    search,
  };
};

export const actions: Actions = {
  create: async (event) => {
    const formData = await event.request.formData();
    const title = formData.get('title');
    const publisherId = formData.get('publisherId');
    const authorIdsText = formData.get('authorIds');
    const publishDateText = formData.get('publishDate');

    // check title
    if (typeof title !== 'string' || !title) {
      return fail(400, { message: 'Invalid title' });
    }

    // check publisherId
    if (!(await verifyPublisherId(publisherId))) {
      return fail(400, { message: 'Invalid publisherId' });
    }

    // check authorIds
    if (typeof authorIdsText !== 'string' || !authorIdsText) {
      return fail(400, { message: 'Invalid authorIdsText' });
    }
    const authorIds = distinct(
      authorIdsText.split(',').map(id => id.trim()).filter(id => !!id),
    );
    if (!authorIds.length || !(await verifyAuthorIds(authorIds))) {
      return fail(400, { message: 'Invalid authorIds' });
    }

    // check publishDate
    if (typeof publishDateText !== 'string' || !publishDateText) {
      return fail(400, { message: 'Invalid publishDate' });
    }
    const publishDate = parse(publishDateText, 'yyyy-MM-dd');
    if (!publishDate) {
      return fail(400, { message: 'Invalid publishDate' });
    }

    console.log({ title, publisherId, authorIds, publishDate });

    try {
      await handler.insertBook({ title, publisherId, authorId: authorIds, publishDate });
    }
    catch (e) {
      console.error(e);
      return fail(500, { message: 'An error has occurred' });
    }
    return { message: 'Book created!' };
  },
};

async function verifyPublisherId(publisherId: unknown): publisherId is string {
  if (typeof publisherId !== 'string' || !publisherId) {
    return false;
  }
  const result = await db.query.publisher.findFirst({
    where: columns => eq(columns.id, publisherId),
  });
  console.log({ result });
  return !!result;
};

async function verifyAuthorIds(authorIds: string[]): boolean {
  const result = await Promise.all(
    authorIds.map(async (authorId) => {
      return await db.query.author.findFirst({
        where: columns => eq(columns.id, authorId),
      });
    }),
  );
  console.log({ result });
  return result.every(author => !!author);
};
