"use client";

import { Package } from "lucide-react";
import { useState } from "react";
import { cn } from "@unseen-gadget/ui";

/**
 * Image with graceful, premium fallback.
 * Renders the real image when available; otherwise an intentional
 * gradient placeholder with the product's initial — so the storefront
 * stays clean even before assets are added.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  iconSize = "h-12 w-12",
  label,
}: {
  src?: string;
  alt: string;
  className?: string;
  iconSize?: string;
  label?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const initial = label?.trim().charAt(0)?.toUpperCase();
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 ring-1 ring-inset ring-slate-200/60 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 dark:ring-slate-700/40">
        <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]" aria-hidden="true">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-slate-400/10 blur-2xl" />
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 p-4">
          {initial ? (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-bold text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
              {initial}
            </span>
          ) : (
            <span className={cn("flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-300 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600")}>
              <Package className={iconSize} strokeWidth={1.5} />
            </span>
          )}
          <span className="max-w-full truncate text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {alt || "Unseen Gadget"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
