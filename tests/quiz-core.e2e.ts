import type { Browser } from '@e2e-dev/web';
import { test } from '@e2e-dev/web';
import type { Screen } from 'e2e';
import { expect } from 'e2e';

/* Answers every question with the first option and submits. */
async function answerAllAndSubmit(screen: Screen, browser: Browser) {
  
  for (let q = 1; q <= 5; q += 1) {
    await expect(screen.getByText(`Question ${q} of 5`)).toBeVisible();
    await browser.locator('input[type="radio"]').first().click();
    if (q < 5) {
      await screen.getByRole('button', 'Next Question').tap();
    }
  }
  await screen.getByRole('button', 'Submit Quiz').tap();
}

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

/* Steps 3+4 core loop, fully deterministic (no model): the file input is invisible
to the agent's a11y tree (drop-zone exposes role=button), so upload via Playwright.
Single generation per run: back-to-back Gemini calls 429. */
test('generates quiz, answers and sees result', {
  session: 'testUser',
  timeout: 180_000,
}, async ({ app, screen, browser }) => {
  await app.open('/dashboard/start');
  await browser
    .locator('input[type="file"]')
    .setInputFiles('tests/fixtures/sample.pdf');
  await expect(screen.getByText(/PDF uploaded successfully/)).toBeVisible();
  await screen.getByRole('button', 'Generate Quiz').tap();
  await screen.getByRole('button', 'Medium').tap();
  await expect(browser).toHaveURL(/\/dashboard\/quiz\//, { timeout: 120_000 });
  await expect(screen.getByText('Question 1 of 5')).toBeVisible();

  await answerAllAndSubmit(screen, browser);

  await expect(browser).toHaveURL(/\/dashboard\/result\//, { timeout: 60_000 });
  await expect(browser.locator('.stat-title')).toHaveText('Correct');
  await expect(screen.getByText('of 5')).toBeVisible();
});

/* History reuses the attempt created above — no new PDF generation.
ponytail: relies on file order, the generate test runs first. */
test('history lists past attempts', { session: 'testUser' }, async ({
  app,
  screen,
}) => {
  await app.open('/dashboard/history');
  await expect(screen.getByText('Quiz History')).toBeVisible();
  await expect(screen.getByRole('button', 'Retake').first()).toBeVisible();
});

test('retakes quiz from history and sees new result', {
  session: 'testUser',
  timeout: 120_000,
}, async ({ app, screen, browser }) => {
  await app.open('/dashboard/history');
  await screen.getByRole('button', 'Retake').first().tap();
  await expect(browser).toHaveURL(/\/dashboard\/quiz\//, { timeout: 60_000 });

  await answerAllAndSubmit(screen, browser);

  await expect(browser).toHaveURL(/\/dashboard\/result\//, { timeout: 60_000 });
  await expect(browser.locator('.stat-title')).toHaveText('Correct');
  await expect(screen.getByText('of 5')).toBeVisible();
});
