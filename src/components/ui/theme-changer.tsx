"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useThemeStore } from "@/lib/stores/theme-store";

export default function ThemeChanger() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="btn border-0 btn-ghost
         hover:bg-transparent hover:border-transparent hover:shadow-none"
      onClick={toggleTheme}
    >
      <span className="flex items-center">
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4 text-black" />
        )}
      </span>
    </button>
  );
}
