'use client';

import { useState } from 'react';

interface BackupCodesProps {
  codes: string[];
  onConfirmed: () => void;
}

export const BackupCodes = ({ codes, onConfirmed }: BackupCodesProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = codes.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = codes.join('\n');
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`,
    );
    element.setAttribute('download', 'backup-codes.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto p-6 border rounded-lg">
      <div>
        <h2 className="text-xl font-bold mb-2">Save Backup Codes</h2>
        <p className="text-sm text-gray-600 mb-4">
          Save these codes in a secure location. Each code can be used once to
          recover your account if you lose access to your authenticator.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded border font-mono text-sm space-y-2">
        {codes.map((code) => (
          <div key={code} className="text-gray-800">
            {code}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          {copied ? '✓ Copied' : 'Copy Codes'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Download Codes
        </button>
      </div>

      <button
        type="button"
        onClick={onConfirmed}
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
      >
        I've Saved the Codes
      </button>
    </div>
  );
};
