import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    setupFiles: ['src/components/__tests__/setup.ts'],
    env: {
      GOOGLE_GENERATIVE_AI_API_KEY: 'test-key',
      NEON_DATABASE_URL: 'https://test.com',
      BETTER_AUTH_SECRET: 'test-secret-123',
      GOOGLE_CLIENT_ID: 'test-client-id',
      GOOGLE_CLIENT_SECRET: 'test-client-secret',
      BETTER_AUTH_URL: 'http://localhost:3000',
      NEXT_PUBLIC_BETTER_AUTH_URL: 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
