import { relations } from 'drizzle-orm';
import { date, pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { bookAuthor } from './book_author';
import { publisher } from './publisher';

export const book = pgTable('book', {
  id: cuid({ needGenerate: true }).primaryKey(),
  title: text().notNull(),
  publishDate: date({ mode: 'date' }).notNull(),
  publisherId: cuid().notNull().references(() => publisher.id),
  ...timestamps,
});

export const bookRelations = relations(book, ({ one, many }) => ({
  publisher: one(publisher, {
    fields: [book.publisherId],
    references: [publisher.id],
  }),
  bookAuthors: many(bookAuthor),
}));
