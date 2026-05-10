import { createMiddleware } from '@nosecone/next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/server/auth';

const securityHeadersMiddleware = createMiddleware();

const applySecurityHeaders = (source: Response, target: Headers) => {
  for (const [key, value] of source.headers) {
    if (key === 'x-middleware-next') {
      continue;
    }

    target.set(key, value);
  }
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const securityResponse = await securityHeadersMiddleware();

  // Protect dashboard routes and quiz generation API
  if (pathname.startsWith('/dashboard') || pathname === '/api/process-pdf') {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      // For API routes, return 401 Unauthorized
      if (pathname.startsWith('/api/')) {
        const response = new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          },
        );

        applySecurityHeaders(securityResponse, response.headers);
        return response;
      }

      // Redirect to sign-in if not authenticated
      const url = new URL('/auth/sign-in', request.url);
      url.searchParams.set('callbackUrl', pathname);
      const response = NextResponse.redirect(url);

      applySecurityHeaders(securityResponse, response.headers);
      return response;
    }
  }

  return securityResponse;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

// Force middleware to run in Node.js runtime to avoid edge crypto issues
export const runtime = 'nodejs';
