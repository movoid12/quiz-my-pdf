import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '@/env';

const connectionString = env.NEON_DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 5,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool);
