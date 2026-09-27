// ponytail: single source of truth for app navigation + API endpoints.
// Add query helpers when needed.

type QuizHref = `/dashboard/quiz/${string}`;
type ResultHref = `/dashboard/result/${string}`;

export const routes = {
  home: '/',
  dashboard: {
    start: '/dashboard/start',
    history: '/dashboard/history',
    profile: '/dashboard/profile',
    quiz: (quizId: string): QuizHref =>
      `/dashboard/quiz/${encodeURIComponent(quizId)}`,
    result: (attemptId: string): ResultHref =>
      `/dashboard/result/${encodeURIComponent(attemptId)}`,
  },
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    twoFactor: '/auth/2fa',
  },
  api: {
    processPdf: '/api/process-pdf',
    trpc: '/api/trpc',
  },
  external: {
    github: 'https://github.com/movoid12',
  },
} as const;
