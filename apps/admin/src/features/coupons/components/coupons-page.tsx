"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CouponsTable } from "@/features/coupons/components/coupons-table";
import { CouponForm } from "@/features/coupons/components/coupon-form";
import initialCoupons from "@/features/coupons/data/coupons.json";
import { Coupon } from "@/features/coupons/types";

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>(undefined);

  const handleSave = (coupon: Coupon) => {
    if (editingCoupon) {
      setCoupons(coupons.map((c) => (c.id === coupon.id ? coupon : c)));
    } else {
      setCoupons([...coupons, coupon]);
    }
    setShowForm(false);
    setEditingCoupon(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-gray-500">Manage discount coupons and offers</p>
        </div>
        <button
          onClick={() => { setEditingCoupon(undefined); setShowForm(true); }}
          className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={16} />
          Create Coupon
        </button>
      </div>
      {showForm && (
        <CouponForm
          coupon={editingCoupon}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingCoupon(undefined); }}
        />
      )}
      <CouponsTable data={coupons} />
    </div>
  );
}
