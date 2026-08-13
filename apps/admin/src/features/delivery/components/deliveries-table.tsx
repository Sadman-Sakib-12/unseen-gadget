'use client';

import { useState } from 'react';
import { PackageSearch } from 'lucide-react';
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
import type { Delivery } from '@/features/delivery/types';

interface DeliveriesTableProps {
  data: Delivery[];
  onAssign?: (delivery: Delivery) => void;
  onTrack?: (delivery: Delivery) => void;
}

export function DeliveriesTable({ data, onAssign, onTrack }: DeliveriesTableProps) {
  const [search, setSearch] = useState('');

  const filtered = data.filter((d) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      d.customerName.toLowerCase().includes(query) ||
      d.orderId.toLowerCase().includes(query) ||
      d.trackingNumber.toLowerCase().includes(query) ||
      d.courier.toLowerCase().includes(query)
    );
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-900">
          Deliveries <span className="text-gray-400">({filtered.length})</span>
        </p>
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search customer, order, tracking..."
        />
      </div>

      {filtered.length === 0 ? (
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
            {filtered.map((delivery) => (
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
                  {delivery.shippingCost} BDT
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

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {data.length} deliveries
        </p>
      </div>
    </div>
  );
}