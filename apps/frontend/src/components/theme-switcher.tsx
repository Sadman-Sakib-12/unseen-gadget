"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@unseen-gadget/ui";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-border text-gray-700 dark:text-gray-300", className)}>
        <Moon className="h-4 w-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Light Mode" : "Dark Mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-border text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-accent hover:text-[#0D6EFD] shadow-2xs active:scale-95",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-500 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
