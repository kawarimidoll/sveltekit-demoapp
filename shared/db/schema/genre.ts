import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';

export const genre = pgTable('genre', {
  id: cuid({ needGenerate: true }).primaryKey(),
  code: text().notNull().unique(),
  description: text().notNull().default(''),
  ...timestamps,
});
