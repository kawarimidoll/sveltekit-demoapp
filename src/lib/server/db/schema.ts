import { createId } from '@paralleldrive/cuid2';
import { char, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// wrapper function for cuid2
function cuid(opts?: { needGenerate: boolean }) {
  if (opts?.needGenerate) {
    return char({ length: 24 }).$defaultFn(() => createId());
  }
  return char({ length: 24 });
}

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
  id: cuid({ needGenerate: true }).primaryKey(),
  age: integer(),
  username: varchar({ length: USERNAME_MAX_LENGTH }).notNull().unique(),
  passwordHash: text().notNull(),
  ...timestamps,
});
export type User = typeof user.$inferSelect;

export const userSession = pgTable('user_session', {
  encodedToken: text().primaryKey(),
  userId: cuid().notNull().references(() => user.id),
  expiresAt: tsz(),
});
export type UserSession = typeof userSession.$inferSelect;

export const ADMIN_NAME_MAX_LENGTH = 64;
export const admin = pgTable('admin', {
  id: cuid({ needGenerate: true }).primaryKey(),
  name: varchar({ length: ADMIN_NAME_MAX_LENGTH }).notNull(),
  email: text().notNull().unique(),
  passwordHash: text().notNull(),
  ...timestamps,
});
export type Admin = typeof admin.$inferSelect;

export const adminSession = pgTable('admin_session', {
  encodedToken: text().primaryKey(),
  adminId: cuid().notNull().references(() => admin.id),
  expiresAt: tsz(),
});
export type AdminSession = typeof adminSession.$inferSelect;
