import { github } from '@e2e-dev/github';
import { web } from '@e2e-dev/web';
import { gateway } from 'ai';
import type { E2EConfig } from 'e2e';

export default {
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  targets: [
    {
      engine: web(),
      app: {
        url: process.env.APP_URL ?? 'http://localhost:3000',
        command: {
          executable: 'pnpm',
          args: ['dev'],
          env: {
            GOOGLE_GENERATIVE_AI_API_KEY:
              process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '',
            NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ?? '',
            BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? '',
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? '',
            NEXT_PUBLIC_BETTER_AUTH_URL:
              process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? '',
          },
        },
      },
    },
  ],
  reporters: ['list', github()],
  // ponytail: test user has no 2FA (created via API, not sign-up form). Override in CI: E2E_USER_TESTUSER_USERNAME / E2E_USER_TESTUSER_PASSWORD.
  credentials: {
    testUser: {
      username: process.env.E2E_USER_TESTUSER_USERNAME ?? 'e2e@example.test',
      password:
        process.env.E2E_USER_TESTUSER_PASSWORD ?? 'e2e-test-password-123',
    },
  },
} satisfies E2EConfig;
