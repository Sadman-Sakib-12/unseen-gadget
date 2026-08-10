"use client";
import { useState } from "react";
import { Bell, Check, Package, DollarSign, Truck, User, AlertTriangle, Settings } from "lucide-react";
import { Notification } from "@/features/notifications/types";

const typeIcons: Record<string, any> = {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={20} />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{unreadCount}</span>
          )}
        </div>
        <select
          className="rounded-md border border-gray-200 px-3 py-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="order">Orders</option>
          <option value="payment">Payments</option>
          <option value="shipping">Shipping</option>
          <option value="alert">Alerts</option>
          <option value="system">System</option>
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map((notification) => {
          const Icon = typeIcons[notification.type] || Bell;
          return (
            <div
              key={notification.id}
              className={"flex items-start gap-3 rounded-lg border border-gray-200 p-4 " + (notification.read ? "bg-white" : "bg-blue-50")}
            >
              <div className="mt-0.5">
                <Icon size={18} className={notification.read ? "text-gray-400" : "text-blue-500"} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notification.time).toLocaleString()}</p>
              </div>
              {!notification.read && (
                <button className="text-gray-400 hover:text-gray-600">
                  <Check size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
