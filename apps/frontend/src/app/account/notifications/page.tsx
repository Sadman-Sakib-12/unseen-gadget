"use client";

import { useState } from "react";
import { Bell, Package, Tag, Truck, CheckCheck, Circle } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import { useTranslation } from "@/hooks/use-translation";

interface Notification {
  id: number;
  kind: "orderUpdate" | "offer" | "delivery" | "approved";
  titleKey: TranslationKey;
  date: string;
  read: boolean;
}

const initialNotifications: Notification[] = [];

const kindMeta: Record<Notification["kind"], { icon: typeof Package; className: string }> = {
  orderUpdate: { icon: Package, className: "bg-primary/10 text-primary" },
  offer: { icon: Tag, className: "bg-warning/10 text-warning" },
  delivery: { icon: Truck, className: "bg-primary/10 text-primary" },
  approved: { icon: CheckCheck, className: "bg-success/10 text-success" },
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">{t("notifications.title")}</h1>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-medium text-primary transition-colors hover:underline"
          >
            {t("notifications.markAllRead")}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
          <Bell className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">{t("notifications.empty")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("notifications.emptyHint")}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notification) => {
            const meta = kindMeta[notification.kind];
            return (
              <button
                key={notification.id}
                onClick={() => toggleRead(notification.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent/50 ${
                  notification.read ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.className}`}
                >
                  <meta.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {t(notification.titleKey)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{notification.date}</p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    notification.read
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {notification.read ? (
                    <>
                      <CheckCheck className="h-3 w-3" />
                      {t("notifications.read")}
                    </>
                  ) : (
                    <>
                      <Circle className="h-2 w-2 fill-current" />
                      {t("notifications.unread")}
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
