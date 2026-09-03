"use client";

import { useMemo, useState } from "react";
import { Pencil, Ticket, Trash2 } from "lucide-react";
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
import { Coupon } from "@/features/coupons/types";

interface CouponsTableProps {
  data: Coupon[];
  onEdit?: (coupon: Coupon) => void;
  onDelete?: (coupon: Coupon) => void;
}

const PAGE_SIZE = 10;

export function CouponsTable({ data, onEdit, onDelete }: CouponsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (coupon) =>
        coupon.code.toLowerCase().includes(query) ||
        coupon.id.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Coupons"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search code, ID..."
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
          icon={Ticket}
          title="No coupons found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Status</TableHead>
              {onEdit || onDelete ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{coupon.id}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {coupon.code}
                  </span>
                </TableCell>
                <TableCell className="text-gray-600">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : formatBDT(coupon.discountValue)}
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatBDT(coupon.minimumOrder)}
                </TableCell>
                <TableCell className="text-gray-600">
                  {coupon.usedCount} / {coupon.usageLimit}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {formatShortDate(coupon.expiryDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={coupon.status} />
                </TableCell>
                {onEdit || onDelete ? (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(coupon)}
                          aria-label={`Edit coupon ${coupon.code}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
                          onClick={() => onDelete(coupon)}
                          aria-label={`Delete coupon ${coupon.code}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}