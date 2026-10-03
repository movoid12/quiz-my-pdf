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

/* Step 3 core loop, fully deterministic (no model): the file input is invisible
to the agent's a11y tree (drop-zone exposes role=button), so upload via Playwright. */
test('generates quiz from PDF', {
  session: 'testUser',
  timeout: 120_000,
}, async ({ app, screen, browser }) => {
  await app.open('/dashboard/start');
  await browser
    .locator('input[type="file"]')
    .setInputFiles('tests/fixtures/sample.pdf');
  await expect(screen.getByText(/PDF uploaded successfully/)).toBeVisible();
  await screen.getByRole('button', 'Generate Quiz').tap();
  await screen.getByRole('button', 'Medium').tap();
  await expect(browser).toHaveURL(/\/dashboard\/quiz\//);
  await expect(screen.getByText('Question 1 of 5')).toBeVisible();
});
