import { defineConfig } from 'drizzle-kit';

// local .env
// DATABASE_URL="./data"
// DRIVER="pglite"

// eslint-disable-next-line node/prefer-global/process
const { DATABASE_URL, DRIVER } = process.env;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const config = {
  out: './drizzle',
  schema: './src/lib/server/db/schema.ts',

  dbCredentials: {
    url: DATABASE_URL,
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql',
  casing: 'snake_case',
};

if (DRIVER) {
  config.driver = DRIVER;
}
console.log(config);

export default defineConfig(config);
