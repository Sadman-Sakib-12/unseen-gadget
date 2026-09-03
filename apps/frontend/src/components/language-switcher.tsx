"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { triggerGoogleTranslate } from "@/components/google-translate";
import { cn } from "@unseen-gadget/ui";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLang = mounted ? language : "en";

  const handleSelect = (next: "en" | "bn") => {
    setLanguage(next);
    triggerGoogleTranslate(next);
  };

  return (
    <div className={cn("flex items-center rounded-full border border-gray-200 dark:border-border bg-gray-50 dark:bg-card p-0.5 shadow-2xs", className)}>
      <button
        type="button"
        onClick={() => handleSelect("en")}
        aria-pressed={currentLang === "en"}
        title="English"
        className={cn(
          "flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold transition-all duration-200 cursor-pointer",
          currentLang === "en"
            ? "bg-[#182C61] dark:bg-primary text-white shadow-xs"
            : "text-gray-600 dark:text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSelect("bn")}
        aria-pressed={currentLang === "bn"}
        title="বাংলা"
        className={cn(
          "flex h-7 items-center rounded-full px-2.5 text-[11px] font-bold transition-all duration-200 cursor-pointer",
          currentLang === "bn"
            ? "bg-[#182C61] dark:bg-primary text-white shadow-xs"
            : "text-gray-600 dark:text-muted-foreground hover:text-foreground"
        )}
      >
        বাং
      </button>
    </div>
  );
}
