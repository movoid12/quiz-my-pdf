import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from '@/env';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  casing: 'camelCase',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.NEON_DATABASE_URL,
  },
});
