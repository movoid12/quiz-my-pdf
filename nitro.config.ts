import { defineNitroConfig } from 'nitro/config';

// ponytail: static headers only; full CSP needs app-specific tuning against
// Start's inline Scripts, HSTS belongs to the hosting platform.
export default defineNitroConfig({
  routeRules: {
    '/**': {
      headers: {
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SAMEORIGIN',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
  },
});
