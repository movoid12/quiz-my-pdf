import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const env = createEnv({
  server: {
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
    NEON_DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().optional(),
  },
  runtimeEnv: {
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },
  onInvalidAccess: (_variable: string) => {
    throw new Error(
      '❌ Attempted to access a server-side environment variable on the client',
    );
  },
});
