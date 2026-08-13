'use client';

import { useState } from 'react';
import { ReceiptText } from 'lucide-react';
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
import type { Payment } from '@/features/payments/types';

interface PaymentsTableProps {
  data: Payment[];
  onView?: (payment: Payment) => void;
}

export function PaymentsTable({ data, onView }: PaymentsTableProps) {
  const [search, setSearch] = useState('');

  const filtered = data.filter((p) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      p.customerName.toLowerCase().includes(query) ||
      p.transactionId.toLowerCase().includes(query) ||
      p.orderId.toLowerCase().includes(query) ||
      p.paymentGateway.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Payments <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search customer, transaction..."
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No payments found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="max-w-[10rem]">
                  <span className="block truncate font-mono text-xs font-medium text-primary">
                    {payment.transactionId}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{payment.orderId}</span>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {payment.customerName}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                  {formatBDT(payment.amount)}
                </TableCell>
                <TableCell className="capitalize text-gray-600">
                  {payment.method.replace('_', ' ')}
                </TableCell>
                <TableCell className="text-gray-600">{payment.paymentGateway}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">{payment.date}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onView?.(payment)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} payments
        </p>
      </div>
    </div>
  );
}