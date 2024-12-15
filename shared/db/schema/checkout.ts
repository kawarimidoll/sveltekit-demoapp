import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';
import { cuid, tsz } from './_helper';
import { inventory } from './inventory';
import { user } from './user';

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

export const checkoutRelations = relations(checkout, ({ one }) => ({
  user: one(user, {
    fields: [checkout.userId],
    references: [user.id],
  }),
  inventory: one(inventory, {
    fields: [checkout.inventoryId],
    references: [inventory.id],
  }),
}));
