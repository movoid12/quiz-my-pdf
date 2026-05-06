/** biome-ignore-all lint/style/useNamingConvention: better-auth config file */
/** biome-ignore-all lint/suspicious/noExplicitAny: better-auth setup */
/** biome-ignore-all lint/suspicious/useAwait: better-auth setup */
// biome-ignore assist/source/organizeImports: better-auth config file
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { nextCookies } from 'better-auth/next-js';

import { db } from '@/server/db';
import * as schema from '@/db/schema';

const isProduction = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  appName: 'Quiz My PDF',
  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, { schema, provider: 'pg' }),
  emailAndPassword: { enabled: true },

  plugins: [
    twoFactor({
      issuer: 'Quiz My PDF',
      totpOptions: {
        digits: 6,
        period: 30,
      },
      otpOptions: {
        sendOTP: async ({ user, otp }, _ctx) => {
          console.log(`[2FA] OTP for ${user.email}: ${otp}`);
        },
        period: 5,
        digits: 6,
        allowedAttempts: 5,
        storeOTP: 'encrypted',
      },
      backupCodeOptions: {
        amount: 10,
        length: 10,
        storeBackupCodes: 'encrypted',
      },
      twoFactorCookieMaxAge: 600,
      trustDeviceMaxAge: 30 * 24 * 60 * 60,
    }),
    nextCookies(),
  ],

  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    freshAge: 60 * 60,
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: 'jwe',
    },
  },

  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 10,
    max: 100,
    customRules: {
      '/api/auth/sign-in/email': { window: 60, max: 5 },
      '/api/auth/sign-up/email': { window: 60, max: 3 },
      '/api/auth/change-password': { window: 60, max: 3 },
      '/api/auth/two-factor/enable': { window: 60, max: 5 },
      '/api/auth/two-factor/verify': { window: 60, max: 10 },
    },
  },

  trustedOrigins: isProduction
    ? [process.env.BETTER_AUTH_URL || 'http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:3001'],

  account: {
    encryptOAuthTokens: true,
    storeStateStrategy: 'cookie',
  },

  advanced: {
    useSecureCookies: isProduction,
    disableCSRFCheck: false,
    defaultCookieAttributes: {
      sameSite: 'lax',
      path: '/',
    },
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
      disableIpTracking: false,
    },
  },

  databaseHooks: {
    session: {
      create: {

        after: async ({ data, ctx }: any) => {
          const ip =
            (ctx?.request?.headers?.get?.('x-forwarded-for') as string) ||
            (ctx?.request?.headers?.get?.('x-real-ip') as string) ||
            'unknown';
          console.log(
            `[AUTH] Session created for user ${(data as any)?.userId} from IP: ${ip}`,
          );
        },
      },
      delete: {
        before: async ({ data }) => {
          console.log(`[AUTH] Session revoked: ${(data as any)?.id}`);
        },
      },
    },
    user: {
      create: {
        after: async ({ data }: any) => {
          console.log(`[AUTH] New user registered: ${(data as any)?.email}`);
        },
      },
      update: {
        after: async ({ data, oldData }: any) => {
          if ((oldData as any)?.email !== (data as any)?.email) {
            console.log(
              `[AUTH] Email changed for user ${(data as any)?.id}: ${(oldData as any)?.email} → ${(data as any)?.email}`,
            );
          }
        },
      },
    },
  },
});
