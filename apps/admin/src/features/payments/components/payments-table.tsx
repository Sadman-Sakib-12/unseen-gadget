'use client';

import { useMemo, useState } from 'react';
import { ReceiptText } from 'lucide-react';
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
import { formatBDT, formatShortDate } from '@/lib/format';
import type { Payment } from '@/features/payments/types';

interface PaymentsTableProps {
  data: Payment[];
  onView?: (payment: Payment) => void;
}

const PAGE_SIZE = 10;

export function PaymentsTable({ data, onView }: PaymentsTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (p) =>
        p.customerName.toLowerCase().includes(query) ||
        p.transactionId.toLowerCase().includes(query) ||
        p.orderId.toLowerCase().includes(query) ||
        p.paymentGateway.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Payments"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search customer, transaction..."
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
            {rows.map((payment) => (
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
                <TableCell className="whitespace-nowrap text-gray-600">
                  {formatShortDate(payment.date)}
                </TableCell>
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
    </TablePanel>
  );
}