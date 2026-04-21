'use client';

import { useRouter } from 'next/navigation';
import { TwoFactorVerify } from '@/components/auth/two-factor-verify';

export default function TwoFactorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Two-Factor Authentication</h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your authenticator code or backup code to continue
        </p>
        <TwoFactorVerify onSuccess={() => router.push('/dashboard/start')} />
      </div>
    </div>
  );
}
