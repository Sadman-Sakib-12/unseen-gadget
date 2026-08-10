"use client";
import { useState } from "react";
import { GeneralSettings } from "@/features/settings/types";

interface GeneralSettingsProps {
  settings: GeneralSettings;
  onSave: (settings: GeneralSettings) => void;
}

export function GeneralSettingsComponent({ settings, onSave }: GeneralSettingsProps) {
  const [formData, setFormData] = useState(settings);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">General Settings</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.storeName} onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Store Email</label>
          <input type="email" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.storeEmail} onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.storePhone} onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
            <option value="BDT">BDT</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timezone</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}>
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
            <option value="en">English</option>
            <option value="bn">Bengali</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={2} value={formData.storeAddress} onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Settings</button>
      </div>
    </form>
  );
}
