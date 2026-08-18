"use client";

import { useState, useMemo, useCallback } from "react";
import { SlidersHorizontal, X, ChevronRight, ChevronLeft, Package } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/lib/categories";
import type { MockProduct, SortOption } from "@/components/product-types";
import { ProductGrid } from "@/components/product-grid";
import { Sidebar } from "@/components/category/sidebar";
import { SortDropdown } from "@/components/category/sort-dropdown";
import { useTranslation } from "@/hooks/use-translation";

const PAGE_SIZE = 12;

function getBrandFor(product: MockProduct): string {
  return product.brand ?? product.name.split(" ")[0];
}

export function CategoryPageClient({
  category,
  parentChain,
  allProducts,
}: {
  category: Category;
  parentChain: Category[];
  allProducts: MockProduct[];
}) {
  const { t } = useTranslation();
  const prices = allProducts.map((p) => p.price);
  const dataMin = prices.length ? Math.min(...prices) : 0;
  const dataMax = prices.length ? Math.max(...prices) : 100000;
  const minPrice = Math.floor(dataMin / 100) * 100;
  const maxPrice = Math.ceil(dataMax / 100) * 100;

  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [lowPrice, setLowPrice] = useState(minPrice);
  const [highPrice, setHighPrice] = useState(maxPrice);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);

  const brands = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => {
      const b = getBrandFor(p);
      if (b) set.add(b);
    });
    return Array.from(set).sort();
  }, [allProducts]);

  const toggleBrand = useCallback((b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setLowPrice(minPrice);
    setHighPrice(maxPrice);
    setSelectedBrands([]);
    setBrandSearch("");
    setSortBy("default");
    setPage(1);
  }, [minPrice, maxPrice]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(
      (p) => p.price >= lowPrice && p.price <= highPrice
    );

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(getBrandFor(p)));
    }

    switch (sortBy) {
      case "price-asc":  result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "name-asc":   result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "rating":     result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    }

    return result;
  }, [allProducts, lowPrice, highPrice, selectedBrands, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const pageNumbers = useMemo(() => {
    const numbers: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) numbers.push(i);
      return numbers;
    }
    numbers.push(1);
    if (currentPage > 3) numbers.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      numbers.push(i);
    }
    if (currentPage < totalPages - 2) numbers.push("...");
    numbers.push(totalPages);
    return numbers;
  }, [totalPages, currentPage]);

  const hasFilters =
    lowPrice > minPrice ||
    highPrice < maxPrice ||
    selectedBrands.length > 0;

  const filterCount =
    selectedBrands.length + (lowPrice > minPrice || highPrice < maxPrice ? 1 : 0);

  const sidebarProps = {
    minPrice,
    maxPrice,
    lowPrice,
    highPrice,
    setLowPrice,
    setHighPrice,
    brands,
    selectedBrands,
    toggleBrand,
    brandSearch,
    setBrandSearch,
    clearFilters,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Breadcrumb bar ─────────────────────────────────── */}
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex flex-wrap items-center gap-1.5 py-3 text-[12px] text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            {parentChain.map((item, i) => (
              <span key={item.id} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 opacity-50" />
                {i === parentChain.length - 1 ? (
                  <span className="font-medium capitalize text-foreground">{item.name}</span>
                ) : (
                  <Link href={item.href} className="capitalize transition-colors hover:text-primary">{item.name}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-gadget py-5">
        {/* Mobile filter trigger */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h1 className="text-[18px] font-bold capitalize text-foreground">{category.name}</h1>
          <button
            onClick={() => setMobileOpen(true)}
            className="btn-outline !h-9 !gap-2 !px-3 !text-[13px]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("common.filters")}
            {hasFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {filterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-card shadow-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <span className="text-[16px] font-semibold text-foreground">{t("common.filters")}</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 transition-colors hover:bg-accent">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <Sidebar {...sidebarProps} onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[104px] overflow-hidden rounded-lg border border-border shadow-sm">
              <Sidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
              <SortDropdown value={sortBy} onChange={setSortBy} />
              <span className="hidden text-[13px] text-muted-foreground sm:block">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? t("common.productFound") : t("common.productsFound")}
              </span>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={visibleProducts} desktopCols={4} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Package className="h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
                </span>
                <p className="mt-4 text-[16px] font-medium text-foreground">{t("shop.noProducts")}</p>
                <p className="mt-2 text-[14px] text-muted-foreground">{t("shop.noProductsHint")}</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary mt-6"
                >
                  {t("shop.clearFilters")}
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > PAGE_SIZE && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded border border-border bg-card text-[13px] text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  aria-label={t("shop.prevPage")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-1 text-muted-foreground">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded border text-[13px] transition-colors ${
                        currentPage === p
                          ? "border-primary bg-primary font-bold text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded border border-border bg-card text-[13px] text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                  aria-label={t("shop.nextPage")}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
