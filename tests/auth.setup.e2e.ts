import { test } from '@e2e-dev/web';
import { credentials, expect } from 'e2e';

// ponytail: UI sign-up forces 2FA, so the seed script creates this user via API (no 2FA).
test.setup(
  'authenticate as testUser',
  { sessions: ['testUser'] },
  async ({ app, screen, session, browser }) => {
    const user = credentials.user('testUser');
    const baseUrl = app.baseUrl ?? 'http://localhost:3000';
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.set('Origin', baseUrl);
    headers.set('Referer', new URL('/auth/sign-up', baseUrl).toString());
    const signup = await fetch(new URL('/api/auth/sign-up/email', baseUrl), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'e2e Test',
        email: user.username,
        password: user.password,
      }),
    });
    const signupResult = await signup.json().catch(() => ({}));
    if (
      !(
        signup.ok ||
        JSON.stringify(signupResult).match(/exist|taken|duplicate/i)
      )
    ) {
      throw new Error(`Could not seed e2e user (${signup.status})`);
    }

    await app.open('/auth/sign-in');
    await screen.getByLabel('Email').fill(user.username);
    await screen.getByLabel('Password').fill(user.password);
    await screen.getByRole('button', 'Sign In').tap();
    await expect(browser).toHaveURL('/dashboard/start');
    await session.save('testUser');
  },
);
