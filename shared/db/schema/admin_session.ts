import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, tsz } from './_helper';
import { admin } from './admin';

export const adminSession = pgTable('admin_session', {
  encodedToken: text().primaryKey(),
  adminId: cuid().notNull().references(() => admin.id),
  expiresAt: tsz(),
});

export const adminSessionRelations = relations(adminSession, ({ one }) => ({
  admin: one(admin, {
    fields: [adminSession.adminId],
    references: [admin.id],
  }),
}));
