"use client";

import { useState } from "react";
import { CheckCircle2, Pause, Plus, Ticket, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { CouponsTable } from "@/features/coupons/components/coupons-table";
import { CouponForm } from "@/features/coupons/components/coupon-form";
import initialCoupons from "@/features/coupons/data/coupons.json";
import { Coupon } from "@/features/coupons/types";

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);

  const handleSave = (coupon: Coupon) => {
    setCoupons((prev) =>
      editingCoupon ? prev.map((c) => (c.id === coupon.id ? coupon : c)) : [...prev, coupon]
    );
    setShowForm(false);
    setEditingCoupon(undefined);
  };

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.status === "active").length,
    inactive: coupons.filter((c) => c.status === "inactive").length,
    expired: coupons.filter((c) => c.status === "expired").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Manage discount coupons and offers."
        actions={
          <Button
            onClick={() => {
              setEditingCoupon(undefined);
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
          iconClassName="bg-blue-50 text-blue-700"
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
            setEditingCoupon(undefined);
          }}
        />
      )}

      <CouponsTable
        data={coupons}
        onEdit={(coupon) => {
          setEditingCoupon(coupon);
          setShowForm(true);
        }}
      />
    </div>
  );
}