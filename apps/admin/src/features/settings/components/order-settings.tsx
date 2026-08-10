"use client";
import { OrderSettings } from "@/features/settings/types";
import { useState } from "react";

interface OrderSettingsProps {
  settings: OrderSettings;
  onSave: (settings: OrderSettings) => void;
}

export function OrderSettingsComponent({ settings, onSave }: OrderSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">Order Settings</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.autoConfirmOrders} onChange={(e) => setFormData({ ...formData, autoConfirmOrders: e.target.checked })} />
            <span className="text-sm">Auto-confirm orders</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.allowCancellation} onChange={(e) => setFormData({ ...formData, allowCancellation: e.target.checked })} />
            <span className="text-sm">Allow cancellation</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cancellation Window (hours)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.cancellationWindowHours} onChange={(e) => setFormData({ ...formData, cancellationWindowHours: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Minimum Order (BDT)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.minimumOrderAmount} onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Order Prefix</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.orderPrefix} onChange={(e) => setFormData({ ...formData, orderPrefix: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Settings</button>
      </div>
    </form>
  );
}
