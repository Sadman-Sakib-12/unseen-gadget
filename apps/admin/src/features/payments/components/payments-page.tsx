'use client';

import { useState } from 'react';
import { BadgeCheck, CreditCard, WalletCards } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { PaymentsTable } from '@/features/payments/components/payments-table';
import { PaymentDetailsModal } from '@/features/payments/components/payment-details-modal';
import initialPayments from '@/features/payments/data/payments.json';
import type { Payment } from '@/features/payments/types';
import { formatBDT } from '@/lib/load-dashboard-data';

export function PaymentsPage() {
  const [payments] = useState<Payment[]>(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
    volume: payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="View and manage payment transactions."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total transactions"
          value={stats.total}
          icon={WalletCards}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={BadgeCheck}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={CreditCard}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Volume"
          value={formatBDT(stats.volume)}
          icon={CreditCard}
          iconClassName="bg-violet-50 text-violet-700"
        />
      </div>

      <PaymentsTable data={payments} onView={setSelectedPayment} />

      <PaymentDetailsModal
        key={selectedPayment?.id ?? 'payment'}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}