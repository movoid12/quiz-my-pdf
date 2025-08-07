"use client";

import { useState } from "react";


export default function useTheme() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return {
    theme,
    toggleTheme,
  };
}
