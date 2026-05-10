import 'server-only';
import { router } from '../trpc';
import { quizRouter } from './quiz';

export const appRouter = router({
  quiz: quizRouter,
});

export type AppRouter = typeof appRouter;
