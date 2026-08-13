"use client";

import { useState, useMemo, useCallback } from "react";
import { SlidersHorizontal, X, ChevronRight, ChevronLeft, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/lib/categories";
import type { MockProduct, SortOption, ViewMode } from "@/components/product-types";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Sidebar } from "@/components/category/sidebar";
import { SortDropdown } from "@/components/category/sort-dropdown";

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
  /* reset price sliders / state when the category itself changes */
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [showSkeleton, setShowSkeleton] = useState(false);

  /* extract unique brands */
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

  /* pagination */
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const switchView = (mode: ViewMode) => {
    if (mode === viewMode) return;
    setShowSkeleton(true);
    setViewMode(mode);
    window.setTimeout(() => setShowSkeleton(false), 300);
  };

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
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* ── Breadcrumb bar ───────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-[1320px] px-4">
          <nav className="flex items-center gap-1.5 py-3 text-[12px] text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            {parentChain.map((item, i) => (
              <span key={item.id} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-gray-400" />
                {i === parentChain.length - 1 ? (
                  <span className="font-medium text-gray-800 capitalize">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-blue-600 capitalize">{item.name}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-5">
        {/* Mobile filter trigger */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h1 className="text-[18px] font-bold text-gray-900 capitalize">{category.name}</h1>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[13px] font-medium text-gray-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {selectedBrands.length + (lowPrice > minPrice || highPrice < maxPrice ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <span className="text-[16px] font-semibold text-gray-900">Filters</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <Sidebar {...sidebarProps} onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-[260px] shrink-0 lg:block">
            <div className="sticky top-[100px] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <Sidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <SortDropdown value={sortBy} onChange={setSortBy} />

              <div className="flex items-center gap-4">
                <span className="hidden text-[13px] text-gray-500 sm:block">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
                </span>

                <div className="flex items-center gap-1 rounded border border-gray-200 p-1">
                  <button
                    onClick={() => switchView("grid")}
                    aria-label="Grid view"
                    className={`flex h-7 w-7 items-center justify-center rounded transition ${
                      viewMode === "grid"
                        ? "bg-gray-800 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => switchView("list")}
                    aria-label="List view"
                    className={`flex h-7 w-7 items-center justify-center rounded transition ${
                      viewMode === "list"
                        ? "bg-gray-800 text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              showSkeleton ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {Array.from({ length: Math.min(PAGE_SIZE, filteredProducts.length) }).map((_, i) => (
                    <ProductCardSkeleton key={i} viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-20 text-center">
                <svg className="h-16 w-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504 1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <p className="mt-4 text-[16px] font-medium text-gray-500">No products found</p>
                <p className="mt-2 text-[14px] text-gray-400">Try adjusting your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-[14px] font-semibold text-white hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > PAGE_SIZE && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-[13px] text-gray-500 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-1 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded border text-[13px] transition ${
                        currentPage === p
                          ? "border-blue-600 bg-blue-600 font-bold text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-[13px] text-gray-500 transition hover:border-blue-400 hover:text-blue-600 disabled:opacity-40"
                  aria-label="Next page"
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