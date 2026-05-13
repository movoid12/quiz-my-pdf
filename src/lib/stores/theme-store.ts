import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

type ThemeStore = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'light',
        toggleTheme: () =>
          set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
      }),
      {
        name: 'pdf-quiz-theme',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'pdf-quiz-theme-store' },
  ),
);
