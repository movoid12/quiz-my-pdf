import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { routes } from '@/lib/routes';
import { appRouter } from '@/server/routers';
import { createContext } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: routes.api.trpc,
    req,
    router: appRouter,
    createContext: ({ req: request }) => createContext(request),
  });

export { handler as GET, handler as POST };
