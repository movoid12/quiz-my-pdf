// ponytail: creates the e2e user via Better Auth API (skips the sign-up form's forced 2FA).
// Run with the dev server up: pnpm dev & pnpm e2e:seed
const base = process.env.APP_URL ?? 'http://127.0.0.1:3000';
const email = process.env.E2E_USER_TESTUSER_USERNAME ?? 'e2e@example.test';
const password =
  process.env.E2E_USER_TESTUSER_PASSWORD ?? 'e2e-test-password-123';

const res = await fetch(`${base}/api/auth/sign-up/email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // biome-ignore lint/style/useNamingConvention: HTTP header name
    Origin: base,
    // biome-ignore lint/style/useNamingConvention: HTTP header name
    Referer: `${base}/auth/sign-up`,
  },
  body: JSON.stringify({ name: 'e2e Test', email, password }),
});
const data = await res.json().catch(() => ({}));
if (res.ok) {
  console.log(`seeded ${email}`);
} else if (JSON.stringify(data).match(/exist|taken|duplicate/i)) {
  console.log(`exists ${email}, skipping`);
} else {
  console.error('seed failed', res.status, data);
  process.exit(1);
}
