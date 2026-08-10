"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { NotificationsList } from "@/features/notifications/components/notifications-list";
import { NotificationForm } from "@/features/notifications/components/notification-form";
import initialNotifications from "@/features/notifications/data/notifications.json";
import { Notification } from "@/features/notifications/types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-gray-500">System notifications and alerts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={16} />
          Send Notification
        </button>
      </div>
      {showForm && (
        <NotificationForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      <NotificationsList data={notifications} />
    </div>
  );
}
