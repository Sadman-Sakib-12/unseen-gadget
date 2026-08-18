"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme(): ThemeState {
  const storedTheme =
    typeof window !== "undefined" ? localStorage.getItem("unseen-theme") : null;

  const initialTheme: Theme = storedTheme ? (storedTheme as Theme) : "system";

  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [system, setSystem] = useState<"light" | "dark">(() => getSystemTheme());

  const resolved: "light" | "dark" = theme === "system" ? system : theme;

  const applyTheme = useCallback((t: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t === "system" ? getSystemTheme() : t);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("unseen-theme", theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setSystem(getSystemTheme());
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return { theme, resolved, setTheme };
}
