import { env } from '$env/dynamic/private';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const client = new PGlite(env.DATABASE_URL);
const casing = 'snake_case';
export const db = drizzle({ client, casing, logger: true });
