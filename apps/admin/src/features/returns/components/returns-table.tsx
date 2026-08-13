'use client';

import { useState } from 'react';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatBDT } from '@/lib/load-dashboard-data';
import type { Return } from '@/features/returns/types';

interface ReturnsTableProps {
  data: Return[];
  onView?: (ret: Return) => void;
  onRefund?: (ret: Return) => void;
}

export function ReturnsTable({ data, onView, onRefund }: ReturnsTableProps) {
  const [search, setSearch] = useState('');

  const filtered = data.filter((r) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      r.customerName.toLowerCase().includes(query) ||
      r.orderId.toLowerCase().includes(query) ||
      r.product.toLowerCase().includes(query) ||
      r.reason.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Returns <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search customer, order, product..."
        />
      </div>

      {filtered.length === 0 ? (
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
            {filtered.map((ret) => (
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

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} returns
        </p>
      </div>
    </div>
  );
}