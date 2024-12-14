import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, tsz } from './_helper';
import { user } from './user';

export const userSession = pgTable('user_session', {
  encodedToken: text().primaryKey(),
  userId: cuid().notNull().references(() => user.id),
  expiresAt: tsz(),
});

export const userSessionRelations = relations(userSession, ({ one }) => ({
  user: one(user, {
    fields: [userSession.userId],
    references: [user.id],
  }),
}));
