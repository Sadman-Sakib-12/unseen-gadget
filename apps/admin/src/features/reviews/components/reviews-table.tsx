"use client";
import { useMemo, useState } from "react";
import { Eye, Star, ThumbsUp } from "lucide-react";
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
import type { Review } from "@/features/reviews/types";

interface ReviewsTableProps {
  data: Review[];
  onView?: (review: Review) => void;
}

const PAGE_SIZE = 10;

export function ReviewsTable({ data, onView }: ReviewsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (r) =>
        r.productName.toLowerCase().includes(query) ||
        r.customerName.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Reviews"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search product, customer..."
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
              {onView ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((review) => (
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
                {onView ? (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(review)}
                      className="text-gray-600"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View review {review.id}</span>
                      View
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