import { createId } from '@paralleldrive/cuid2';
import { char, timestamp } from 'drizzle-orm/pg-core';

// wrapper function for cuid2
export function cuid(opts?: { needGenerate: boolean }) {
  if (opts?.needGenerate) {
    return char({ length: 24 }).$defaultFn(() => createId());
  }
  return char({ length: 24 });
}

// wrapper function for timestamp with zone
export function tsz() {
  return timestamp({ withTimezone: true, mode: 'date', precision: 3 }).notNull();
}

export const timestamps = {
  createdAt: tsz().$defaultFn(() => new Date()),
  updatedAt: tsz().$onUpdate(() => new Date()),
};
