import { relations } from 'drizzle-orm';
import {
  date,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { cuid, timestamps, tsz } from './_helper';
import { author } from './author';
import { publisher } from './publisher';
import { user } from './user';

// // to get type:
// type SelectUser = typeof user.$inferSelect;
// type InsertUser = typeof user.$inferInsert;

// the table name (the first argument of `pgTable()`) must be snake_case

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

// relations

export const bookRelations = relations(book, ({ one, many }) => ({
  publisher: one(publisher, {
    fields: [book.publisherId],
    references: [publisher.id],
  }),
  bookAuthors: many(bookAuthor),
}));

export const bookAuthorRelations = relations(bookAuthor, ({ one }) => ({
  author: one(author, {
    fields: [bookAuthor.authorId],
    references: [author.id],
  }),
  book: one(book, {
    fields: [bookAuthor.bookId],
    references: [book.id],
  }),
}));
