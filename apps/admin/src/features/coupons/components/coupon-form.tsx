"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Coupon } from "@/features/coupons/types";

interface CouponFormProps {
  coupon?: Coupon | null;
  onSave: (coupon: Coupon) => void;
  onCancel: () => void;
}

export function CouponForm({ coupon, onSave, onCancel }: CouponFormProps) {
  const [formData, setFormData] = useState({
    id: coupon?.id || "",
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
    const id = coupon?.id || `CPN-${String(Date.now()).slice(-3)}`;
    onSave({ ...formData, id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{coupon ? "Edit Coupon" : "Create Coupon"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <Input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <Select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                options={[
                  { value: "percentage", label: "Percentage" },
                  { value: "fixed", label: "Fixed Amount" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Discount Value</label>
              <Input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Minimum Order</label>
              <Input
                type="number"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "expired", label: "Expired" },
                ]}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Coupon</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}