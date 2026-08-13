"use client";

import { Search } from "lucide-react";
import { PriceSlider } from "./price-slider";

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
  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Price Range */}
      <div className="border-b border-gray-100 px-4 py-5">
        <h3 className="mb-5 text-[14px] font-semibold text-gray-800">Price Range</h3>
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
          <h3 className="mb-4 text-[14px] font-semibold text-gray-800">Brands</h3>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-[13px] text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {filteredBrands.map((brand) => {
              const checked = selectedBrands.includes(brand);
              return (
                <div key={brand}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition hover:bg-gray-50">
                    <div
                      onClick={() => toggleBrand(brand)}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        checked
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      {checked && (
                        <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[13px] text-gray-700 select-none">{brand}</span>
                  </label>
                </div>
              );
            })}
            {filteredBrands.length === 0 && (
              <div className="py-3 text-center text-[12px] text-gray-400">No brands found</div>
            )}
          </div>
        </div>
      )}

      {/* Clear filters */}
      <div className="border-t border-gray-100 px-4 py-4">
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-[13px] font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
        >
          Clear All Filters
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-700"
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
}