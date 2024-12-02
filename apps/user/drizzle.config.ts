import { defineConfig } from 'drizzle-kit';

// eslint-disable-next-line node/prefer-global/process
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',

  dbCredentials: {
    url: DATABASE_URL,
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql',
});
