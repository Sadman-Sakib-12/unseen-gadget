"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const BRANDS = [
  "Apple",
  "Sony",
  "JBL",
  "Anker",
  "Bose",
  "Logitech",
  "Sennheiser",
  "Xiaomi",
];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function ShopByBrand() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border py-5">
      <div className="mx-auto w-full max-w-[1440px] px-4">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h2 className="text-[18px] font-bold text-foreground">
                {t("home.section.shopByBrand")}
              </h2>
              <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                {t("home.section.shopByBrandSubtitle")}
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t("home.section.shopByBrandCta")}
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-8">
          {BRANDS.map((name) => (
            <Link
              key={name}
              href={`/search?q=${encodeURIComponent(name)}`}
              className="group flex h-24 w-[150px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-primary/5 px-3 transition-colors hover:border-primary hover:bg-primary/10 md:w-auto"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {initialsOf(name)}
              </span>
              <span className="text-[11.5px] font-semibold text-foreground">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}