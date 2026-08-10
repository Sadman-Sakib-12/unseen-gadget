"use client";
import { useState } from "react";
import { Coupon } from "@/features/coupons/types";

interface CouponFormProps {
  coupon?: Coupon;
  onSave: (coupon: Coupon) => void;
  onCancel: () => void;
}

export function CouponForm({ coupon, onSave, onCancel }: CouponFormProps) {
  const [formData, setFormData] = useState({
    id: coupon?.id || "CPN-" + String(Date.now()).slice(-3),
    code: coupon?.code || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || 0,
    minimumOrder: coupon?.minimumOrder || 0,
    maximumDiscount: coupon?.maximumDiscount || 0,
    usageLimit: coupon?.usageLimit || 100,
    usedCount: coupon?.usedCount || 0,
    expiryDate: coupon?.expiryDate || "",
    status: coupon?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Coupon);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{coupon ? "Edit Coupon" : "Create Coupon"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Type</label>
          <select
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Value</label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Minimum Order</label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.minimumOrder}
            onChange={(e) => setFormData({ ...formData, minimumOrder: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Coupon</button>
      </div>
    </form>
  );
}
