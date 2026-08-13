"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
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
import { Coupon } from "@/features/coupons/types";

interface CouponsTableProps {
  data: Coupon[];
}

export function CouponsTable({ data }: CouponsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((coupon) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      coupon.code.toLowerCase().includes(query) ||
      coupon.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Coupons <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search code, ID..."
        />
      </div>

      {filtered.length === 0 ? (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((coupon) => (
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
                  {coupon.expiryDate}
                </TableCell>
                <TableCell>
                  <StatusBadge status={coupon.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} coupons
        </p>
      </div>
    </div>
  );
}