import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) { throw new Error('NEON_DATABASE_URL is not set in environment'); }

const pool = new Pool({
  connectionString,
  max: 5,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool);
