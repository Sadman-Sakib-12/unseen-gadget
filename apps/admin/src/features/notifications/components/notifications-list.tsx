"use client";
import { useState } from "react";
import {
  Bell,
  Check,
  Package,
  DollarSign,
  Truck,
  User,
  AlertTriangle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
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

export function NotificationsList({ data }: { data: Notification[] }) {
  const [filter, setFilter] = useState<string>("all");
  const filtered = data.filter((n) => filter === "all" || n.type === filter);
  const unreadCount = data.filter((n) => !n.read).length;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </div>
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

      <div className="space-y-2 p-4">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No notifications found.</p>
        ) : (
          filtered.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                  notification.read ? "border-gray-100 bg-white" : "border-blue-200 bg-blue-50"
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.time).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-700"
                    aria-label={`Mark ${notification.title} as read`}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}