'use client';

import { useState } from 'react';
import { CheckCircle2, RotateCcw, ShieldAlert, Undo2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { ReturnsTable } from '@/features/returns/components/returns-table';
import { ReturnDetailsModal } from '@/features/returns/components/return-details-modal';
import { RefundModal } from '@/features/returns/components/refund-modal';
import initialReturns from '@/features/returns/data/returns.json';
import type { Return } from '@/features/returns/types';

export function ReturnsPage() {
  const [returns, setReturns] = useState<Return[]>(initialReturns);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [refundModal, setRefundModal] = useState<Return | null>(null);

  const handleRefund = (returnId: string) => {
    setReturns((prev) =>
      prev.map((r) =>
        r.id === returnId
          ? { ...r, status: 'refunded', resolvedDate: new Date().toISOString().split('T')[0] }
          : r
      )
    );
  };

  const stats = {
    total: returns.length,
    pending: returns.filter((r) => r.status === 'pending').length,
    approved: returns.filter((r) => r.status === 'approved').length,
    refunded: returns.filter((r) => r.status === 'refunded').length,
    rejected: returns.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returns & Refunds"
        description="Manage product returns and process refunds."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total requests"
          value={stats.total}
          icon={RotateCcw}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Undo2}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Refunded"
          value={stats.refunded}
          icon={ShieldAlert}
          iconClassName="bg-violet-50 text-violet-700"
        />
      </div>

      <ReturnsTable
        data={returns}
        onView={setSelectedReturn}
        onRefund={setRefundModal}
      />

      <ReturnDetailsModal
        key={selectedReturn?.id ?? 'details'}
        ret={selectedReturn}
        onClose={() => setSelectedReturn(null)}
      />
      <RefundModal
        key={refundModal?.id ?? 'refund'}
        ret={refundModal}
        onClose={() => setRefundModal(null)}
        onConfirm={handleRefund}
      />
    </div>
  );
}