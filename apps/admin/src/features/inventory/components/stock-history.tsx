"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { StockMovement } from "@/features/inventory/types";

interface StockHistoryProps {
  movements: StockMovement[];
}

const PAGE_SIZE = 10;

export function StockHistory({ movements }: StockHistoryProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return movements;
    return movements.filter((movement) => {
      const productName = (movement.productName || movement.product?.name || "").toLowerCase();
      const reference = (movement.reference || "").toLowerCase();
      const note = (movement.note || "").toLowerCase();
      return productName.includes(query) || reference.includes(query) || note.includes(query);
    });
  }, [movements, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Stock Movement History"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search product, reference..."
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
          icon={History}
          title="No stock movements found"
          description="Try adjusting your search or recording a new stock movement."
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
            {rows.map((movement) => {
              const productName = movement.productName || movement.product?.name || "Product";
              const movementDate = movement.date || movement.createdAt;

              return (
                <TableRow key={movement.id}>
                  <TableCell className="whitespace-nowrap text-sm text-gray-500">
                    {movementDate ? formatShortDate(movementDate) : "—"}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {productName}
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
                    className={`text-right font-mono tabular-nums font-semibold ${
                      movement.type === "IN"
                        ? "text-emerald-600"
                        : movement.type === "OUT"
                          ? "text-red-600"
                          : "text-blue-600"
                    }`}
                  >
                    {movement.type === "IN" ? "+" : movement.type === "OUT" ? "-" : "±"}
                    {Math.abs(movement.quantity)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{movement.reference || "N/A"}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{movement.note || "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}