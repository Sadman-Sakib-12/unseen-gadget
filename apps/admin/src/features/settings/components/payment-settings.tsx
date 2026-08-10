"use client";
import { PaymentSettings } from "@/features/settings/types";
import { useState } from "react";

interface PaymentSettingsProps {
  settings: PaymentSettings;
  onSave: (settings: PaymentSettings) => void;
}

export function PaymentSettingsComponent({ settings, onSave }: PaymentSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">Payment Settings</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.acceptCashOnDelivery} onChange={(e) => setFormData({ ...formData, acceptCashOnDelivery: e.target.checked })} />
            <span className="text-sm">Accept Cash on Delivery</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.acceptCardPayments} onChange={(e) => setFormData({ ...formData, acceptCardPayments: e.target.checked })} />
            <span className="text-sm">Accept Card Payments</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.acceptBankTransfer} onChange={(e) => setFormData({ ...formData, acceptBankTransfer: e.target.checked })} />
            <span className="text-sm">Accept Bank Transfer</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.acceptMobileBanking} onChange={(e) => setFormData({ ...formData, acceptMobileBanking: e.target.checked })} />
            <span className="text-sm">Accept Mobile Banking</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.taxRate} onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })} />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.taxIncluded} onChange={(e) => setFormData({ ...formData, taxIncluded: e.target.checked })} />
            <span className="text-sm">Tax included in price</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Settings</button>
      </div>
    </form>
  );
}
