'use client';

import { HandCoins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT, formatDate } from '@/lib/format';
import type { SupplierDue } from '@/features/dashboard/types';

interface OutstandingSupplierDueProps {
  className?: string;
  data: SupplierDue[];
}

export function OutstandingSupplierDue({ className, data }: OutstandingSupplierDueProps) {
  const outstanding = data.filter((due) => due.status !== 'PAID');
  const totalDue = outstanding.reduce((sum, due) => sum + due.amount, 0);

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Supplier Dues</CardTitle>
        <Badge variant="warning">{formatBDT(totalDue)}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        {outstanding.length === 0 ? (
          <EmptyState
            icon={HandCoins}
            title="No supplier dues"
            description="Outstanding payments to suppliers will appear here."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {outstanding.map((due, index) => (
              <div
                key={`${due.id}-${index}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {due.supplierName}
                  </p>
                  <p className="text-xs text-gray-500">Due: {formatDate(due.dueDate)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatBDT(due.amount)}
                  </p>
                  <StatusBadge status={due.status} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
