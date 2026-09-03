"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, MessageSquareText, TriangleAlert, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { NotificationsList } from "./notifications-list";
import { NotificationForm } from "./notification-form";
import { apiRequest } from "@/lib/api";
import type { Notification } from "@/features/notifications/types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiRequest("/admin/notifications", {
          credentials: "include",
        });
        if (res.success && res.data) {
          setNotifications(res.data as Notification[]);
        }
      } catch (e: unknown) {
        // Admin-only endpoint may fail for non-admin users
        console.error("Failed to fetch notifications:", e);
      }
    };
    fetchNotifications();
  }, []);

  const handleSave = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setShowForm(false);
  };

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await apiRequest(`/admin/notifications/${id}/read`, { method: "PATCH" });
    } catch (e) {
      console.error("Failed to mark notification read:", e);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiRequest("/admin/notifications/read-all", { method: "PATCH" });
    } catch (e) {
      console.error("Failed to mark all notifications read:", e);
    }
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

      <NotificationsList data={notifications} onMarkRead={markRead} onMarkAllRead={markAllRead} />

      <NotificationForm isOpen={showForm} onClose={() => setShowForm(false)} onSave={handleSave} />
    </div>
  );
}