"use client";

import { Search } from "lucide-react";
import { PriceSlider } from "./price-slider";
import { useTranslation } from "@/hooks/use-translation";

export function Sidebar({
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
  onClose,
}: {
  minPrice: number;
  maxPrice: number;
  lowPrice: number;
  highPrice: number;
  setLowPrice: (v: number) => void;
  setHighPrice: (v: number) => void;
  brands: string[];
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
  brandSearch: string;
  setBrandSearch: (v: string) => void;
  clearFilters: () => void;
  onClose?: () => void;
}) {
  const { t } = useTranslation();
  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="bg-card">
      {/* Price Range */}
      <div className="border-b border-border px-4 py-5">
        <h3 className="mb-5 text-[14px] font-semibold text-foreground">{t("shop.filterPrice")}</h3>
        <PriceSlider
          min={minPrice}
          max={maxPrice}
          low={lowPrice}
          high={highPrice}
          onLowChange={setLowPrice}
          onHighChange={setHighPrice}
        />
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="px-4 py-5">
          <h3 className="mb-4 text-[14px] font-semibold text-foreground">{t("shop.filterBrands")}</h3>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("shop.searchBrands")}
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => {
              const checked = selectedBrands.includes(brand);
              return (
                <div key={brand}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent">
                    <div
                      onClick={() => toggleBrand(brand)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        checked
                          ? "border-primary bg-primary"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      {checked && (
                        <svg className="h-2.5 w-2.5 text-primary-foreground" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <span className="select-none text-[13px] text-foreground">{brand}</span>
                  </label>
                </div>
              );
            })}
            {filteredBrands.length === 0 && (
              <div className="py-3 text-center text-[12px] text-muted-foreground">{t("shop.noBrands")}</div>
            )}
          </div>
        </div>
      )}

      {/* Clear filters */}
      <div className="border-t border-border px-4 py-4">
        <button
          onClick={clearFilters}
          className="btn-outline w-full"
        >
          {t("shop.clearFilters")}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="btn-primary mt-2 w-full"
          >
            {t("shop.applyFilters")}
          </button>
        )}
      </div>
    </div>
  );
}
