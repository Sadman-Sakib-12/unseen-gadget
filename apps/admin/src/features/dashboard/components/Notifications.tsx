'use client';

import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { notifications } from '@/features/dashboard/data';
import { cn } from '@/components/ui/utils';

const NOTIFICATION_TONES: Record<string, string> = {
  ORDER: 'bg-blue-50 text-blue-700',
  ALERT: 'bg-red-50 text-red-700',
  PAYMENT: 'bg-emerald-50 text-emerald-700',
  CUSTOMER: 'bg-gray-100 text-gray-700',
  SHIPPING: 'bg-amber-50 text-amber-700',
  RETURN: 'bg-gray-100 text-gray-700',
};

export function Notifications() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Notifications</CardTitle>
        {unread > 0 ? (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            {unread} unread
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You are all caught up."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60',
                  !notification.read && 'bg-blue-50/40'
                )}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    {!notification.read ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    ) : null}
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                </div>
                <Badge
                  className={cn(
                    'shrink-0',
                    NOTIFICATION_TONES[notification.type] ?? 'bg-gray-100 text-gray-700'
                  )}
                >
                  {notification.type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}