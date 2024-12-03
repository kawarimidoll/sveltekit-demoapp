import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// the table name (the first argument of `pgTable()`) must be snake_case

export const user = pgTable('user', {
  id: text().primaryKey(),
  age: integer(),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
});
export type User = typeof user.$inferSelect;

export const userSession = pgTable('user_session', {
  id: text().primaryKey(),
  userId: text().notNull().references(() => user.id),
  expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
});
export type UserSession = typeof userSession.$inferSelect;
