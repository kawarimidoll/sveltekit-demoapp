import { defineConfig } from 'drizzle-kit';

// eslint-disable-next-line node/prefer-global/process
const { DATABASE_URL, DRIVER } = process.env;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const config = {
  out: './drizzle',
  schema: './schema.ts',

  dbCredentials: {
    url: DATABASE_URL,
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql' as const,
  casing: 'snake_case' as const,
  driver: DRIVER,
};

console.log({ userDB: config });

export default defineConfig(config);
