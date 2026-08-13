'use client';

import { HandCoins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { supplierDues } from '@/features/dashboard/data';
import { formatBDT } from '@/lib/load-dashboard-data';

interface OutstandingSupplierDueProps {
  className?: string;
}

export function OutstandingSupplierDue({ className }: OutstandingSupplierDueProps) {
  const totalDue = supplierDues
    .filter((due) => due.status !== 'PAID')
    .reduce((sum, due) => sum + due.amount, 0);

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Supplier Dues</CardTitle>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {formatBDT(totalDue)}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {supplierDues.length === 0 ? (
          <EmptyState
            icon={HandCoins}
            title="No supplier dues"
            description="Outstanding payments to suppliers will appear here."
          />
        ) : (
          <div className="divide-y divide-gray-100">
          {supplierDues.map((due) => (
            <div
              key={due.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {due.supplierName}
                </p>
                <p className="text-xs text-gray-500">Due: {due.dueDate}</p>
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