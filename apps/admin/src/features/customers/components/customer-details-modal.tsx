'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Customer } from '@/features/customers/types';
import { formatBDT, formatShortDate } from '@/lib/format';

interface CustomerDetailsModalProps {
  customer: Customer | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  return (
    <Dialog open={customer !== null} onOpenChange={onClose}>
      {customer ? (
        <>
          <DialogHeader close>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>{customer.email}</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{customer.name}</p>
                  <p className="text-sm text-gray-500">
                    {customer.address}, {customer.city}
                  </p>
                </div>
                <StatusBadge status={customer.status} />
              </div>

              <dl className="divide-y divide-gray-100 border-t border-gray-100">
                <Row label="Customer ID" value={customer.id} />
                <Row label="Phone" value={customer.phone} />
                <Row label="Total orders" value={customer.totalOrders} />
                <Row label="Total spent" value={formatBDT(customer.totalSpent)} />
                <Row label="Last order" value={customer.lastOrder ? formatShortDate(customer.lastOrder) : 'N/A'} />
                <Row label="Joined" value={formatShortDate(customer.joinDate)} />
              </dl>
            </div>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}