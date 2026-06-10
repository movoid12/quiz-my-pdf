'use client';

import { useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
}

export const TwoFactorVerify = ({ onSuccess }: TwoFactorVerifyProps) => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [verifyMethod, setVerifyMethod] = useState<'totp' | 'backup'>('totp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digitCount = verifyMethod === 'totp' ? 6 : 4;

  useEffect(() => {
    setCode(new Array(digitCount).fill(''));
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  }, [digitCount]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (Number.isNaN(Number(element.value)) || element.value === ' ') {
      element.value = '';
      return;
    }

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value && index < digitCount - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, digitCount);
    if (!/^\d+$/.test(pasteData)) {
      return;
    }

    const newCode = new Array(digitCount).fill('');
    for (let i = 0; i < pasteData.length; i++) {
      newCode[i] = pasteData[i];
    }
    setCode(newCode);

    const lastFullInput = Math.min(pasteData.length - 1, digitCount - 1);
    if (lastFullInput >= 0) {
      const targetInput = inputRefs.current[lastFullInput];
      if (targetInput) {
        targetInput.focus();
      }
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      if (verifyMethod === 'totp') {
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
          setError('Code must be 6 digits');
          setLoading(false);
          return;
        }

        const { error: err } = await authClient.twoFactor.verifyTotp({
          code: fullCode,
          trustDevice: false,
        });

        if (err) {
          setError(err.message || 'Invalid code');
        } else {
          onSuccess();
        }
      } else {
        const fullCode = code.filter((d) => d).join('');
        if (!fullCode) {
          setError('Backup code is required');
          setLoading(false);
          return;
        }

        const { error: err } = await authClient.twoFactor.verifyBackupCode({
          code: fullCode,
          trustDevice: false,
        });

        if (err) {
          setError(err.message || 'Invalid backup code');
        } else {
          onSuccess();
        }
      }
    } catch {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center font-sans">
      <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-800 p-10 sm:p-10 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/20 max-w-sm w-full text-center text-gray-900 dark:text-white relative overflow-hidden">
        <div className="absolute top-4 left-4 flex space-x-2">
          <div className="w-3 h-3 bg-[#FF5F56] rounded-full" />
          <div className="w-3 h-3 bg-[#FFBD2E] rounded-full" />
          <div className="w-3 h-3 bg-[#27C93F] rounded-full" />
        </div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mt-8 sm:mt-4 mb-2 text-gray-900 dark:text-gray-200">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            {verifyMethod === 'totp'
              ? 'Enter the 6-digit code from your authenticator app'
              : 'Enter a backup code'}
          </p>

          <div className="flex justify-center gap-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={verifyMethod === 'totp'}
                onChange={() => setVerifyMethod('totp')}
                disabled={loading}
                className="radio radio-sm"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                App
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={verifyMethod === 'backup'}
                onChange={() => setVerifyMethod('backup')}
                disabled={loading}
                className="radio radio-sm"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Backup Code
              </span>
            </label>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm text-left font-medium">
            Enter the code
          </p>

          <div
            className="flex justify-center gap-2 sm:gap-3 mb-6"
            onPaste={handlePaste}
          >
            {code.map((data, index) => (
              <input
                // biome-ignore lint/suspicious/noArrayIndexKey: <2fa>
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="tel"
                maxLength={1}
                value={data}
                placeholder="•"
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => {
                  e.target.select();
                  setFocusedIndex(index);
                }}
                onBlur={() => setFocusedIndex(-1)}
                disabled={loading}
                className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white rounded-lg outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600
                  ${
                    focusedIndex === index
                      ? 'border-2 border-blue-500'
                      : 'border border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                  }
                  ${loading ? 'opacity-50' : ''}`}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 py-2 px-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading || code.every((d) => !d)}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  );
};
