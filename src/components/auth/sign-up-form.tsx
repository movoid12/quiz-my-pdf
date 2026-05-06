'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { TotpSetup } from './totp-setup';
import { BackupCodes } from './backup-codes';

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error: err } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (err) {
        setError(err.message || 'Sign-up failed');
      } else {
        // After successful sign-up, enable 2FA
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

  if (step === 'totp') {
    return (
      <div>
        <TotpSetup
          totpURI={totpUri}
          onVerified={() => setStep('backupCodes')}
        />
      </div>
    );
  }

  if (step === 'backupCodes') {
    return (
      <div>
        <BackupCodes
          codes={backupCodes}
          onConfirmed={() => setStep('success')}
        />
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="space-y-4 max-w-sm mx-auto p-6 border rounded-lg text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✓ Account Created
          </h2>
          <p className="text-gray-600 mb-6">
            Your account is ready! 2FA is now enabled for your security.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/start')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSignUp}
      className="space-y-4 max-w-sm mx-auto p-6 border rounded-lg"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create Account
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          2FA will be required during setup
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full px-3 py-2 border rounded text-black"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Email
        </label>
        <input
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
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-3 py-2 border rounded text-black"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/sign-in" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
};
