"use client";

import { Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBarcodeScan: () => void;
}

export function ProductSearch({ searchQuery, onSearchChange, onBarcodeScan }: ProductSearchProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <SearchInput
          className="w-full"
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Search products by name, SKU, or barcode..."
        />
      </div>
      <Button type="button" variant="outline" onClick={onBarcodeScan}>
        <Barcode className="h-4 w-4" />
        Scan
      </Button>
    </div>
  );
}