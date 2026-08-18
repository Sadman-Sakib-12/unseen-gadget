'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface PaginationProps {
  /** Current page, 1-indexed. */
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Compact, premium pagination: "Showing A–B of C" + Prev / page numbers / Next. */
function Pagination({ page, pageCount, total, pageSize, onPageChange, className }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const pages = React.useMemo(() => {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const result = new Set<number>([1, pageCount, page - 1, page, page + 1]);
    return Array.from(result)
      .filter((p) => p >= 1 && p <= pageCount)
      .sort((a, b) => a - b);
  }, [page, pageCount]);

  const pageNumberButton = (p: number) => (
    <button
      key={p}
      type="button"
      onClick={() => onPageChange(p)}
      aria-current={p === page ? 'page' : undefined}
      className={cn(
        'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors',
        p === page
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {p}
    </button>
  );

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-gray-900">{from}–{to}</span> of{' '}
        <span className="font-medium text-gray-900">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <React.Fragment key={p}>
              {showEllipsis ? (
                <span className="px-1 text-sm text-gray-400">…</span>
              ) : null}
              {pageNumberButton(p)}
            </React.Fragment>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { Pagination };