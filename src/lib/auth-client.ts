'use client';

import { createAuthClient } from 'better-auth/client';
import { twoFactorClient } from 'better-auth/client/plugins';

import { env } from '@/env';

export const authClient = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: better-auth setup
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/auth/2fa';
      },
    }),
  ],
});

// Session is accessed via authClient.$store.session (reactive atom)
