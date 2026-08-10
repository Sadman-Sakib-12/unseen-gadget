"use client";
import { useState } from "react";
import { Notification } from "@/features/notifications/types";

interface NotificationFormProps {
  onSave: (notification: Notification) => void;
  onCancel: () => void;
}

export function NotificationForm({ onSave, onCancel }: NotificationFormProps) {
  const [formData, setFormData] = useState({
    id: "NOTIF-" + String(Date.now()).slice(-3),
    title: "",
    message: "",
    type: "system" as any,
    time: new Date().toISOString(),
    read: false,
    actionUrl: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Notification);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">Send Notification</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}>
            <option value="order">Order</option>
            <option value="payment">Payment</option>
            <option value="shipping">Shipping</option>
            <option value="alert">Alert</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Send Notification</button>
      </div>
    </form>
  );
}
