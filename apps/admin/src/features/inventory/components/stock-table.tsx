"use client";

import { useState } from "react";
import { ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "@/features/inventory/types";

interface StockTableProps {
  items: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
}

export function StockTable({ items, onAdjust }: StockTableProps) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.warehouse.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Current Stock <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search product, SKU, warehouse..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ArchiveRestore}
          title="No stock items found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Min</TableHead>
              <TableHead className="text-right">Max</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Restocked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{item.sku}</span>
                </TableCell>
                <TableCell className="text-gray-600">{item.warehouse}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {item.stock}
                </TableCell>
                <TableCell className="text-right tabular-nums text-gray-500">
                  {item.minStock}
                </TableCell>
                <TableCell className="text-right tabular-nums text-gray-500">
                  {item.maxStock}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-sm text-gray-500">
                  {item.lastRestocked}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onAdjust(item)}>
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {items.length} stock items
        </p>
      </div>
    </div>
  );
}