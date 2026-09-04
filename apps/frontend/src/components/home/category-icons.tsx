"use client";

import React from "react";
import Link from "next/link";

export interface HomeCategory {
  id: string;
  name: string;
  href: string;
  image?: string;
  iconType?: string;
}

export const CI: Record<string, React.ReactNode> = {
  iphones: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="18" y="4" width="28" height="56" rx="5"/><line x1="28" y1="10" x2="36" y2="10"/><circle cx="32" cy="52" r="2"/><rect x="22" y="16" width="20" height="28" rx="1"/></svg>),
  smartphones: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="18" y="4" width="28" height="56" rx="5"/><line x1="28" y1="10" x2="36" y2="10"/><circle cx="32" cy="52" r="2"/><rect x="22" y="16" width="20" height="28" rx="1"/></svg>),
  ipads: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="10" y="6" width="44" height="52" rx="4"/><circle cx="32" cy="52" r="2"/><rect x="15" y="12" width="34" height="32" rx="1"/></svg>),
  "ipads-tablets": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="10" y="6" width="44" height="52" rx="4"/><circle cx="32" cy="52" r="2"/><rect x="15" y="12" width="34" height="32" rx="1"/></svg>),
  macbook: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="10" width="48" height="32" rx="3"/><rect x="16" y="16" width="32" height="20" rx="1"/><path d="M4 42h56l-4 8H8l-4-8z"/><line x1="24" y1="46" x2="40" y2="46"/></svg>),
  computers: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="10" width="48" height="32" rx="3"/><rect x="16" y="16" width="32" height="20" rx="1"/><path d="M4 42h56l-4 8H8l-4-8z"/><line x1="24" y1="46" x2="40" y2="46"/></svg>),
  "apple-watch": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="20" y="16" width="24" height="32" rx="8"/><line x1="26" y1="8" x2="26" y2="16"/><line x1="38" y1="8" x2="38" y2="16"/><line x1="26" y1="48" x2="26" y2="56"/><line x1="38" y1="48" x2="38" y2="56"/><circle cx="32" cy="32" r="6"/><line x1="32" y1="26" x2="32" y2="32"/><line x1="32" y1="32" x2="36" y2="35"/></svg>),
  "smart-watches": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="18" y="14" width="28" height="36" rx="10"/><line x1="24" y1="6" x2="24" y2="14"/><line x1="40" y1="6" x2="40" y2="14"/><line x1="24" y1="50" x2="24" y2="58"/><line x1="40" y1="50" x2="40" y2="58"/><circle cx="32" cy="32" r="8"/><line x1="32" y1="26" x2="32" y2="32"/><line x1="32" y1="32" x2="37" y2="35"/></svg>),
  smartwatches: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="18" y="14" width="28" height="36" rx="10"/><line x1="24" y1="6" x2="24" y2="14"/><line x1="40" y1="6" x2="40" y2="14"/><line x1="24" y1="50" x2="24" y2="58"/><line x1="40" y1="50" x2="40" y2="58"/><circle cx="32" cy="32" r="8"/><line x1="32" y1="26" x2="32" y2="32"/><line x1="32" y1="32" x2="37" y2="35"/></svg>),
  airpods: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="12" y="8" width="40" height="48" rx="10"/><ellipse cx="26" cy="28" rx="4" ry="6"/><ellipse cx="38" cy="28" rx="4" ry="6"/><line x1="26" y1="34" x2="26" y2="44"/><line x1="38" y1="34" x2="38" y2="44"/></svg>),
  audio: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M12 32 A20 20 0 0 1 52 32" /><rect x="8" y="32" width="8" height="16" rx="4" /><rect x="48" y="32" width="8" height="16" rx="4" /></svg>),
  headphones: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M12 32 A20 20 0 0 1 52 32" /><rect x="8" y="32" width="8" height="16" rx="4" /><rect x="48" y="32" width="8" height="16" rx="4" /></svg>),
  accessories: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><circle cx="20" cy="44" r="8" /><path d="M26 38 L44 14" /><rect x="40" y="8" width="12" height="10" rx="2" /></svg>),
  "power-bank": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="14" y="14" width="36" height="36" rx="6" /><polyline points="28,22 24,32 30,32 26,42" /></svg>),
  "cases-protectors": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M32 4 L10 14 L10 32 C10 46 32 58 32 58 C32 58 54 46 54 32 L54 14 Z" /><path d="M24 30 L30 36 L42 24" /></svg>),
  "iphone-cases": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M32 4 L10 14 L10 32 C10 46 32 58 32 58 C32 58 54 46 54 32 L54 14 Z" /><path d="M24 30 L30 36 L42 24" /></svg>),
  "ipad-cases": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="6" width="48" height="52" rx="4"/><rect x="12" y="10" width="40" height="44" rx="3"/><line x1="8" y1="30" x2="12" y2="30"/><line x1="8" y1="36" x2="12" y2="36"/></svg>),
  cables: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><circle cx="16" cy="44" r="8"/><circle cx="16" cy="44" r="3"/><path d="M22 38 L40 14"/><rect x="36" y="8" width="12" height="10" rx="2"/><line x1="40" y1="18" x2="40" y2="28"/><line x1="44" y1="18" x2="44" y2="28"/></svg>),
  gaming: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="10" y="20" width="44" height="28" rx="8" /><line x1="20" y1="34" x2="28" y2="34" /><line x1="24" y1="30" x2="24" y2="38" /><circle cx="42" cy="34" r="2.5" /></svg>),
  tablets: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="10" y="6" width="44" height="52" rx="4"/><circle cx="32" cy="52" r="2"/><rect x="15" y="12" width="34" height="32" rx="1"/></svg>),
  cameras: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="8" y="16" width="48" height="36" rx="6" /><path d="M22 16 L26 10 L38 10 L42 16 Z" /><circle cx="32" cy="34" r="10" /></svg>),
  electronics: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M36 4 L16 34 L32 34 L28 60 L48 30 L32 30 Z" /></svg>),
  "home-appliances": (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><path d="M12 24 L32 8 L52 24 L52 54 L12 54 Z" /><rect x="24" y="32" width="16" height="22" rx="1" /></svg>),
  storage: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="12" y="10" width="40" height="44" rx="4" /><line x1="20" y1="18" x2="44" y2="18" /><line x1="20" y1="26" x2="44" y2="26" /><circle cx="32" cy="42" r="5" /></svg>),
  wearables: (<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full"><rect x="20" y="14" width="24" height="36" rx="8" /><line x1="26" y1="6" x2="26" y2="14" /><line x1="38" y1="6" x2="38" y2="14" /><line x1="26" y1="50" x2="26" y2="58"/><line x1="38" y1="50" x2="38" y2="58"/><circle cx="32" cy="32" r="6" /></svg>),
};

export function CatBtn({ c }: { c: HomeCategory }) {
  const icon =
    CI[c.id] ||
    CI[c.iconType || ""] || (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <circle cx="32" cy="32" r="20" />
        <circle cx="32" cy="32" r="8" />
      </svg>
    );

  return (
    <Link href={c.href} className="group flex flex-col items-center gap-1.5">
      <div className="flex h-14 w-14 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full border border-border bg-card p-2.5 sm:p-3.5 text-muted-foreground transition group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-sm">
        {c.image ? (
          <img
            src={c.image}
            alt={c.name}
            className="h-full w-full object-contain rounded-full"
          />
        ) : (
          icon
        )}
      </div>
      <span className="text-center text-[11px] leading-tight text-muted-foreground transition-colors group-hover:text-primary">
        {c.name}
      </span>
    </Link>
  );
}
