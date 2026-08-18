"use client";

import { useMemo, useState } from "react";
import { Megaphone, Pencil } from "lucide-react";
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
import { Promotion } from "@/features/promotions/types";

interface PromotionsTableProps {
  data: Promotion[];
  onEdit?: (promotion: Promotion) => void;
}

const PAGE_SIZE = 10;

export function PromotionsTable({ data, onEdit }: PromotionsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (promo) =>
        promo.name.toLowerCase().includes(query) ||
        promo.id.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Promotions"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search name, ID..."
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
              {onEdit ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((promo) => (
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
                  {formatShortDate(promo.startDate)} – {formatShortDate(promo.endDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={promo.status} />
                </TableCell>
                {onEdit ? (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(promo)}
                      aria-label={`Edit promotion ${promo.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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