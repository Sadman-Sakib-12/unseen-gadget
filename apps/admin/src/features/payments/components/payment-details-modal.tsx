'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT, formatShortDate } from '@/lib/format';
import type { Payment } from '@/features/payments/types';

interface PaymentDetailsModalProps {
  payment: Payment | null;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function PaymentDetailsModal({ payment, onClose }: PaymentDetailsModalProps) {
  return (
    <Dialog open={payment !== null} onOpenChange={onClose}>
      {payment ? (
        <>
          <DialogHeader close>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <dl className="divide-y divide-gray-100 border-t border-gray-100">
              <Row label="Payment ID" value={payment.id} />
              <Row label="Transaction ID" value={payment.transactionId} />
              <Row label="Order ID" value={payment.orderId} />
              <Row label="Customer" value={payment.customerName} />
              <Row label="Amount" value={formatBDT(payment.amount)} />
              <Row label="Method" value={payment.method.replace('_', ' ')} />
              <Row label="Gateway" value={payment.paymentGateway} />
              <Row label="Date" value={formatShortDate(payment.date)} />
              <Row label="Status" value={<StatusBadge status={payment.status} />} />
            </dl>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  );
}