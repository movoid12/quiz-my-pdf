import { createFileRoute } from '@tanstack/react-router';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { routes } from '@/lib/routes';
import { appRouter } from '@/server/routers';
import { createContext } from '@/server/trpc';

const handler = ({ request }: { request: Request }) =>
  fetchRequestHandler({
    endpoint: routes.api.trpc,
    req: request,
    router: appRouter,
    createContext: ({ req }) => createContext(req),
  });

export const Route = createFileRoute('/api/trpc/$')({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
