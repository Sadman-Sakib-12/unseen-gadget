'use client';

import { ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { recentOrders } from '@/features/dashboard/data';
import { formatBDT } from '@/lib/load-dashboard-data';

interface RecentOrdersProps {
  className?: string;
}

export function RecentOrders({ className }: RecentOrdersProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Orders</CardTitle>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {recentOrders.length} total
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {recentOrders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No recent orders"
            description="Orders will show up here as they are placed."
          />
        ) : (
          <div className="divide-y divide-gray-100">
          {recentOrders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {order.customerName}
                </p>
                <p className="truncate text-xs text-gray-500">{order.product}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {order.id} · {order.date}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatBDT(order.amount)}
                </p>
                <StatusBadge status={order.status} className="mt-1" />
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
}