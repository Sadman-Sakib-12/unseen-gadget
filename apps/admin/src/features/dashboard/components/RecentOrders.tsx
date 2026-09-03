'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT, formatShortDate } from '@/lib/format';
import type { RecentOrder } from '@/features/dashboard/types';

interface RecentOrdersProps {
  className?: string;
  data: RecentOrder[];
}

export function RecentOrders({ className, data }: RecentOrdersProps) {
  const latest = data.slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Orders</CardTitle>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {latest.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No recent orders"
            description="Orders will show up here as they are placed."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {latest.map((order, index) => (
              <div
                key={`${order.id}-${index}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <p className="truncate text-xs text-gray-500">{order.product}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {order.id} · {formatShortDate(order.date)}
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
