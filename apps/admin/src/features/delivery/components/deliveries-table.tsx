'use client';

import { useMemo, useState } from 'react';
import { PackageSearch } from 'lucide-react';
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
import type { Delivery } from '@/features/delivery/types';

interface DeliveriesTableProps {
  data: Delivery[];
  onAssign?: (delivery: Delivery) => void;
  onTrack?: (delivery: Delivery) => void;
}

const PAGE_SIZE = 10;

export function DeliveriesTable({ data, onAssign, onTrack }: DeliveriesTableProps) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (d) =>
        d.customerName.toLowerCase().includes(query) ||
        d.orderId.toLowerCase().includes(query) ||
        d.trackingNumber.toLowerCase().includes(query) ||
        d.courier.toLowerCase().includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <TablePanel
      title="Deliveries"
      count={filtered.length}
      toolbar={
        <SearchInput
          value={search}
          onValueChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search customer, order, tracking..."
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
          icon={PackageSearch}
          title="No deliveries found"
          description="Try adjusting your search to find what you are looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Courier</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell>
                  <p className="font-medium text-gray-900">{delivery.orderId}</p>
                  <p className="font-mono text-xs text-gray-400">{delivery.id}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-gray-900">{delivery.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {delivery.city}
                  </p>
                </TableCell>
                <TableCell className="text-gray-600">{delivery.courier}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-gray-600">
                    {delivery.trackingNumber || '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums text-gray-900">
                  {formatBDT(delivery.shippingCost)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={delivery.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onTrack?.(delivery)}>
                      Track
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssign?.(delivery)}
                      className="text-primary"
                    >
                      Assign
                    </Button>
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