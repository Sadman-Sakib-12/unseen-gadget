'use client';

import { useState, useMemo } from 'react';
import { BadgeCheck, CreditCard, WalletCards } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { PaymentsTable } from '@/features/payments/components/payments-table';
import { PaymentDetailsModal } from '@/features/payments/components/payment-details-modal';
import { formatBDT } from '@/lib/load-dashboard-data';
import { useAdminPayments } from '@/hooks/use-admin-queries';

import type { Payment } from '@/features/payments/types';

export function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { data: res } = useAdminPayments();

  const raw: Payment[] = useMemo(() => {
    const payload = res?.data as { payments?: Payment[] } | Payment[] | undefined;
    return Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.payments)
      ? payload.payments
      : [];
  }, [res]);

  const stats = useMemo(() => {
    return {
      total: raw.length,
      completed: raw.filter((p: Payment) => String(p?.status || '').toUpperCase() === 'APPROVED').length,
      pending: raw.filter((p: Payment) => String(p?.status || '').toUpperCase() === 'PENDING').length,
      failed: raw.filter((p: Payment) => String(p?.status || '').toUpperCase() === 'REJECTED').length,
      volume: raw
        .filter((p: Payment) => String(p?.status || '').toUpperCase() === 'APPROVED')
        .reduce((sum: number, p: Payment) => sum + (Number(p?.amount) || 0), 0),
    };
  }, [raw]);

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

      <PaymentsTable data={raw} onView={setSelectedPayment} />

      <PaymentDetailsModal
        key={selectedPayment?.id ?? 'payment'}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}