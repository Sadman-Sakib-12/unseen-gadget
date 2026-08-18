"use client";

import { Suspense, useMemo } from "react";
import { Search, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import products from "@/data/products.json";
import type { MockProduct } from "@/components/product-types";
import { ProductGrid } from "@/components/product-grid";
import { useTranslation } from "@/hooks/use-translation";

function SearchResults() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    const all = products as MockProduct[];
    return all.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
    );
  }, [q]);

  return (
    <>
      {/* Breadcrumb bar */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[12px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("search.title")}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-5">
        <h1 className="mb-4 text-[18px] font-bold capitalize text-foreground">
          {q ? t("search.resultsFor") + ` "${q}"` : t("search.hint")}
        </h1>

        {q === "" ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-24 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
            </span>
            <p className="mt-4 text-[16px] font-medium text-foreground">{t("search.hint")}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-24 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
            </span>
            <p className="mt-4 text-[16px] font-medium text-foreground">{t("search.noResults")}</p>
            <p className="mt-2 text-[14px] text-muted-foreground">{t("search.noResultsHint")}</p>
            <Link href="/products" className="btn-primary mt-6">
              {t("wishlist.browse")}
            </Link>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
              <span className="text-[13px] text-muted-foreground">
                {results.length}{" "}
                {results.length === 1 ? t("common.productFound") : t("common.productsFound")}
              </span>
            </div>

            {/* Results */}
            <ProductGrid products={results} />
          </>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-gadget py-5"><div className="h-40 animate-pulse rounded-lg bg-muted" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
