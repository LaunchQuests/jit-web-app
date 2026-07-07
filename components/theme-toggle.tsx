"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const THEME_COOKIE_NAME = "jit_theme";

function getInitialTheme() {
  if (typeof document === "undefined") return false;

  const stored = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${THEME_COOKIE_NAME}=`));

  if (stored) {
    return stored.split("=")[1] === "dark";
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = getInitialTheme();
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");
    root.classList.toggle("dark", nextDark);
    document.cookie = `${THEME_COOKIE_NAME}=${nextDark ? "dark" : "light"}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setDark(nextDark);
  };

  return (
    <Button
      type="button"
      aria-label="Toggle theme"
      className="w-12 rounded-full border border-line bg-card px-0"
      onClick={toggleTheme}
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}