'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import type { Notification } from '@/features/dashboard/types';

const NOTIFICATION_TYPES: Record<string, { label: string; className: string }> = {
  ORDER: { label: 'Order', className: 'bg-blue-50 text-blue-700' },
  ALERT: { label: 'Alert', className: 'bg-red-50 text-red-700' },
  PAYMENT: { label: 'Payment', className: 'bg-emerald-50 text-emerald-700' },
  CUSTOMER: { label: 'Customer', className: 'bg-gray-100 text-gray-700' },
  SHIPPING: { label: 'Shipping', className: 'bg-amber-50 text-amber-700' },
  RETURN: { label: 'Return', className: 'bg-gray-100 text-gray-700' },
};

interface NotificationsProps {
  data: Notification[];
}

export function Notifications({ data }: NotificationsProps) {
  const [prevData, setPrevData] = useState(data);
  const [items, setItems] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    setItems(data);
  }

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Notifications</CardTitle>
        <div className="flex items-center gap-2">
          {unread > 0 ? (
            <Badge variant="default">{unread} unread</Badge>
          ) : null}
          {unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Mark all read
            </button>
          ) : null}
          <Link
            href="/notifications"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You are all caught up."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((notification, index) => {
              const type = NOTIFICATION_TYPES[notification.type] ?? {
                label: notification.type,
                className: 'bg-gray-100 text-gray-700',
              };
              return (
                <div
                  key={`${notification.id ?? 'notif'}-${index}`}
                  className={cn(
                    'flex items-start justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50',
                    !notification.read && 'bg-blue-50/40 hover:bg-blue-50/70'
                  )}
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      {!notification.read ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      ) : null}
                      <span className="truncate">{notification.title}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                  </div>
                  <Badge className={cn('shrink-0', type.className)}>{type.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
