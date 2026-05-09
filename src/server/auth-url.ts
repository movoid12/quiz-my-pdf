import { env } from '@/env';

const withHttps = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`;

export const getBetterAuthUrl = () => {
  if (env.BETTER_AUTH_URL) {
    return env.BETTER_AUTH_URL;
  }

  if (
    process.env.VERCEL_ENV === 'production' &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }

  if (process.env.VERCEL_BRANCH_URL) {
    return withHttps(process.env.VERCEL_BRANCH_URL);
  }

  if (process.env.VERCEL_URL) {
    return withHttps(process.env.VERCEL_URL);
  }

  return 'http://localhost:3000';
};
