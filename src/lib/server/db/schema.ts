import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// wrapper function for timestamp with zone
function tsz() {
  return timestamp({ withTimezone: true, mode: 'date', precision: 3 }).notNull();
}

const timestamps = {
  createdAt: tsz().$default(() => new Date()),
  updatedAt: tsz().$onUpdate(() => new Date()),
};

export const USERNAME_MAX_LENGTH = 31;
export const user = pgTable('user', {
  id: uuid().defaultRandom().primaryKey(),
  age: integer(),
  username: varchar({ length: USERNAME_MAX_LENGTH }).notNull().unique(),
  passwordHash: text().notNull(),
  ...timestamps,
});

export const session = pgTable('session', {
  encodedToken: text().primaryKey(),
  userId: uuid().notNull().references(() => user.id),
  expiresAt: tsz(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
