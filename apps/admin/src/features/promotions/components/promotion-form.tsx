"use client";
import { useState } from "react";
import { Promotion } from "@/features/promotions/types";

interface PromotionFormProps {
  promotion?: Promotion;
  onSave: (promo: Promotion) => void;
  onCancel: () => void;
}

export function PromotionForm({ promotion, onSave, onCancel }: PromotionFormProps) {
  const [formData, setFormData] = useState({
    id: promotion?.id || "PROMO-" + String(Date.now()).slice(-3),
    name: promotion?.name || "",
    type: promotion?.type || "sale",
    discountType: promotion?.discountType || "percentage",
    discountValue: promotion?.discountValue || 0,
    applicableTo: promotion?.applicableTo || "all",
    startDate: promotion?.startDate || "",
    endDate: promotion?.endDate || "",
    status: promotion?.status || "scheduled",
    description: promotion?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Promotion);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{promotion ? "Edit Promotion" : "Create Promotion"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
            <option value="sale">Sale</option>
            <option value="bundle">Bundle</option>
            <option value="free_shipping">Free Shipping</option>
            <option value="bogo">Buy One Get One</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Type</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Value</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Applicable To</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.applicableTo} onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value as any })}>
            <option value="all">All Products</option>
            <option value="category">Category</option>
            <option value="product">Specific Product</option>
            <option value="brand">Brand</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="ended">Ended</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Promotion</button>
      </div>
    </form>
  );
}
