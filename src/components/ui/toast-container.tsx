'use client';

import { X } from 'lucide-react';
import { useToastStore } from '@/lib/stores/toast-store';

const alertMap: Record<string, string> = {
  info: 'alert-info',
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast toast-end">
      <div className="aura aura-glow">
        {toasts.map((toast) => (
          <div key={toast.id} className={`alert ${alertMap[toast.type]}`}>
            <span>{toast.message}</span>
            <button type="button" onClick={() => removeToast(toast.id)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
