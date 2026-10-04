import { test } from '@e2e-dev/web';
import { credentials, expect } from 'e2e';

// The test account is provisioned separately; this setup only verifies sign-in.
test.setup(
  'authenticate as testUser',
  { sessions: ['testUser'] },
  async ({ app, screen, session, browser }) => {
    const user = credentials.user('testUser');
    await app.open('/auth/sign-in');
    await screen.getByLabel('Email').fill(user.username);
    await screen.getByLabel('Password').fill(user.password);
    await screen.getByRole('button', 'Sign In').tap();
    await expect(browser).toHaveURL('/dashboard/start');
    await session.save('testUser');
  },
);
