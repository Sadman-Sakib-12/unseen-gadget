'use client';

import { PackageSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { lowStockProducts } from '@/features/dashboard/data';
import { cn } from '@/components/ui/utils';

interface LowStockProductsProps {
  className?: string;
}

export function LowStockProducts({ className }: LowStockProductsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Low Stock Products</CardTitle>
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          {lowStockProducts.length} alerts
        </span>
      </CardHeader>
      <CardContent className="p-0">
        {lowStockProducts.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="All stock healthy"
            description="No products are running low right now."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-gray-900">
                    <span
                      className={cn(
                        product.status === 'CRITICAL' && 'text-red-600'
                      )}
                    >
                      {product.stock}
                    </span>{' '}
                    / {product.minStock}
                  </p>
                  <StatusBadge status={product.status} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}