"use client";

import { useEffect, useRef, useState } from "react";
import type { SortOption } from "@/components/product-types";

export const SORT_LABELS: Record<SortOption, string> = {
  default: "Price: Low → High",
  "price-asc": "Price: Low → High",
  "price-desc": "Price: High → Low",
  "name-asc": "Name: A → Z",
  rating: "Top Rated",
};

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[13px] font-medium text-gray-700 shadow-sm transition hover:border-gray-400"
      >
        <span className="text-gray-500">Sort:</span>
        <span className="font-semibold text-gray-800">{SORT_LABELS[value]}</span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-[13px] transition hover:bg-gray-50 ${
                value === opt ? "font-semibold text-blue-600 bg-blue-50" : "text-gray-700"
              }`}
            >
              {value === opt && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              )}
              <span className={value === opt ? "" : "ml-4"}>{SORT_LABELS[opt]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}