// import { schema } from '@shared/db';
// import { createInsertSchema, updateInsertSchema } from 'drizzle-zod';
// import { parse } from 'zod';

import { z } from 'zod';

export const insertSchema = z.object({
  name: z.string().nonempty().max(255),
  description: z.string().optional(),
});
export type InsertSchema = typeof insertSchema;

export const updateSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty().max(255),
  description: z.string().optional(),
});
export type UpdateSchema = typeof updateSchema;
