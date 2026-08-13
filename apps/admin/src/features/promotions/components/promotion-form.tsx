"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Promotion } from "@/features/promotions/types";

interface PromotionFormProps {
  promotion?: Promotion;
  onSave: (promo: Promotion) => void;
  onCancel: () => void;
}

export function PromotionForm({ promotion, onSave, onCancel }: PromotionFormProps) {
  const [formData, setFormData] = useState({
    id: promotion?.id || "",
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
    const id = promotion?.id || `PROMO-${String(Date.now()).slice(-3)}`;
    onSave({ ...formData, id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{promotion ? "Edit Promotion" : "Create Promotion"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: "sale", label: "Sale" },
                  { value: "bundle", label: "Bundle" },
                  { value: "free_shipping", label: "Free Shipping" },
                  { value: "bogo", label: "Buy One Get One" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Discount Value
              </label>
              <Input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Applicable To
              </label>
              <Select
                value={formData.applicableTo}
                onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                options={[
                  { value: "all", label: "All Products" },
                  { value: "category", label: "Category" },
                  { value: "product", label: "Specific Product" },
                  { value: "brand", label: "Brand" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: "active", label: "Active" },
                  { value: "scheduled", label: "Scheduled" },
                  { value: "ended", label: "Ended" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Promotion</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}