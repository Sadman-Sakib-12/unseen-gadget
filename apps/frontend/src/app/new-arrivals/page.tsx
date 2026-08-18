"use client";

import products from "@/data/products.json";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { MockProduct } from "@/components/product-types";
import { ProductGrid } from "@/components/product-grid";
import { useTranslation } from "@/hooks/use-translation";

const newArrivals = (products as MockProduct[]).filter(
  (p) => p.badge === "New" || p.badge === "New Arrival"
);

export default function NewArrivalsPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("listings.newArrivals.title")}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary-800 py-10">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" />
            {t("listings.newArrivals.kicker")}
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white">{t("listings.newArrivals.title")}</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            {t("listings.newArrivals.hint", { count: newArrivals.length })}
          </p>
        </div>
      </div>

      <div className="container-gadget py-8">
        {newArrivals.length > 0 ? (
          <ProductGrid products={newArrivals} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
            <p className="mt-3 text-sm font-medium text-foreground">{t("listings.newArrivals.empty")}</p>
            <Link
              href="/"
              className="btn-primary mt-4 rounded-xl"
            >
              {t("listings.browseHome")} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
