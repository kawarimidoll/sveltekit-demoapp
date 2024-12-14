import { relations } from 'drizzle-orm';
import { date, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { author } from './author';
import { publisher } from './publisher';

// // to get type:
// type SelectUser = typeof user.$inferSelect;
// type InsertUser = typeof user.$inferInsert;

// the table name (the first argument of `pgTable()`) must be snake_case

export const book = pgTable('book', {
  id: cuid({ needGenerate: true }).primaryKey(),
  title: text().notNull(),
  publishDate: date({ mode: 'date' }).notNull(),
  publisherId: cuid().notNull().references(() => publisher.id),
  ...timestamps,
});

export const bookAuthor = pgTable('book_author', {
  bookId: cuid().notNull().references(() => book.id),
  authorId: cuid().notNull().references(() => author.id),
}, t => ({
  pk: primaryKey({ columns: [t.bookId, t.authorId] }),
}));

// relations

export const bookRelations = relations(book, ({ one, many }) => ({
  publisher: one(publisher, {
    fields: [book.publisherId],
    references: [publisher.id],
  }),
  bookAuthors: many(bookAuthor),
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
