'use client';

import { useCallback, useState } from 'react';

export function useToggle(
  defaultValue = false,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, () => void] {
  const [value, setValue] = useState(!!defaultValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, setValue, toggle];
}
