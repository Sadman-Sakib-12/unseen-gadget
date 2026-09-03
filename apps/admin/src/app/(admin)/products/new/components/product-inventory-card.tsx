'use client';

import { Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductInventoryCardProps {
  stock: number | '';
  setStock: (v: number | '') => void;
  sku: string;
  setSku: (v: string) => void;
  barcode: string;
  setBarcode: (v: string) => void;
}

export function ProductInventoryCard({
  stock,
  setStock,
  sku,
  setSku,
  barcode,
  setBarcode,
}: ProductInventoryCardProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
          <Package className="h-4 w-4 text-primary" />
          Inventory & Stock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Stock Quantity (Units) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 25"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">SKU</label>
          <Input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. APP-IP16PM-256"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Barcode</label>
          <Input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="e.g. 195949000111"
          />
        </div>
      </CardContent>
    </Card>
  );
}
