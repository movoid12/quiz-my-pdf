'use client';

import { useCallback, useState } from 'react';

export function useDialog<T>() {
  const [payload, setPayload] = useState<T | null>(null);

  const open = useCallback((target: T) => {
    setPayload(target);
  }, []);

  const close = useCallback(() => {
    setPayload(null);
  }, []);

  return { payload, isOpen: payload !== null, open, close };
}
