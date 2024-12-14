import { relations } from 'drizzle-orm';
import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { book } from './book';
import { checkout } from './checkout';

const inventoryStatus = pgEnum('inventory_status', ['available', 'checked out', 'reserved', 'unavailable']);
const inventoryBuilding = pgEnum('inventory_building', ['main', 'north', 'south']);

export const inventory = pgTable('inventory', {
  id: cuid({ needGenerate: true }).primaryKey(),
  bookId: cuid().notNull().references(() => book.id),
  status: inventoryStatus().notNull().default('available'),
  building: inventoryBuilding().notNull().default('main'),
  ...timestamps,
});

relations(inventory, ({ one, many }) => ({
  book: one(book, {
    fields: [inventory.bookId],
    references: [book.id],
  }),
  checkouts: many(checkout),
}));
