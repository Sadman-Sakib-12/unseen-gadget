'use client';

import * as React from 'react';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Product, ProductVariant, Category } from '../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (product: Partial<Product>) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function ProductForm({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    category: product?.category ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    discount: product?.discount ?? 0,
    sku: product?.sku ?? '',
    barcode: product?.barcode ?? '',
    stock: product?.stock ?? 0,
    warranty: product?.warranty ?? '',
    status: (product?.status ?? 'ACTIVE') as Product['status'],
  });

  const [specifications, setSpecifications] = useState<Record<string, string | undefined>>(
    product?.specifications ?? {}
  );
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants ?? []);
  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [variantStock, setVariantStock] = useState('');
  const [variantSku, setVariantSku] = useState('');

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ ...formData, specifications, variants });
  };

  const addSpecification = () => {
    const key = specKey.trim();
    const value = specValue.trim();
    if (key && value) {
      setSpecifications((prev) => ({ ...prev, [key]: value }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setSpecifications((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const addVariant = () => {
    const name = variantName.trim();
    const price = Number(variantPrice);
    const stock = Number(variantStock);
    const sku = variantSku.trim();
    if (name && price > 0 && stock >= 0 && sku) {
      setVariants((prev) => [
        ...prev,
        { id: `v-${prev.length + 1}-${Date.now()}`, name, price, stock, sku },
      ]);
      setVariantName('');
      setVariantPrice('');
      setVariantStock('');
      setVariantSku('');
    }
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogDescription>
          {product
            ? `Update the details for ${product.name}.`
            : 'Create a new product to add to your catalog.'}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product name">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. iPhone 16 Pro Max"
                required
              />
            </Field>
            <Field label="Brand">
              <Input
                type="text"
                value={formData.brand}
                onChange={(e) => update({ brand: e.target.value })}
                placeholder="e.g. Apple"
                required
              />
            </Field>
            <Field label="Category">
              <Select
                value={formData.category}
                onChange={(e) => update({ category: e.target.value })}
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
                ]}
                required
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) => update({ status: e.target.value as Product['status'] })}
                options={[
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                  { value: 'OUT_OF_STOCK', label: 'Out of stock' },
                ]}
              />
            </Field>
            <Field label="Price (BDT)">
              <Input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => update({ price: Number(e.target.value) })}
                required
              />
            </Field>
            <Field label="Discount (%)">
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => update({ discount: Number(e.target.value) })}
              />
            </Field>
            <Field label="SKU">
              <Input
                type="text"
                value={formData.sku}
                onChange={(e) => update({ sku: e.target.value })}
                placeholder="e.g. SP-001"
                required
              />
            </Field>
            <Field label="Barcode">
              <Input
                type="text"
                value={formData.barcode}
                onChange={(e) => update({ barcode: e.target.value })}
                placeholder="e.g. 8901234567890"
                required
              />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => update({ stock: Number(e.target.value) })}
                required
              />
            </Field>
            <Field label="Warranty">
              <Input
                type="text"
                value={formData.warranty}
                onChange={(e) => update({ warranty: e.target.value })}
                placeholder="e.g. 1 Year"
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={3}
              placeholder="Short product description"
            />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">Specifications</h4>
            </div>
            {Object.keys(specifications).length === 0 ? (
              <p className="text-sm text-gray-500">No specifications added yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2"
                  >
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{key}:</span> {value}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeSpecification(key)}
                      aria-label={`Remove specification ${key}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
              <Input
                type="text"
                placeholder="Key (e.g. Display)"
                className="min-w-0"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Value (e.g. 6.1 inch)"
                className="min-w-0"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSpecification}
                aria-label="Add specification"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">Variants</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                disabled={!variantName || !variantPrice || !variantSku}
              >
                <Plus className="h-4 w-4" />
                Add variant
              </Button>
            </div>
            {variants.length === 0 ? (
              <p className="text-sm text-gray-500">
                No variants. Add options like size or storage to this product.
              </p>
            ) : (
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2"
                  >
                    <div className="min-w-0 text-sm text-gray-700">
                      <p className="truncate">
                        <span className="font-medium">{variant.name}</span>
                        <span className="text-gray-500">
                          {' '}
                          · {formatVariantPrice(variant.price)} · Stock: {variant.stock} · SKU:{' '}
                          {variant.sku}
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeVariant(variant.id)}
                      aria-label={`Remove variant ${variant.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
              <Input
                type="text"
                placeholder="Variant name"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="sm:col-span-2 xl:col-span-1"
              />
              <Input
                type="number"
                placeholder="Price"
                min="0"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Stock"
                min="0"
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
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="product-form">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function formatVariantPrice(price: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(price);
}