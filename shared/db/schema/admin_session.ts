import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, tsz } from './_helper';
import { admin } from './schema';

export const adminSession = pgTable('admin_session', {
  encodedToken: text().primaryKey(),
  adminId: cuid().notNull().references(() => admin.id),
  expiresAt: tsz(),
});

relations(adminSession, ({ one }) => ({
  admin: one(admin, {
    fields: [adminSession.adminId],
    references: [admin.id],
  }),
}));
