'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT } from '@/lib/load-dashboard-data';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/components/ui/utils';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onView: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  const stockTone =
    product.stock === 0
      ? 'text-red-600'
      : product.stock < 10
      ? 'text-amber-600'
      : 'text-gray-600';

  const stockLabel =
    product.stock === 0
      ? 'Out of stock'
      : product.stock < 10
      ? 'Low stock'
      : `${product.stock} in stock`;

  return (
    <Card className="group flex flex-col overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
          }}
        />
        {product.discount > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            −{product.discount}% OFF
          </span>
        ) : null}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:bg-white"
            onClick={() => onView(product)}
            aria-label={`View ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:bg-white"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/95 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(product.id)}
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">{product.brand}</p>
          </div>
          <StatusBadge status={product.status} className="shrink-0" />
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            {formatBDT(product.price)}
          </span>
          {product.discount > 0 ? (
            <span className="text-xs text-gray-400 line-through">
              {formatBDT(product.price + (product.price * product.discount) / 100)}
            </span>
          ) : null}
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className={cn('font-medium', stockTone)}>{stockLabel}</span>
          <span className="text-gray-400">{product.sku}</span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <Badge variant="secondary">{product.category}</Badge>
          <span className="text-xs text-gray-400">SKU: {product.sku}</span>
        </div>
      </div>
    </Card>
  );
}