'use client';

import {
  ExternalLink,
  FilePlus2,
  GitBranch,
  History,
  House,
  LogOut,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useClickOutside } from 'react-haiku';
import { authClient } from '@/lib/auth-client';

export default function UserMenu() {
  const { data: session } = authClient.useSession();

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const user = session?.user;

  const initials = user?.name?.slice(0, 2).toUpperCase() || '??';

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  useClickOutside(ref, () => setIsOpen(false));

  // quiz-my-pdf.NAVIGATION.1 — primary and account actions share one menu
  return (
    <div
      ref={ref}
      className={`dropdown dropdown-end ${isOpen ? 'dropdown-open' : ''}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="btn btn-ghost h-12 min-h-12 gap-2 rounded-full border border-base-content/10 bg-base-100 px-2 shadow-sm hover:bg-base-200 md:h-14 md:min-h-14 md:px-3"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open navigation and account menu"
      >
        <div className="avatar avatar-placeholder">
          <div className="w-10 rounded-full bg-neutral text-neutral-content md:w-11">
            <span>{initials}</span>
          </div>
        </div>
        <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
          {user?.name || 'Account'}
        </span>
      </button>

      {isOpen && (
        // quiz-my-pdf.NAVIGATION.2 — DaisyUI menu semantics and keyboard-friendly links
        <ul
          tabIndex={-1}
          // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: DaisyUI menu semantics
          role="menu"
          aria-label="Navigation and account menu"
          className="menu dropdown-content z-[1002] mt-3 w-64 rounded-box border border-base-content/10 bg-base-100 p-2 shadow-xl"
        >
          <li className="menu-title px-3 py-2">Navigate</li>
          <li>
            <Link href="/" role="menuitem" onClick={() => setIsOpen(false)}>
              <House className="size-4" aria-hidden="true" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/start"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
              New Quiz
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/history"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <History className="size-4" aria-hidden="true" />
              History
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/movoid12"
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <GitBranch className="size-4" aria-hidden="true" />
              GitHub
              <ExternalLink
                className="ml-auto size-3.5 opacity-50"
                aria-hidden="true"
              />
            </a>
          </li>
          <li className="my-1 border-t border-base-content/10" />
          <li className="menu-title px-3 py-2">Account</li>
          <li>
            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <User className="size-4" aria-hidden="true" />
              Profile
            </Link>
          </li>
          <li>
            <button type="button" role="menuitem" onClick={handleSignOut}>
              <LogOut className="size-4" aria-hidden="true" />
              Sign Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
