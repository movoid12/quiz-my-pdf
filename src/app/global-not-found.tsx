import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

//TODO: fix the corrupted routing behavior

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          {/* Soft ambient glow */}
          <div className="-z-10 pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-56 w-56 animate-pulse rounded-full bg-linear-to-tr from-primary/30 via-secondary/30 to-accent/30 opacity-40 blur-3xl md:h-80 md:w-80" />
          </div>

          {/* 404 animated */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <span className="font-black text-6xl text-base-content/80 tracking-tight md:text-8xl">
              4
            </span>

            <span className="relative inline-flex items-center justify-center">
              {/* Center label */}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text font-black text-6xl text-transparent tracking-tight md:text-8xl">
                0
              </span>
              {/* Spinning ring */}
              <span
                className="absolute inset-0 m-auto h-14 w-14 animate-spin rounded-full border-4 border-primary/40 border-dashed md:h-20 md:w-20"
                style={{ animationDuration: '5s' }}
                aria-hidden="true"
              />
            </span>

            <span className="font-black text-6xl text-base-content/80 tracking-tight md:text-8xl">
              4
            </span>
          </div>

          <p className="mt-4 text-base text-base-content/70 md:text-lg">
            The page you’re looking for doesn’t exist or was moved.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard/start" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/dashboard/start" className="btn btn-outline">
              Go to Quiz
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
