"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topSellingProducts } from "@/features/dashboard/data";

interface TopSellingProductsProps {
  className?: string;
}

export function TopSellingProducts({ className }: TopSellingProductsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSellingProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(product.price)}</p>
                <p className="text-xs text-gray-500">Stock: {product.stock} | Sold: {product.sold}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
