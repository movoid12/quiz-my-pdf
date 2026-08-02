import { defineConfig } from 'drizzle-kit';

const url = process.env.NEON_DATABASE_URL;
if (!url) {
  throw new Error('NEON_DATABASE_URL is not set');
}

export default defineConfig({
  out: './drizzle',
  casing: 'camelCase',
  dialect: 'postgresql',
  dbCredentials: {
    url,
  },
});
