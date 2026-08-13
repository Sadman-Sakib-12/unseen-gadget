"use client";
import { useState } from "react";
import { Bell, BellRing, MessageSquareText, TriangleAlert } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { NotificationsList } from "./notifications-list";
import { NotificationForm } from "./notification-form";
import initialNotifications from "@/features/notifications/data/notifications.json";
import type { Notification } from "@/features/notifications/types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
    setShowForm(false);
  };

  const unread = notifications.filter((n) => !n.read).length;
  const orders = notifications.filter((n) => n.type === "order").length;
  const alerts = notifications.filter((n) => n.type === "alert").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="System notifications and alerts"
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Send Notification
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total"
          value={notifications.length}
          icon={Bell}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Unread"
          value={unread}
          icon={BellRing}
          iconClassName="bg-orange-50 text-orange-700"
        />
        <StatCard
          title="Orders"
          value={orders}
          icon={MessageSquareText}
          iconClassName="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Alerts"
          value={alerts}
          icon={TriangleAlert}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      <NotificationsList data={notifications} />

      <NotificationForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} />
    </div>
  );
}