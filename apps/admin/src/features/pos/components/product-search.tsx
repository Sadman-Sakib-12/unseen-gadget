"use client";

import { Search, Barcode } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBarcodeScan: () => void;
}

export function ProductSearch({ searchQuery, onSearchChange, onBarcodeScan }: ProductSearchProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-black focus:outline-none"
        />
      </div>
      <button
        onClick={onBarcodeScan}
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
      >
        <Barcode className="h-4 w-4" />
        Scan
      </button>
    </div>
  );
}
