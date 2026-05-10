import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '@/env';

// Normalize sslmode to silence pg-connection-string deprecation warning.
// 'require' will change semantics in pg v9 — 'verify-full' keeps current secure behavior.
const _url = new URL(env.NEON_DATABASE_URL);
_url.searchParams.set('sslmode', 'verify-full');
const connectionString = _url.toString();

const pool = new Pool({
  connectionString,
  max: 5,
  ssl: true,
});

export const db = drizzle(pool);
