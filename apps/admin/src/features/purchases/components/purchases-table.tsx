"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
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
import { formatBDT } from "@/lib/load-dashboard-data";
import { Purchase } from "@/features/purchases/types";

interface PurchasesTableProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
}

export function PurchasesTable({ purchases, onView }: PurchasesTableProps) {
  const [search, setSearch] = useState("");

  const filtered = purchases.filter((purchase) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      purchase.invoiceNumber.toLowerCase().includes(query) ||
      purchase.supplierName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Purchases <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search invoice, supplier..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No purchases found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {purchase.invoiceNumber}
                  </span>
                </TableCell>
                <TableCell className="text-gray-700">{purchase.supplierName}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {purchase.date}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {formatBDT(purchase.total)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-green-600">
                  {formatBDT(purchase.paidAmount)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  <span
                    className={
                      purchase.dueAmount > 0 ? "font-medium text-red-600" : "text-gray-500"
                    }
                  >
                    {formatBDT(purchase.dueAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={purchase.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onView(purchase)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {purchases.length} purchases
        </p>
      </div>
    </div>
  );
}