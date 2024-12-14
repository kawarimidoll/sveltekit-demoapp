import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid } from './_helper';

export const genre = pgTable('genre', {
  id: cuid({ needGenerate: true }).primaryKey(),
  code: text().notNull(),
  description: text().notNull().default(''),
});
