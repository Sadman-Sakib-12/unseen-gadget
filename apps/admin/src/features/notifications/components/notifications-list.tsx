"use client";
import { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  DollarSign,
  Truck,
  User,
  AlertTriangle,
  Settings,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/components/ui/utils";
import type { Notification } from "@/features/notifications/types";

const typeIcons: Record<string, LucideIcon> = {
  order: Package,
  payment: DollarSign,
  shipping: Truck,
  customer: User,
  alert: AlertTriangle,
  system: Settings,
  return: Package,
};

interface NotificationsListProps {
  data: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onEdit?: (notification: Notification) => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
}

export function NotificationsList({
  data,
  onMarkRead,
  onMarkAllRead,
  onEdit,
  onDelete,
  onClearAll,
}: NotificationsListProps) {
  const [filter, setFilter] = useState<string>("all");
  const filtered = data.filter((n) => filter === "all" || n.type === filter);
  const unreadCount = data.filter((n) => !n.read).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0 gap-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-500" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && onMarkAllRead ? (
            <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          ) : null}

          {data.length > 0 && onClearAll ? (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onClearAll}
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          ) : null}

          <Select
            className="w-full sm:w-48"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "all", label: "All" },
              { value: "order", label: "Orders" },
              { value: "payment", label: "Payments" },
              { value: "shipping", label: "Shipping" },
              { value: "alert", label: "Alerts" },
              { value: "system", label: "System" },
            ]}
          />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications found"
            description="Try a different filter to find what you are looking for."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((notification) => {
              const Icon = typeIcons[notification.type] || Bell;
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                    notification.read ? "border-gray-100 bg-white" : "border-blue-200 bg-blue-50/50"
                  )}
                >
                  <div className="mt-0.5">
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        notification.read ? "text-gray-400" : "text-blue-600"
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatDateTime(notification.time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.read && onMarkRead ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800"
                        aria-label={`Mark ${notification.title} as read`}
                        title="Mark as read"
                        onClick={() => onMarkRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : null}

                    {onEdit ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-700"
                        aria-label={`Edit ${notification.title}`}
                        title="Edit notification"
                        onClick={() => onEdit(notification)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    ) : null}

                    {onDelete ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                        aria-label={`Delete ${notification.title}`}
                        title="Delete notification"
                        onClick={() => onDelete(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}