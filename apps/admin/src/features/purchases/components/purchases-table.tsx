"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
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
import { formatBDT, formatShortDate } from "@/lib/format";
import { Purchase } from "@/features/purchases/types";

interface PurchasesTableProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
}

const PAGE_SIZE = 10;

export function PurchasesTable({ purchases, onView }: PurchasesTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return purchases;
    return purchases.filter(
      (purchase) =>
        purchase.invoiceNumber.toLowerCase().includes(query) ||
        purchase.supplierName.toLowerCase().includes(query)
    );
  }, [purchases, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Purchases"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search invoice, supplier..."
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
            {rows.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {purchase.invoiceNumber}
                  </span>
                </TableCell>
                <TableCell className="text-gray-700">{purchase.supplierName}</TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {formatShortDate(purchase.date)}
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
    </TablePanel>
  );
}