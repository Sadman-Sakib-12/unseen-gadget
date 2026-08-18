'use client';

import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { topSellingProducts } from '@/features/dashboard/data';
import { formatBDT } from '@/lib/load-dashboard-data';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/images';

interface TopSellingProductsProps {
  className?: string;
}

export function TopSellingProducts({ className }: TopSellingProductsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Top Selling Products</CardTitle>
        <Badge variant="secondary">By units sold</Badge>
      </CardHeader>
      <CardContent className="p-0">
        {topSellingProducts.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No sales yet"
            description="Best-selling products will appear here once orders come in."
          />
        ) : (
          <div className="divide-y divide-gray-100">
          {topSellingProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/60"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {formatBDT(product.price)}
                </p>
                <p className="text-xs text-gray-500">
                  {product.sold} sold · {product.stock} in stock
                </p>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
}