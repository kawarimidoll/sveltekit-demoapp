import { createId } from '@paralleldrive/cuid2';
import {
  char,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// // to get type:
// type SelectUser = typeof user.$inferSelect;
// type InsertUser = typeof user.$inferInsert;

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
  createdAt: tsz().$defaultFn(() => new Date()),
  updatedAt: tsz().$onUpdate(() => new Date()),
};

// the table name (the first argument of `pgTable()`) must be snake_case

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

export const userSession = pgTable('user_session', {
  encodedToken: text().primaryKey(),
  userId: cuid().notNull().references(() => user.id),
  expiresAt: tsz(),
});

export const emailVerification = pgTable('email_verification', {
  email: text().primaryKey(),
  code: char({ length: 12 }).notNull(),
  expiresAt: tsz(),
});

export const adminLevel = pgEnum('admin_level', ['limited', 'normal', 'super']);
export const adminStatus = pgEnum('admin_status', ['active', 'inactive']);
export const admin = pgTable('admin', {
  id: cuid({ needGenerate: true }).primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  level: adminLevel().notNull().default('limited'),
  status: adminStatus().notNull().default('active'),
  passwordHash: text().notNull(),
  ...timestamps,
});

export const publisher = pgTable('publisher', {
  id: cuid({ needGenerate: true }).primaryKey(),
  name: text().notNull(),
  ...timestamps,
});

export const author = pgTable('author', {
  id: cuid({ needGenerate: true }).primaryKey(),
  name: text().notNull(),
  ...timestamps,
});

export const book = pgTable('book', {
  id: cuid({ needGenerate: true }).primaryKey(),
  title: text().notNull(),
  publishDate: date({ mode: 'date' }).notNull(),
  publisherId: cuid().notNull().references(() => publisher.id),
  ...timestamps,
});

export const bookAuthor = pgTable('book_author', {
  bookId: cuid().notNull().references(() => book.id),
  authorId: cuid().notNull().references(() => author.id),
}, t => ({
  pk: primaryKey({ columns: [t.bookId, t.authorId] }),
}));

export const inventoryStatus = pgEnum('inventory_status', ['available', 'checked out', 'reserved', 'unavailable']);
export const inventoryBuilding = pgEnum('inventory_building', ['main', 'north', 'south']);
export const inventory = pgTable('inventory', {
  id: cuid({ needGenerate: true }).primaryKey(),
  bookId: cuid().notNull().references(() => book.id),
  status: inventoryStatus().notNull().default('available'),
  building: inventoryBuilding().notNull().default('main'),
  ...timestamps,
});

function getTwoWeeksLater() {
  const today = new Date();
  today.setDate(today.getDate() + 14);
  return today;
}
function getFarFuture() {
  return new Date(31557600000000);
}

export const checkout = pgTable('checkout', {
  id: cuid({ needGenerate: true }).primaryKey(),
  userId: cuid().notNull().references(() => user.id),
  inventoryId: cuid().notNull().references(() => inventory.id),
  borrowedAt: tsz().$defaultFn(() => new Date()),
  dueDate: tsz().$defaultFn(getTwoWeeksLater),
  returnedAt: tsz().$defaultFn(getFarFuture),
});
