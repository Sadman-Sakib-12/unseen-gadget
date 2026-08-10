"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { lowStockProducts } from "@/features/dashboard/data";
import { getStatusBadgeVariant } from "@/lib/load-dashboard-data";

interface LowStockProductsProps {
  className?: string;
}

export function LowStockProducts({ className }: LowStockProductsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Low Stock Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{product.stock} / {product.minStock}</p>
                <Badge variant={getStatusBadgeVariant(product.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>{product.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
