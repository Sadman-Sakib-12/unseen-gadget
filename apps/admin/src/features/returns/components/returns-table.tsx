'use client';

import { useMemo, useState } from 'react';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/status-badge';
import { TablePanel } from '@/components/ui/table-panel';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatBDT } from '@/lib/format';
import type { Return } from '@/features/returns/types';

interface ReturnsTableProps {
  data: Return[];
  onView?: (ret: Return) => void;
  onRefund?: (ret: Return) => void;
}

const PAGE_SIZE = 10;

export function ReturnsTable({ data, onView, onRefund }: ReturnsTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (r) =>
        r.customerName.toLowerCase().includes(query) ||
        r.orderId.toLowerCase().includes(query) ||
        r.product.toLowerCase().includes(query) ||
        r.reason.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Returns"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search customer, order, product..."
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
          icon={PackageX}
          title="No returns found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Return</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Refund</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell>
                  <p className="font-mono text-xs font-medium text-primary">{ret.id}</p>
                  <p className="text-xs text-gray-400">{ret.orderId}</p>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {ret.customerName}
                </TableCell>
                <TableCell className="max-w-[12rem] truncate text-gray-600">
                  {ret.product}
                </TableCell>
                <TableCell className="max-w-[14rem] truncate text-gray-600">
                  {ret.reason}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {formatBDT(ret.refundAmount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={ret.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onView?.(ret)}>
                      View
                    </Button>
                    {ret.status === 'approved' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary"
                        onClick={() => onRefund?.(ret)}
                      >
                        Refund
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TablePanel>
  );
}