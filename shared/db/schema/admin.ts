import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { cuid, timestamps } from './_helper';
import { adminSession } from './admin_session';

const adminLevel = pgEnum('admin_level', ['limited', 'normal', 'super']);
const adminStatus = pgEnum('admin_status', ['active', 'inactive']);

export const admin = pgTable('admin', {
  id: cuid({ needGenerate: true }).primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  level: adminLevel().notNull().default('limited'),
  status: adminStatus().notNull().default('active'),
  passwordHash: text().notNull(),
  ...timestamps,
});

relations(admin, ({ many }) => ({
  adminSessions: many(adminSession),
}));
