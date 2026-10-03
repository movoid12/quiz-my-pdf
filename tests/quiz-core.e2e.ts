import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('dashboard requires sign-in', async ({ app, browser }) => {
  await app.open('/dashboard/start');
  await expect(browser).toHaveURL(/\/auth\/sign-in/);
});

test('sign-in form renders', async ({ app, screen }) => {
  await app.open('/auth/sign-in');
  await expect(screen.getByLabel('Email')).toBeVisible();
  await expect(screen.getByLabel('Password')).toBeVisible();
  await expect(screen.getByRole('button', 'Sign In')).toBeVisible();
});

test('authed start page shows upload flow', { session: 'testUser' }, async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/dashboard/start');
  await expect(browser).toHaveURL('/dashboard/start');
  await expect(screen.getByText('Get Started - Upload Your PDF')).toBeVisible();
  await expect(browser.locator('input[type="file"]')).toBeVisible();
});

/* Step 3 agent flow – uses OpenAI subscription.
ponytail: one goal per act, assert meaning not phrasing. */
test('agent generates quiz from PDF', { session: 'testUser' }, async ({ app, agent, screen }) => {
  await app.open('/dashboard/start');
  await agent.act('upload tests/fixtures/sample.pdf and choose medium difficulty to generate the quiz');
  await agent.assert('5 multiple-choice questions are visible');
  await expect(screen.getByRole('button', { name: /generate quiz/i })).toBeHidden();
});
