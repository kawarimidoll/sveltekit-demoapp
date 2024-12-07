import { PGlite } from '@electric-sql/pglite';
import { resolve } from '@std/path/resolve';
import { drizzle } from 'drizzle-orm/pglite';

// eslint-disable-next-line node/prefer-global/process
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}
const url = DATABASE_URL.startsWith('.')
  ? resolve(import.meta.dirname, './data')
  : DATABASE_URL;

console.log(`DB URL: ${url}`);
const client = new PGlite(url);
const casing = 'snake_case';
export const db = drizzle({ client, casing, logger: true });
