'use client';

import { LogOut, User } from 'lucide-react';
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

  const initials = user?.name?.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-12 md:h-14 rounded-full bg-base-100 shadow-[0_4px_16px_rgba(0,0,0,0.12)] px-4 pointer-events-auto hover:brightness-95 transition-all will-change-transform"
      >
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            <span>{initials}</span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-base-100 shadow-lg border border-base-300 py-1 z-50 pointer-events-auto">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-base-content hover:bg-base-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
