'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface TotpSetupProps {
  totpURI: string;
  onVerified: () => void;
}

export const TotpSetup = ({ totpURI, onVerified }: TotpSetupProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: err } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice: false,
      });

      if (err) {
        setError(err.message || 'Invalid code');
      } else {
        onVerified();
      }
    } catch (_e) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto p-6 border rounded-lg">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Scan QR Code</h2>
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
        </p>
        <div className="flex justify-center p-4 bg-white rounded border">
          <QRCodeSVG value={totpURI} size={200} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Enter 6-digit code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className="w-full px-3 py-2 border rounded text-center tracking-widest text-lg text-black"
          disabled={loading}
        />
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        onClick={handleVerify}
        disabled={loading || code.length !== 6}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
      </button>
    </div>
  );
};
