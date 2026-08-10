"use client";

import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBDT } from "@/lib/load-dashboard-data";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const statusVariant = {
    ACTIVE: "success" as const,
    INACTIVE: "secondary" as const,
    OUT_OF_STOCK: "destructive" as const,
  }[product.status];

  return (
    <Card className="group relative">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="aspect-square w-full rounded-lg bg-gray-100 mb-3 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(product)}
                className="rounded p-1.5 bg-white border border-gray-200 hover:bg-gray-50"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="rounded p-1.5 bg-white border border-gray-200 hover:bg-red-50 text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
        <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
        <p className="text-xs text-gray-500">{product.brand}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold">{formatBDT(product.price)}</span>
          <Badge variant={statusVariant} className="text-[10px]">
            {product.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Stock: {product.stock}</span>
          {product.discount > 0 && (
            <span className="text-red-600 text-xs">-{product.discount}%</span>
          )}
        </div>
        <div className="mt-2">
          <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
