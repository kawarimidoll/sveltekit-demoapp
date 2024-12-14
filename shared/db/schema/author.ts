import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { bookAuthor } from './schema';

export const author = pgTable('author', {
  id: cuid({ needGenerate: true }).primaryKey(),
  name: text().notNull(),
  ...timestamps,
});

relations(author, ({ many }) => ({
  bookAuthors: many(bookAuthor),
}));