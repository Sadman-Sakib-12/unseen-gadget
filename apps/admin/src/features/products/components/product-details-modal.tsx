'use client';

import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatBDT } from '@/lib/load-dashboard-data';
import { PRODUCT_IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/components/ui/utils';
import type { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export function ProductDetailsModal({
  product,
  onClose,
  onEdit,
}: ProductDetailsModalProps) {
  const stockTone =
    !product
      ? ''
      : product.stock === 0
      ? 'text-red-600'
      : product.stock < 10
      ? 'text-amber-600'
      : 'text-emerald-600';

  return (
    <Dialog open={product !== null} onOpenChange={onClose}>
      {product ? (
        <>
          <DialogHeader close className="gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="line-clamp-2 text-xl">
                  {product.name}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                  <StatusBadge status={product.status} />
                </div>
              </div>
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
                  }}
                />
              </div>
            </div>
          </DialogHeader>

          <DialogContent>
            <div className="space-y-6">
              {product.description ? (
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              ) : null}

              <section>
                <h4 className="text-sm font-semibold text-gray-900">Pricing</h4>
                <dl className="mt-2 divide-y divide-gray-100 border-t border-gray-100">
                  <DetailRow
                    label="Selling price"
                    value={
                      <span>
                        {formatBDT(product.price)}
                        {product.discount > 0 ? (
                          <span className="ml-1.5 text-xs font-semibold text-red-600">
                            −{product.discount}%
                          </span>
                        ) : null}
                      </span>
                    }
                  />
                  <DetailRow label="Original price" value={formatBDT(product.price + (product.price * product.discount) / 100)} />
                </dl>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-900">Inventory</h4>
                <dl className="mt-2 divide-y divide-gray-100 border-t border-gray-100">
                  <DetailRow label="Stock" value={<span className={cn('font-semibold', stockTone)}>{product.stock} units</span>} />
                  <DetailRow label="SKU" value={product.sku} />
                  <DetailRow label="Barcode" value={product.barcode} />
                  <DetailRow label="Warranty" value={product.warranty || '—'} />
                </dl>
              </section>

              <section>
                <h4 className="text-sm font-semibold text-gray-900">Classification</h4>
                <dl className="mt-2 divide-y divide-gray-100 border-t border-gray-100">
                  <DetailRow label="Category" value={<Badge variant="secondary">{product.category}</Badge>} />
                  <DetailRow label="Brand" value={product.brand} />
                </dl>
              </section>

              {Object.keys(product.specifications).length > 0 ? (
                <section>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Specifications
                  </h4>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-md border border-gray-200 px-3 py-2"
                      >
                        <p className="text-xs text-gray-500">{key}</p>
                        <p className="mt-0.5 text-sm font-medium text-gray-900">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {product.variants.length > 0 ? (
                <section>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Variants ({product.variants.length})
                  </h4>
                  <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/60">
                        <tr className="border-b border-gray-100">
                          <th className="px-3 py-2 text-left font-medium text-gray-500">Variant</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-500">Price</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-500">Stock</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">SKU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((variant) => (
                          <tr key={variant.id} className="border-b border-gray-100 last:border-0">
                            <td className="px-3 py-2 font-medium text-gray-900">{variant.name}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-gray-700">{formatBDT(variant.price)}</td>
                            <td className="px-3 py-2 text-right tabular-nums text-gray-700">{variant.stock}</td>
                            <td className="px-3 py-2 text-gray-500">{variant.sku}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </div>
          </DialogContent>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(product)}>Edit product</Button>
          </DialogFooter>
        </>
      ) : null}
    </Dialog>
  );
}