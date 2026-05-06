'use client';

import { createAuthClient } from 'better-auth/client';
import { twoFactorClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  // biome-ignore lint/style/useNamingConvention: better-auth setup
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = '/auth/2fa';
      },
    }),
  ],
});

// Session is accessed via authClient.$store.session (reactive atom)
