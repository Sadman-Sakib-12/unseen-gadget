"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/features/dashboard/data";
import { getStatusBadgeVariant } from "@/lib/load-dashboard-data";

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-2">
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-black" />}
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400">{notification.time}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(notification.type) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>{notification.type}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
