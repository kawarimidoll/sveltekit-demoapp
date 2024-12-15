import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { userSession } from './user_session';

export const user = pgTable('user', {
  id: cuid({ needGenerate: true }).primaryKey(),
  borrowLimit: integer().notNull().default(5),
  email: text().notNull().unique(),
  username: varchar({ length: 31 }).notNull().unique().$defaultFn(() => createId()),
  passwordHash: text().notNull(),
  ...timestamps,
});
// to get max length:
//   user.username.length

export const userRelations = relations(user, ({ many }) => ({
  userSessions: many(userSession),
}));
