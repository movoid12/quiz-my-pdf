/** @type {import('drizzle-kit').Config} */
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL,
  },
};
