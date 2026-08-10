"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentOrders } from "@/features/dashboard/data";
import { getStatusBadgeVariant } from "@/lib/load-dashboard-data";

interface RecentOrdersProps {
  className?: string;
}

export function RecentOrders({ className }: RecentOrdersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{order.customerName}</p>
                <p className="text-xs text-gray-500">{order.product}</p>
                <p className="text-xs text-gray-400">{order.id} - {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(order.amount)}</p>
                <Badge variant={getStatusBadgeVariant(order.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>{order.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
