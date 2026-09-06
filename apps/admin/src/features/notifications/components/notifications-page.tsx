"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, MessageSquareText, TriangleAlert, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { NotificationsList } from "./notifications-list";
import { NotificationForm } from "./notification-form";
import { api, apiRequest } from "@/lib/api";
import type { Notification } from "@/features/notifications/types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

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
        console.error("Failed to fetch notifications:", e);
      }
    };
    void fetchNotifications();
  }, []);

  const handleSave = (notification: Notification) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === notification.id);
      if (exists) {
        return prev.map((n) => (n.id === notification.id ? notification : n));
      }
      return [notification, ...prev];
    });
    setEditingNotification(null);
    setShowForm(false);
    toast.success(editingNotification ? "Notification updated" : "Notification sent");
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
      toast.success("All notifications marked as read");
    } catch (e) {
      console.error("Failed to mark all notifications read:", e);
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.notifications.delete(id);
      toast.success("Notification deleted");
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    setConfirmClearAll(false);
    try {
      await api.notifications.clearAll();
      toast.success("All notifications cleared");
    } catch (e: any) {
      toast.error(e?.message || "Failed to clear notifications");
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
          <Button
            onClick={() => {
              setEditingNotification(null);
              setShowForm(true);
            }}
          >
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

      <NotificationsList
        data={notifications}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onEdit={(n) => {
          setEditingNotification(n);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onClearAll={() => setConfirmClearAll(true)}
      />

      {/* Send / Edit Notification Form */}
      <NotificationForm
        isOpen={showForm}
        initialData={editingNotification}
        onClose={() => {
          setShowForm(false);
          setEditingNotification(null);
        }}
        onSave={handleSave}
      />

      {/* Clear All Confirmation */}
      <ConfirmDialog
        open={confirmClearAll}
        onOpenChange={(open) => !open && setConfirmClearAll(false)}
        title="Clear All Notifications?"
        description="Are you sure you want to permanently delete all notifications? This action cannot be undone."
        confirmLabel="Clear All"
        destructive
        onConfirm={() => void handleClearAll()}
      />
    </div>
  );
}