'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, PackageCheck, TruckIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { DeliveriesTable } from '@/features/delivery/components/deliveries-table';
import { DeliveryAssignModal } from '@/features/delivery/components/delivery-assign-modal';
import { TrackingModal } from '@/features/delivery/components/tracking-modal';
import { api } from '@/lib/api';
import type { Delivery } from '@/features/delivery/types';

export function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignModal, setAssignModal] = useState<Delivery | null>(null);
  const [trackingModal, setTrackingModal] = useState<Delivery | null>(null);

  useEffect(() => {
    api.deliveries
      .list()
      .then((res) => setDeliveries((res.data as Delivery[]) ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (deliveryId: string, courier: string, tracking: string) => {
    try {
      const res = await api.deliveries.update(deliveryId, { courier, trackingNumber: tracking });
      setDeliveries((prev) =>
        prev.map((d) => (d.id === deliveryId ? (res.data as Delivery) : d))
      );
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Failed to update delivery');
    }
  };

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === 'pending').length,
    inTransit: deliveries.filter((d) => d.status === 'in_transit' || d.status === 'picked_up').length,
    delivered: deliveries.filter((d) => d.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Deliveries" description="Track and manage shipments." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total deliveries"
          value={stats.total}
          icon={TruckIcon}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          iconClassName="bg-orange-50 text-orange-700"
        />
        <StatCard
          title="In transit"
          value={stats.inTransit}
          icon={PackageCheck}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
      <DeliveriesTable
        data={deliveries}
        onAssign={setAssignModal}
        onTrack={setTrackingModal}
      />
      )}

      <DeliveryAssignModal
        key={assignModal?.id ?? 'assign'}
        delivery={assignModal}
        onClose={() => setAssignModal(null)}
        onAssign={handleAssign}
      />
      <TrackingModal
        key={trackingModal?.id ?? 'tracking'}
        delivery={trackingModal}
        onClose={() => setTrackingModal(null)}
      />
    </div>
  );
}