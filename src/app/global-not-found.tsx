import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
          {/* Soft ambient glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-56 w-56 md:h-80 md:w-80 bg-gradient-to-tr from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-3xl opacity-40 animate-pulse" />
          </div>

          {/* 404 animated */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <span className="text-6xl md:text-8xl font-black tracking-tight text-base-content/80">
              4
            </span>

            <span className="relative inline-flex items-center justify-center">
              {/* Center label */}
              <span className="text-6xl md:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                0
              </span>
              {/* Spinning ring */}
              <span
                className="absolute inset-0 m-auto h-[3.5rem] w-[3.5rem] md:h-[5rem] md:w-[5rem] rounded-full border-4 border-dashed border-primary/40 animate-spin"
                style={{ animationDuration: "5s" }}
                aria-hidden="true"
              />
            </span>

            <span className="text-6xl md:text-8xl font-black tracking-tight text-base-content/80">
              4
            </span>
          </div>

          <p className="mt-4 text-base md:text-lg text-base-content/70">
            The page you’re looking for doesn’t exist or was moved.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/quiz" className="btn btn-outline">
              Go to Quiz
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
