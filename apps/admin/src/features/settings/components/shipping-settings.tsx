"use client";
import { ShippingSettings } from "@/features/settings/types";
import { useState } from "react";

interface ShippingSettingsProps {
  settings: ShippingSettings;
  onSave: (settings: ShippingSettings) => void;
}

export function ShippingSettingsComponent({ settings, onSave }: ShippingSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">Shipping Settings</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Free Shipping Threshold (BDT)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.freeShippingThreshold} onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Shipping Cost (BDT)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.defaultShippingCost} onChange={(e) => setFormData({ ...formData, defaultShippingCost: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Express Shipping Cost (BDT)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.expressShippingCost} onChange={(e) => setFormData({ ...formData, expressShippingCost: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Standard Delivery (days)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.estimatedDeliveryDays.standard} onChange={(e) => setFormData({ ...formData, estimatedDeliveryDays: { ...formData.estimatedDeliveryDays, standard: Number(e.target.value) }})} />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Settings</button>
      </div>
    </form>
  );
}
