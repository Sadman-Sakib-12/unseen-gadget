'use client';

import { Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProductPricingCardProps {
  price: number | '';
  setPrice: (v: number | '') => void;
  originalPrice: number | '';
  setOriginalPrice: (v: number | '') => void;
  discount: number | '';
  setDiscount: (v: number | '') => void;
}

export function ProductPricingCard({
  price,
  setPrice,
  originalPrice,
  setOriginalPrice,
  discount,
  setDiscount,
}: ProductPricingCardProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
          <Tag className="h-4 w-4 text-primary" />
          Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Regular Price (BDT ৳) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="e.g. 150000"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Original Price (৳)</label>
            <Input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 165000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Discount (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 10"
            />
          </div>
        </div>

        {typeof price === 'number' && price > 0 && (
          <div className="rounded-lg bg-primary/5 p-3 border border-primary/15 text-xs">
            <div className="flex justify-between font-medium text-gray-700">
              <span>Storefront Display:</span>
              <span className="font-bold text-primary">৳{price.toLocaleString()}</span>
            </div>
            {typeof originalPrice === 'number' && originalPrice > price && (
              <div className="flex justify-between text-gray-500 mt-1 text-[11px]">
                <span>Strike-through:</span>
                <span className="line-through">৳{originalPrice.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
