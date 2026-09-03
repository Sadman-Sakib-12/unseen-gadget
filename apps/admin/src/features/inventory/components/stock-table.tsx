"use client";

import { useMemo, useState } from "react";
import { ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { TablePanel } from "@/components/ui/table-panel";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/components/ui/utils";
import { InventoryItem } from "@/features/inventory/types";

interface StockTableProps {
  items: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
}

const PAGE_SIZE = 10;

function getWarehouseName(warehouse: InventoryItem["warehouse"]): string {
  if (!warehouse) return "Main Warehouse";
  if (typeof warehouse === "string") return warehouse;
  return warehouse.name || "Main Warehouse";
}

export function StockTable({ items, onAdjust }: StockTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => {
      const name = (item.name || item.product?.name || "").toLowerCase();
      const sku = (item.sku || item.product?.sku || "").toLowerCase();
      const warehouse = getWarehouseName(item.warehouse).toLowerCase();
      return name.includes(query) || sku.includes(query) || warehouse.includes(query);
    });
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Current Stock"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search product, SKU, warehouse..."
        />
      }
      footer={
        filtered.length > 0 ? (
          <Pagination
            page={safePage}
            pageCount={totalPages}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        ) : null
      }
    >
      {rows.length === 0 ? (
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
            {rows.map((item) => {
              const productName = item.name || item.product?.name || "Product";
              const productSku = item.sku || item.product?.sku || "N/A";
              const warehouseName = getWarehouseName(item.warehouse);
              const lastRestockDate = item.lastRestocked || item.updatedAt || item.createdAt;

              return (
                <TableRow key={item.id || item.productId}>
                  <TableCell className="font-medium text-gray-900">{productName}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-gray-500">{productSku}</span>
                  </TableCell>
                  <TableCell className="text-gray-600">{warehouseName}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                    <span
                      className={cn(
                        item.status === "OUT_OF_STOCK" && "text-red-600",
                        item.status === "LOW_STOCK" && "text-amber-600"
                      )}
                    >
                      {item.stock}
                    </span>
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
                    {lastRestockDate ? formatShortDate(lastRestockDate) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onAdjust(item)}>
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}