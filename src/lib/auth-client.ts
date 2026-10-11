'use client';

import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { routes } from '@/lib/routes';

// ponytail: same-origin default; NEXT_PUBLIC_BETTER_AUTH_URL is documented optional.
export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = routes.auth.twoFactor;
      },
    }),
  ],
});
