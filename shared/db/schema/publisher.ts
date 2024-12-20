import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { book } from './book';

export const publisher = pgTable('publisher', {
  id: cuid({ needGenerate: true }).primaryKey(),
  name: text().notNull(),
  ...timestamps,
});

export const publisherRelations = relations(publisher, ({ many }) => ({
  books: many(book),
}));
