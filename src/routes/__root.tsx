import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import ErrorFallback from '@/components/ui/error-fallback';
import { ToastContainer } from '@/components/ui/toast-container';
import '@/globals.css';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Quiz My PDF',
      },
      {
        name: 'description',
        content: 'Generate Quiz from your PDF documents using AI',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen bg-base-200 px-4 py-10">
      <ErrorFallback
        title="Page Not Found"
        description="The page you're looking for doesn't exist."
      />
    </div>
  ),
});

function RootComponent() {
  return (
    <RootDocument>
      <Providers>
        <Outlet />
      </Providers>
      <ToastContainer />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
