"use client";

import { useMemo, useState } from "react";
import { Megaphone, Pencil, Trash2, Tag, Gift, Zap, Sparkles } from "lucide-react";
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
import type { Promotion } from "@/features/promotions/types";

interface PromotionsTableProps {
  data: Promotion[];
  onEdit?: (promotion: Promotion) => void;
  onDelete?: (promotion: Promotion) => void;
  onToggleActive?: (promotion: Promotion) => void;
}

const PAGE_SIZE = 10;

export function PromotionsTable({ data, onEdit, onDelete, onToggleActive }: PromotionsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (promo) =>
        (promo.name || "").toLowerCase().includes(query) ||
        (promo.title || "").toLowerCase().includes(query) ||
        (promo.badge || "").toLowerCase().includes(query) ||
        (promo.id || "").toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "tag":
        return Tag;
      case "gift":
        return Gift;
      case "sparkles":
        return Sparkles;
      default:
        return Zap;
    }
  };

  return (
    <TablePanel
      title="All Promotions & Campaigns"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search promotion name, badge, ID..."
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
          description="Try adjusting your search or create your first promotion campaign."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Promotion & Badge</TableHead>
              <TableHead>Type & Discount</TableHead>
              <TableHead>Target Link</TableHead>
              <TableHead>Schedule Duration</TableHead>
              <TableHead>Campaign Status</TableHead>
              <TableHead>Storefront</TableHead>
              {onEdit || onDelete ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((promo) => {
              const IconComponent = getIcon(promo.icon);
              const isPercentage = String(promo.discountType || "").toUpperCase() === "PERCENTAGE";
              const discountText = isPercentage
                ? `${promo.discountValue}% OFF`
                : formatBDT(promo.discountValue);

              return (
                <TableRow key={promo.id}>
                  {/* Promotion & Badge */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {promo.name || promo.title}
                          </p>
                          {promo.badge && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 shrink-0 border border-blue-200">
                              {promo.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {promo.description || promo.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type & Discount */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-gray-900 block">
                        {discountText}
                      </span>
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider">
                        {String(promo.type || "SALE").replace("_", " ")}
                      </span>
                    </div>
                  </TableCell>

                  {/* Target Link */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="font-medium text-gray-800">{promo.ctaLabel || "Shop Now"}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-[11px] text-gray-500 truncate max-w-[120px]">
                        {promo.ctaHref || "/products"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Schedule Duration */}
                  <TableCell className="whitespace-nowrap text-xs text-gray-600">
                    {promo.startDate || promo.endDate ? (
                      <div>
                        <span>{promo.startDate ? formatShortDate(promo.startDate) : "Anytime"}</span>
                        <span className="mx-1 text-gray-400">–</span>
                        <span>{promo.endDate ? formatShortDate(promo.endDate) : "Ongoing"}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Always Active</span>
                    )}
                  </TableCell>

                  {/* Campaign Status */}
                  <TableCell>
                    <StatusBadge status={promo.status || "ACTIVE"} />
                  </TableCell>

                  {/* Storefront Active Toggle */}
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onToggleActive?.(promo)}
                      className="cursor-pointer transition-transform active:scale-95"
                      title="Toggle active status on storefront"
                    >
                      {promo.active !== false ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 border border-gray-200">
                          Hidden
                        </span>
                      )}
                    </button>
                  </TableCell>

                  {/* Actions */}
                  {onEdit || onDelete ? (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(promo)}
                            aria-label={`Edit ${promo.name}`}
                            title="Edit Promotion"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onDelete(promo)}
                            aria-label={`Delete ${promo.name}`}
                            title="Delete Promotion"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}