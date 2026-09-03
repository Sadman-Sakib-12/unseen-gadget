"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { SortOption } from "@/components/product-types";
import { useTranslation } from "@/hooks/use-translation";

const SORT_KEYS: Record<SortOption, "shop.sortDefault" | "shop.sortPriceAsc" | "shop.sortPriceDesc" | "shop.sortNameAsc" | "shop.sortRating"> = {
  default: "shop.sortDefault",
  "price-asc": "shop.sortPriceAsc",
  "price-desc": "shop.sortPriceDesc",
  "name-asc": "shop.sortNameAsc",
  rating: "shop.sortRating",
};

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const options = Object.keys(SORT_KEYS) as SortOption[];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:border-primary/50"
      >
        <span className="text-muted-foreground">{t("common.sort")}:</span>
        <span className="font-semibold">{t(SORT_KEYS[value])}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px] transition-colors hover:bg-accent ${
                  value === opt ? "font-semibold text-primary" : "text-foreground"
                }`}
              >
                {value === opt && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
                <span className={value === opt ? "" : "ml-4"}>{t(SORT_KEYS[opt])}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
