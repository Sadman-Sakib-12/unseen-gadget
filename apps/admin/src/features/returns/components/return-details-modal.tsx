'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT, formatShortDate } from '@/lib/format';
import type { Return } from '@/features/returns/types';

interface ReturnDetailsModalProps {
  ret: Return | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function ReturnDetailsModal({ ret, onClose }: ReturnDetailsModalProps) {
  return (
    <Dialog open={ret !== null} onOpenChange={onClose}>
      {ret ? (
        <>
          <DialogHeader close>
            <DialogTitle>Return Details</DialogTitle>
            <DialogDescription>{ret.orderId}</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{ret.customerName}</p>
                  <p className="text-sm text-gray-500">{ret.product}</p>
                </div>
                <StatusBadge status={ret.status} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">Reason</p>
                <p className="mt-1.5 rounded-lg border border-gray-100 bg-gray-50/50 p-3.5 text-sm leading-relaxed text-gray-600">
                  {ret.reason}
                </p>
              </div>

              <dl className="divide-y divide-gray-100 border-t border-gray-100">
                <Row label="Return ID" value={ret.id} />
                <Row label="Refund amount" value={formatBDT(ret.refundAmount)} />
                <Row label="Request date" value={formatShortDate(ret.requestDate)} />
                <Row label="Resolved date" value={ret.resolvedDate ? formatShortDate(ret.resolvedDate) : 'Pending'} />
              </dl>
            </div>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}