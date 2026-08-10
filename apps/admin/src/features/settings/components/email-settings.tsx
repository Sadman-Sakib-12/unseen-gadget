"use client";
import { EmailSettings } from "@/features/settings/types";
import { useState } from "react";

interface EmailSettingsProps {
  settings: EmailSettings;
  onSave: (settings: EmailSettings) => void;
}

export function EmailSettingsComponent({ settings, onSave }: EmailSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">Email Settings</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">SMTP Host</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.smtpHost} onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SMTP Port</label>
          <input type="number" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.smtpPort} onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SMTP User</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.smtpUser} onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sender Email</label>
          <input type="email" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.senderEmail} onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.sendOrderConfirmation} onChange={(e) => setFormData({ ...formData, sendOrderConfirmation: e.target.checked })} />
            <span className="text-sm">Send order confirmation emails</span>
          </label>
        </div>
        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.sendShippingUpdate} onChange={(e) => setFormData({ ...formData, sendShippingUpdate: e.target.checked })} />
            <span className="text-sm">Send shipping update emails</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Settings</button>
      </div>
    </form>
  );
}
