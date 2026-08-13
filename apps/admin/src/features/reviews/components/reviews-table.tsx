"use client";
import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
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
import type { Review } from "@/features/reviews/types";

interface ReviewsTableProps {
  data: Review[];
  onView?: (review: Review) => void;
}

export function ReviewsTable({ data, onView }: ReviewsTableProps) {
  const [search, setSearch] = useState("");
  const filtered = data.filter((r) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      r.productName.toLowerCase().includes(query) ||
      r.customerName.toLowerCase().includes(query)
    );
  });
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Reviews <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search product, customer..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">Helpful</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((review) => (
              <TableRow
                key={review.id}
                onClick={() => onView?.(review)}
                className={onView ? "cursor-pointer" : undefined}
              >
                <TableCell>
                  <span className="font-mono text-xs text-gray-500">{review.id}</span>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{review.productName}</p>
                </TableCell>
                <TableCell className="text-gray-600">{review.customerName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {review.rating}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-gray-600">
                  {review.comment}
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-gray-400" />
                    {review.helpful}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={review.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} reviews
        </p>
      </div>
    </div>
  );
}