import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { bookAuthor } from './book_author';

export const author = pgTable('author', {
  id: cuid({ needGenerate: true }).primaryKey(),
  name: text().notNull(),
  description: text().notNull().default(''),
  ...timestamps,
});

export const authorRelations = relations(author, ({ many }) => ({
  bookAuthors: many(bookAuthor),
}));
