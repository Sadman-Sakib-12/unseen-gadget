'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Pause, Plus, Ticket, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CouponsTable } from '@/features/coupons/components/coupons-table';
import { CouponForm } from '@/features/coupons/components/coupon-form';
import type { Coupon } from '@/features/coupons/types';
import { useAdminCoupons, useSaveAdminCoupon, useDeleteAdminCoupon } from '@/hooks/use-admin-queries';

export function CouponsPage() {
  const { data: couponsRes } = useAdminCoupons();
  const saveCouponMutation = useSaveAdminCoupon();
  const deleteCouponMutation = useDeleteAdminCoupon();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const coupons = useMemo(() => {
    const raw = (couponsRes as any)?.data ?? couponsRes;
    return (Array.isArray(raw) ? raw : []) as Coupon[];
  }, [couponsRes]);

  const handleSave = async (coupon: Coupon) => {
    try {
      await saveCouponMutation.mutateAsync({
        id: editingCoupon?.id ? String(editingCoupon.id) : undefined,
        data: coupon as unknown as Record<string, unknown>,
      });
      toast.success(editingCoupon ? 'Coupon updated successfully' : 'Coupon created successfully');
      setShowForm(false);
      setEditingCoupon(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save coupon');
    }
  };

  const handleDelete = (coupon: Coupon) => {
    setDeleteTarget(coupon);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteCouponMutation.mutateAsync(deleteTarget.id);
        toast.success(`Coupon ${deleteTarget.code} deleted successfully`);
        setDeleteTarget(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete coupon');
      }
    }
  };

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === 'active').length,
    inactive: coupons.filter((c) => c.status === 'inactive').length,
    expired: coupons.filter((c) => c.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Manage discount coupons and offers."
        actions={
          <Button
            onClick={() => {
              setEditingCoupon(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total coupons"
          value={stats.total}
          icon={Ticket}
          iconClassName="bg-blue-50 text-blue-500"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Inactive"
          value={stats.inactive}
          icon={Pause}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Expired"
          value={stats.expired}
          icon={XCircle}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      {showForm && (
        <CouponForm
          coupon={editingCoupon}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCoupon(null);
          }}
        />
      )}

      <CouponsTable
        data={coupons}
        onEdit={(coupon) => {
          setEditingCoupon(coupon);
          setShowForm(true);
        }}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        description={`Are you sure you want to permanently delete coupon "${deleteTarget?.code}"? This will invalidate the coupon code immediately.`}
        confirmLabel="Delete Coupon"
        destructive
      />
    </div>
  );
}