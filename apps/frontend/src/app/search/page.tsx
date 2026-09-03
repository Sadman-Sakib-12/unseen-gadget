"use client";

import { Suspense, useState, useEffect } from "react";
import { Search, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { productApi } from "@/lib/api";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";

function SearchResults() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const brand = (searchParams.get("brand") ?? "").trim();
  const displayTerm = q || brand;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (displayTerm) {
      setIsLoading(true);
      productApi.list({ q: q || undefined, brand: brand || undefined })
        .then((res: any) => {
          const raw = res.data;
          const items = Array.isArray(raw) ? raw : (raw?.items || []);
          setProducts(items);
        })
        .catch(() => {
          setProducts([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setProducts([]);
    }
  }, [q, brand, displayTerm]);

  return (
    <> 
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[12px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{displayTerm || t("search.title")}</span>
          </nav>
        </div>
      </div>

      <div className="container-gadget py-5">
        <h1 className="mb-4 text-[18px] font-bold capitalize text-foreground">
          {displayTerm ? `${t("search.resultsFor")} "${displayTerm}"` : t("search.hint")}
        </h1>

        {!displayTerm ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-24 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
            </span>
            <p className="mt-4 text-[16px] font-medium text-foreground">{t("search.hint")}</p>
          </div>
        ) : isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
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
            <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
              <span className="text-[13px] text-muted-foreground">
                {products.length}{" "}{products.length === 1 ? t("common.productFound") : t("common.productsFound")}
              </span>
            </div>

            <ProductGrid products={products} />
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
