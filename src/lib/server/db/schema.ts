import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const timestampOptions = { withTimezone: true, mode: 'date', precision: 3 };
const timestamps = {
  createdAt: timestamp(timestampOptions).notNull().$default(() => new Date()),
  updatedAt: timestamp(timestampOptions).notNull().$onUpdate(() => new Date()),
};

export const user = pgTable('user', {
  id: uuid().defaultRandom().primaryKey(),
  age: integer(),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
  ...timestamps,
});

export const session = pgTable('session', {
  encodedToken: text().primaryKey(),
  userId: uuid().notNull().references(() => user.id),
  expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
