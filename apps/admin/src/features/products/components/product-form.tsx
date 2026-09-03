'use client';

import * as React from 'react';
import { useState } from 'react';
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
import { ProductShippingSection } from './product-shipping-section';
import { ProductSpecsSection } from './product-specs-section';
import { ProductVariantsSection } from './product-variants-section';

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
    shippingType: (product?.shippingType ?? 'FREE') as 'FREE' | 'PAID',
    shippingCost: product?.shippingCost ?? 0,
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
  const [variantImage, setVariantImage] = useState('');

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
        {
          id: `v-${prev.length + 1}-${Date.now()}`,
          name,
          price,
          stock,
          sku,
          images: variantImage.trim() ? [variantImage.trim()] : [],
        },
      ]);
      setVariantName('');
      setVariantPrice('');
      setVariantStock('');
      setVariantSku('');
      setVariantImage('');
    }
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const formatVariantPrice = (price: number): string => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price);
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
        <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Product name">
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
              />
            </Field>
            <Field label="Brand">
              <Input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => update({ brand: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <Select
                value={formData.category}
                onChange={(e) => update({ category: e.target.value })}
                options={categories.map((c) => ({ value: c.name, label: c.name }))}
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) => update({ status: e.target.value as Product['status'] })}
                options={[
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
                ]}
              />
            </Field>
            <Field label="Price (BDT)">
              <Input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => update({ price: Number(e.target.value) })}
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
                required
                value={formData.sku}
                onChange={(e) => update({ sku: e.target.value })}
              />
            </Field>
            <Field label="Barcode">
              <Input
                type="text"
                value={formData.barcode}
                onChange={(e) => update({ barcode: e.target.value })}
              />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => update({ stock: Number(e.target.value) })}
              />
            </Field>
            <Field label="Warranty">
              <Input
                type="text"
                value={formData.warranty}
                onChange={(e) => update({ warranty: e.target.value })}
              />
            </Field>
          </div>

          {/* Shipping Configuration */}
          <ProductShippingSection
            shippingType={formData.shippingType}
            shippingCost={formData.shippingCost}
            onShippingTypeChange={(type) => {
              update({
                shippingType: type,
                shippingCost: type === 'FREE' ? 0 : (formData.shippingCost > 0 ? formData.shippingCost : 100),
              });
            }}
            onShippingCostChange={(cost) => update({ shippingCost: cost })}
          />

          <Field label="Description">
            <Textarea
              value={formData.description}
              onChange={(e) => update({ description: e.target.value })}
            />
          </Field>

          {/* Specifications */}
          <ProductSpecsSection
            specifications={specifications}
            specKey={specKey}
            setSpecKey={setSpecKey}
            specValue={specValue}
            setSpecValue={setSpecValue}
            onAdd={addSpecification}
            onRemove={removeSpecification}
          />

          {/* Variants */}
          <ProductVariantsSection
            variants={variants}
            variantName={variantName}
            setVariantName={setVariantName}
            variantPrice={variantPrice}
            setVariantPrice={setVariantPrice}
            variantStock={variantStock}
            setVariantStock={setVariantStock}
            variantSku={variantSku}
            setVariantSku={setVariantSku}
            variantImage={variantImage}
            setVariantImage={setVariantImage}
            onAddVariant={addVariant}
            onRemoveVariant={removeVariant}
            formatPrice={formatVariantPrice}
          />
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