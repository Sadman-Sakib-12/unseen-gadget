"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { StockMovement } from "@/features/inventory/types";

interface StockHistoryProps {
  movements: StockMovement[];
}

export function StockHistory({ movements }: StockHistoryProps) {
  const [search, setSearch] = useState("");

  const filtered = movements.filter((movement) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      movement.productName.toLowerCase().includes(query) ||
      movement.reference.toLowerCase().includes(query) ||
      movement.note.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Stock Movement History{" "}
          <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search product, reference..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No stock movements found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {movement.date}
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {movement.productName}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={movement.type}
                    tone={
                      movement.type === "IN"
                        ? "success"
                        : movement.type === "OUT"
                          ? "destructive"
                          : "secondary"
                    }
                  />
                </TableCell>
                <TableCell
                  className={`text-right font-mono tabular-nums ${
                    movement.quantity > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {movement.quantity > 0 ? "+" : ""}
                  {movement.quantity}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{movement.reference}</Badge>
                </TableCell>
                <TableCell className="text-gray-500">{movement.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {movements.length} movements
        </p>
      </div>
    </div>
  );
}