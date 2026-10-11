import { createFileRoute } from '@tanstack/react-router';
import { SignInForm } from '@/components/auth/sign-in-form';
import { routes } from '@/lib/routes';

export const Route = createFileRoute('/auth/sign-in')({
  validateSearch: (search: Record<string, unknown>) => ({
    ...(typeof search.callbackUrl === 'string'
      ? { callbackUrl: search.callbackUrl }
      : {}),
  }),
  component: SignInPage,
});

function SignInPage() {
  const { callbackUrl } = Route.useSearch();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignInForm callbackUrl={callbackUrl ?? routes.dashboard.start} />
    </div>
  );
}
