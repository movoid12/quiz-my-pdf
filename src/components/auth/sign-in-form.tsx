'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SyntheticEvent, useState } from 'react';
import { GoogleIcon } from '@/components/ui/icons/google-icon';
import { authClient } from '@/lib/auth-client';

export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authClient.signIn.email(
        { email, password },
        {
          onSuccess: (context) => {
            if (context.data?.twoFactorRedirect) {
              router.push('/auth/2fa');
            } else {
              router.push('/dashboard/start');
            }
          },
          onError: (context) => {
            setError(context.error?.message || 'Sign-in failed');
          },
        },
      );
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
        callbackURL: '/dashboard/start',
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
    <div className="card w-full max-w-sm mx-auto bg-base-100 shadow-xl">
      <form onSubmit={handleSignIn} className="card-body">
        <h2 className="card-title text-2xl justify-center mb-2">Sign In</h2>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <label className="form-control w-full">
          <span className="label-text mb-1">Email</span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-1">Password</span>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className="input input-bordered w-full"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full mt-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            'Sign In'
          )}
        </button>

        <div className="divider my-2">OR</div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-outline w-full gap-2"
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-base-content/70 mt-2">
          Don't have an account?{' '}
          <Link href="/auth/sign-up" className="link link-primary">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};
