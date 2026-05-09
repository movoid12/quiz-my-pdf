'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: err } = await authClient.signIn.email(
        { email, password },
        {
          onSuccess: (context) => {
            if (context.data?.twoFactorRedirect) {
              router.push('/auth/2fa');
            } else {
              router.push('/dashboard');
            }
          },
          onError: (context) => {
            setError(context.error?.message || 'Sign-in failed');
          },
        },
      );

      if (err) {
        setError(err.message || 'Sign-in failed');
      }
    } catch (_e) {
      setError('An error occurred during sign-in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error: err } = await authClient.signIn.social({
        provider: 'google',
        // biome-ignore lint/style/useNamingConvention: Better Auth uses callbackURL
        callbackURL: '/dashboard',
        // biome-ignore lint/style/useNamingConvention: Better Auth uses newUserCallbackURL
        newUserCallbackURL: '/dashboard/start',
      });

      if (err) {
        setError(err.message || 'Google sign-in failed');
        setLoading(false);
      }
    } catch (_e) {
      setError('An error occurred during Google sign-in');
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className="space-y-4 max-w-sm mx-auto p-6 border rounded-lg"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-3 py-2 border rounded text-black"
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-3 py-2 border rounded text-black"
          disabled={loading}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="h-px flex-1 bg-gray-200" />
        <span>or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 hover:bg-gray-50 disabled:opacity-50"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/auth/sign-up" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
};
