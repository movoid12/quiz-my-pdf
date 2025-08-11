'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { themeChange } from 'theme-change';
import useTheme from '@/hooks/use-theme';

export default function ThemeChanger() {
  const { toggleTheme, theme } = useTheme();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div>
      <button type='button' className="btn" onClick={toggleTheme}>
        <span className="flex items-center">
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </span>
      </button>
    </div>
  );
}
