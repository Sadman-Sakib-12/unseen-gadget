'use client';

import { useRef, useState } from 'react';
import { Plus, X, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApiClient } from '@/lib/api';
import { toast } from 'sonner';
import type { ProductVariant } from '../types';

interface ProductVariantsSectionProps {
  variants: ProductVariant[];
  variantName: string;
  setVariantName: (val: string) => void;
  variantPrice: string;
  setVariantPrice: (val: string) => void;
  variantStock: string;
  setVariantStock: (val: string) => void;
  variantSku: string;
  setVariantSku: (val: string) => void;
  variantImage?: string;
  setVariantImage?: (val: string) => void;
  onAddVariant: () => void;
  onRemoveVariant: (id: string) => void;
  formatPrice: (price: number) => string;
}

export function ProductVariantsSection({
  variants,
  variantName,
  setVariantName,
  variantPrice,
  setVariantPrice,
  variantStock,
  setVariantStock,
  variantSku,
  setVariantSku,
  variantImage = '',
  setVariantImage,
  onAddVariant,
  onRemoveVariant,
  formatPrice,
}: ProductVariantsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !setVariantImage) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await adminApiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url || res.data?.data?.url;
      if (url) {
        setVariantImage(url);
        toast.success('Variant image uploaded!');
      } else {
        toast.error('Upload succeeded but no URL returned');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Variants</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddVariant}
          disabled={!variantName.trim() || !variantPrice || !variantSku.trim()}
        >
          <Plus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <p className="text-xs text-gray-500">
          No variants added. Add color, storage, or size options with custom images, price, and stock.
        </p>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50/70 p-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {variant.images && variant.images[0] ? (
                  <img
                    src={variant.images[0]}
                    alt={variant.name}
                    className="h-10 w-10 shrink-0 rounded-md object-contain border border-gray-200 bg-white p-0.5"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0 text-xs">
                  <p className="font-semibold text-gray-900 truncate">{variant.name}</p>
                  <p className="text-gray-500">
                    {formatPrice(variant.price)} · Stock: {variant.stock} · SKU: {variant.sku}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onRemoveVariant(variant.id)}
                aria-label={`Remove variant ${variant.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* New Variant Input Form */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-3.5 space-y-3">
        <p className="text-xs font-semibold text-gray-700">Add New Variant Details</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            type="text"
            placeholder="Variant Name (e.g. 256GB Desert Titanium)"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
          />
          <Input
            type="number"
            min="0"
            placeholder="Price (BDT ৳)"
            value={variantPrice}
            onChange={(e) => setVariantPrice(e.target.value)}
          />
          <Input
            type="number"
            min="0"
            placeholder="Stock Quantity"
            value={variantStock}
            onChange={(e) => setVariantStock(e.target.value)}
          />
          <Input
            type="text"
            placeholder="SKU"
            value={variantSku}
            onChange={(e) => setVariantSku(e.target.value)}
          />
        </div>

        {/* Variant Image Selector */}
        {setVariantImage && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {variantImage ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                <img
                  src={variantImage}
                  alt="Variant preview"
                  className="h-full w-full object-contain p-0.5"
                />
                <button
                  type="button"
                  onClick={() => setVariantImage('')}
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-bl bg-red-600 text-white"
                  title="Remove image"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ) : null}

            <Input
              className="flex-1 min-w-[200px] h-9 text-xs"
              placeholder="Variant Image URL (or upload from PC)"
              value={variantImage}
              onChange={(e) => setVariantImage(e.target.value)}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-1 h-3.5 w-3.5" />
                  Upload Image
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
