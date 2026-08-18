"use client";

import { useLanguage } from "@/hooks/use-language";
import { cn } from "@unseen-gadget/ui";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center rounded-full bg-card p-0.5", className)}>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        title="English"
        className={cn(
          "flex h-7 items-center rounded-full px-2.5 text-[11px] font-medium transition-all duration-200",
          language === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
        title="বাংলা"
        className={cn(
          "flex h-7 items-center rounded-full px-2.5 text-[11px] font-medium transition-all duration-200",
          language === "bn"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        BN
      </button>
    </div>
  );
}
