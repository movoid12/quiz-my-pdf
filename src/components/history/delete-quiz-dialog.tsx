'use client';

import { Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { DeleteTarget } from '@/lib/stores/history-store';

export default function DeleteQuizDialog({
  target,
  isDeleting,
  onConfirm,
  onClose,
}: {
  target: DeleteTarget | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (target && !dialog.open) {
      dialog.showModal();
    } else if (!target && dialog.open) {
      dialog.close();
    }
  }, [target]);

  return (
    <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete quiz?</h3>
        <p className="py-4 text-base-content/70">
          <span className="font-medium text-base-content">
            &ldquo;{target?.title}&rdquo;
          </span>{' '}
          and all its attempts will be permanently deleted. This cannot be
          undone.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button type="submit" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </form>
          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
}
