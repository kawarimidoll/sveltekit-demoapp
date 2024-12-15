import { relations } from 'drizzle-orm';
import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { book } from './book';
import { checkout } from './checkout';

const statuses = ['available', 'checked out', 'reserved', 'unavailable'];
export const inventoryStatus = pgEnum('inventory_status', statuses);

const buildings = ['main', 'north', 'south'];
export const inventoryBuilding = pgEnum('inventory_building', buildings);

export const inventory = pgTable('inventory', {
  id: cuid({ needGenerate: true }).primaryKey(),
  bookId: cuid().notNull().references(() => book.id),
  status: inventoryStatus().notNull().default(statuses[0]),
  building: inventoryBuilding().notNull().default(buildings[0]),
  ...timestamps,
});

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  book: one(book, {
    fields: [inventory.bookId],
    references: [book.id],
  }),
  checkouts: many(checkout),
}));
