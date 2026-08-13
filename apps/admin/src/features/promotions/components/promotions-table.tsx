"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
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
import { Promotion } from "@/features/promotions/types";

interface PromotionsTableProps {
  data: Promotion[];
}

export function PromotionsTable({ data }: PromotionsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((promo) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      promo.name.toLowerCase().includes(query) ||
      promo.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Promotions <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search name, ID..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No promotions found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Applicable To</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{promo.id}</span>
                </TableCell>
                <TableCell className="font-medium text-gray-900">{promo.name}</TableCell>
                <TableCell className="capitalize text-gray-600">
                  {promo.type.replace("_", " ")}
                </TableCell>
                <TableCell className="text-gray-600">
                  {promo.discountType === "percentage"
                    ? `${promo.discountValue}%`
                    : formatBDT(promo.discountValue)}
                </TableCell>
                <TableCell className="capitalize text-gray-600">
                  {promo.applicableTo}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm text-gray-500">
                  {promo.startDate} - {promo.endDate}
                </TableCell>
                <TableCell>
                  <StatusBadge status={promo.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} promotions
        </p>
      </div>
    </div>
  );
}