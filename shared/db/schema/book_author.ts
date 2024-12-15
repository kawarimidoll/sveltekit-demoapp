import { relations } from 'drizzle-orm';
import { pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { cuid } from './_helper';
import { author } from './author';
import { book } from './book';

export const bookAuthor = pgTable('book_author', {
  bookId: cuid().notNull().references(() => book.id),
  authorId: cuid().notNull().references(() => author.id),
}, t => ({
  pk: primaryKey({ columns: [t.bookId, t.authorId] }),
}));

export const bookAuthorRelations = relations(bookAuthor, ({ one }) => ({
  author: one(author, {
    fields: [bookAuthor.authorId],
    references: [author.id],
  }),
  book: one(book, {
    fields: [bookAuthor.bookId],
    references: [book.id],
  }),
}));
