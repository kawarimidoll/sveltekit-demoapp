import { distinct } from '@std/collections/distinct';
import { db, schema } from '../';

interface InsertBookParams {
  title: string;
  publishDate: Date;
  publisherId?: string;
  publisher?: typeof schema.publisher;
  authorId?: string | string[];
  author?: typeof schema.author | typeof schema.author[];
}

export async function insertBook({
  title,
  publishDate,
  publisherId,
  publisher,
  authorId,
  author,
}: InsertBookParams) {
  if (publisherId && publisher) {
    throw new Error('Both publisherId and publisher are provided. Please provide only one.');
  }
  if (!publisherId && !publisher) {
    throw new Error('Neither publisherId nor publisher is provided. Please provide one.');
  }
  if (authorId && author) {
    throw new Error('Both authorId and author are provided. Please provide only one.');
  }
  if (!authorId && !author) {
    throw new Error('Neither authorId nor author is provided. Please provide one.');
  }

  if (publisher) {
    publisherId = publisher.id;
  }

  let authorIds: string[] = [];
  if (authorId) {
    authorIds = Array.isArray(authorId) ? authorId : [authorId];
  }
  else {
    authorIds = (Array.isArray(author) ? author : [author]).map(author => author.id);
  }
  authorIds = distinct(authorIds);
  if (authorIds.length === 0) {
    throw new Error('No author is provided.');
  }

  return await db.transaction(async (tx) => {
    const [insertedBook] = await tx.insert(schema.book)
      .values({ title, publishDate, publisherId })
      .returning();
    const bookId = insertedBook.id;

    await tx.insert(schema.bookAuthor)
      .values(authorIds.map(authorId => ({ bookId, authorId })));

    return insertedBook;
  });
}
