import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { adminSession } from './admin_session';

const levels = ['limited', 'normal', 'super'];
export const adminLevel = pgEnum('admin_level', levels);

const statuses = ['active', 'inactive'];
export const adminStatus = pgEnum('admin_status', statuses);

export const admin = pgTable('admin', {
  id: cuid({ needGenerate: true }).primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  level: adminLevel().notNull().default(levels[0]),
  status: adminStatus().notNull().default(statuses[0]),
  passwordHash: text().notNull(),
  ...timestamps,
});

export const adminRelations = relations(admin, ({ many }) => ({
  adminSessions: many(adminSession),
}));
