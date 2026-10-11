import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { auth } from '@/server/auth';

// Only what the browser may see — never the full database record.
export const fetchSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const request = getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return null;
    }
    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };
  },
);
