import { web } from '@e2e-dev/web';
import type { E2EConfig } from 'e2e';
import { chatgpt } from 'e2e/oauth/chatgpt';

export default {
  // Your ChatGPT subscription serves the model; sign in once with `e2e login openai`, `e2e models openai` lists the ids.
  agents: {
    default: {
      model: chatgpt('gpt-6-luna'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  targets: [
    {
      engine: web(),
      app: {
        url: process.env.APP_URL ?? 'http://localhost:3000',
        command: { executable: 'pnpm', args: ['dev'] },
      },
    },
  ],
  // ponytail: test user has no 2FA (created via API, not sign-up form). Override in CI: E2E_USER_TESTUSER_USERNAME / E2E_USER_TESTUSER_PASSWORD.
  credentials: {
    testUser: {
      username: process.env.E2E_USER_TESTUSER_USERNAME ?? 'e2e@example.test',
      password:
        process.env.E2E_USER_TESTUSER_PASSWORD ?? 'e2e-test-password-123',
    },
  },
} satisfies E2EConfig;
