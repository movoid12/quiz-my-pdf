'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type SyntheticEvent, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { BackupCodes } from './backup-codes';
import { TotpSetup } from './totp-setup';
import { GoogleIcon } from '../ui/icons/google-icon';

type SignUpStep = 'form' | 'totp' | 'backupCodes' | 'success';

export const SignUpForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<SignUpStep>('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totpUri, setTotpUri] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignUp = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: err } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (err) {
        setError(err.message || 'Sign-up failed');
      } else {
        await enable2fa();
      }
    } catch (_e) {
      setError('An error occurred during sign-up');
    } finally {
      setLoading(false);
    }
  };

  const enable2fa = async () => {
    try {
      const { data, error: err } = await authClient.twoFactor.enable({
        password,
      });

      if (err) {
        setError(err.message || 'Failed to setup 2FA');
      } else if (data) {
        setTotpUri(data.totpURI || '');
        setBackupCodes(data.backupCodes || []);
        setStep('totp');
      }
    } catch (_e) {
      setError('Failed to setup 2FA');
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

  if (step === 'totp') {
    return (
      <TotpSetup
        totpUri={totpUri}
        onVerified={() => setStep('backupCodes')}
      />
    );
  }

  if (step === 'backupCodes') {
    return (
      <BackupCodes
        codes={backupCodes}
        onConfirmed={() => setStep('success')}
      />
    );
  }

  if (step === 'success') {
    return (
      <div className="card w-full max-w-sm mx-auto bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-success"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="card-title text-2xl">Account Created</h2>
          <p className="text-base-content/70 mb-2">
            Your account is ready! 2FA is now enabled for your security.
          </p>
          <button
            type="button"
            onClick={() => router.push('/dashboard/start')}
            className="btn btn-primary w-full"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-sm mx-auto bg-base-100 shadow-xl">
      <form onSubmit={handleSignUp} className="card-body">
        <h2 className="card-title text-2xl justify-center">Create Account</h2>
        <p className="text-center text-sm text-base-content/70 mb-2">
          2FA will be required during setup
        </p>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <label className="form-control w-full">
          <span className="label-text mb-1">Full Name</span>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={loading}
            className="input input-bordered w-full"
          />
        </label>

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

        <label className="form-control w-full">
          <span className="label-text mb-1">Confirm Password</span>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className={`input input-bordered w-full ${
              passwordsMismatch ? 'input-error' : ''
            }`}
          />
          {passwordsMismatch && (
            <span className="label-text-alt text-error mt-1">
              Passwords do not match
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={loading || passwordsMismatch}
          className="btn btn-primary w-full mt-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            'Create Account'
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
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="link link-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};