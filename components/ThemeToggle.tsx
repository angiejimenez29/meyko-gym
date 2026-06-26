"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-colors border border-transparent hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
      aria-label="Toggle theme"
    >
      <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-300" />
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}
