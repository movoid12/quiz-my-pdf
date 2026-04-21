'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
}

export const TwoFactorVerify = ({ onSuccess }: TwoFactorVerifyProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyMethod, setVerifyMethod] = useState<'totp' | 'backup'>('totp');

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      if (verifyMethod === 'totp') {
        if (!code || code.length !== 6) {
          setError('Code must be 6 digits');
          setLoading(false);
          return;
        }

        const { error: err } = await authClient.twoFactor.verifyTotp({
          code,
          trustDevice: false,
        });

        if (err) { setError(err.message || 'Invalid code'); }
        else { onSuccess(); }
      } else {
        if (!code) {
          setError('Backup code is required');
          setLoading(false);
          return;
        }

        const { error: err } = await authClient.twoFactor.verifyBackupCode({
          code,
          trustDevice: false,
        });

        if (err) { setError(err.message || 'Invalid backup code'); }
        else { onSuccess(); }
      }
    } catch (_e) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto p-6 border rounded-lg">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Two-Factor Authentication</h2>
        <p className="text-sm text-gray-600">Enter your authentication code to continue</p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="radio"
            checked={verifyMethod === 'totp'}
            onChange={() => setVerifyMethod('totp')}
            disabled={loading}
            className="mr-2"
          />
          <span className="text-sm text-gray-900">Authenticator App</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            checked={verifyMethod === 'backup'}
            onChange={() => setVerifyMethod('backup')}
            disabled={loading}
            className="mr-2"
          />
          <span className="text-sm text-gray-900">Backup Code</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {verifyMethod === 'totp' ? 'Enter 6-digit code' : 'Enter backup code'}
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            if (verifyMethod === 'totp') {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
            } else {
              setCode(e.target.value);
            }
          }}
          placeholder={verifyMethod === 'totp' ? '000000' : 'XXXX-XXXX-XXXX'}
          maxLength={verifyMethod === 'totp' ? 6 : 20}
          className="w-full px-3 py-2 border rounded text-center text-black"
          disabled={loading}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        onClick={handleVerify}
        disabled={loading || !code}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  );
};
