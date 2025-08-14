'use client';

import confetti from 'canvas-confetti';
import { useCallback, useRef } from 'react';

export default function useConfetti() {
  const firedRef = useRef(false);

  const fire = useCallback(() => {
    if (firedRef.current) {
      return;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.4 },
    });

    firedRef.current = true;
  }, []);

  const reset = useCallback(() => {
    firedRef.current = false;
  }, []);

  return { fire, reset } as const;
}
