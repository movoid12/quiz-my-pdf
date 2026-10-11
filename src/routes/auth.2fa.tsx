import { createFileRoute, useRouter } from '@tanstack/react-router';
import { TwoFactorVerify } from '@/components/auth/two-factor-verify';
import { routes } from '@/lib/routes';

export const Route = createFileRoute('/auth/2fa')({
  component: TwoFactorPage,
});

function TwoFactorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Two-Factor Authentication
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your authenticator code or backup code to continue
        </p>
        <TwoFactorVerify
          onSuccess={() => router.history.push(routes.dashboard.start)}
        />
      </div>
    </div>
  );
}
