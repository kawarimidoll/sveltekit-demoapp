import { char, pgTable, text } from 'drizzle-orm/pg-core';
import { tsz } from './_helper';

export const emailVerification = pgTable('email_verification', {
  email: text().primaryKey(),
  code: char({ length: 12 }).notNull(),
  expiresAt: tsz(),
});
