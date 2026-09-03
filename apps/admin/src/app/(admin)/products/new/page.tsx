'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  Layers,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  useAdminCategories,
  useAdminBrands,
  useSaveAdminProduct,
} from '@/hooks/use-admin-queries';
import type { ProductVariant } from '@/features/products/types';
import { ProductSpecsSection } from '@/features/products/components/product-specs-section';
import { ProductVariantsSection } from '@/features/products/components/product-variants-section';
import { ProductShippingSection } from '@/features/products/components/product-shipping-section';
import { ProductBasicInfoCard } from './components/product-basic-info-card';
import { ProductMediaCard } from './components/product-media-card';
import { ProductPricingCard } from './components/product-pricing-card';
import { ProductInventoryCard } from './components/product-inventory-card';
import { ProductStatusCard } from './components/product-status-card';

export default function NewProductPage() {
  const router = useRouter();

  // Queries
  const { data: categoriesRes } = useAdminCategories();
  const { data: brandsRes } = useAdminBrands();
  const saveProductMutation = useSaveAdminProduct();
  const isSaving = saveProductMutation.isPending;

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(1);
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [warranty, setWarranty] = useState('');
  const [badge, setBadge] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'>('ACTIVE');
  const [shippingType, setShippingType] = useState<'FREE' | 'PAID'>('FREE');
  const [shippingCost, setShippingCost] = useState<number>(0);

  // Images
  const [images, setImages] = useState<string[]>([]);

  // Specifications
  const [specifications, setSpecifications] = useState<Record<string, string | undefined>>({});
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantName, setVariantName] = useState('');
  const [variantPrice, setVariantPrice] = useState('');
  const [variantStock, setVariantStock] = useState('');
  const [variantSku, setVariantSku] = useState('');
  const [variantImage, setVariantImage] = useState('');

  // Categories & Brands list
  const categories = Array.isArray((categoriesRes as any)?.data)
    ? (categoriesRes as any).data
    : Array.isArray(categoriesRes)
    ? categoriesRes
    : [];

  const brands = Array.isArray((brandsRes as any)?.data)
    ? (brandsRes as any).data
    : Array.isArray(brandsRes)
    ? brandsRes
    : [];

  // Specs handlers
  const handleAddSpec = () => {
    const k = specKey.trim();
    const v = specValue.trim();
    if (k && v) {
      setSpecifications((prev) => ({ ...prev, [k]: v }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpec = (key: string) => {
    setSpecifications((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Variant handlers
  const handleAddVariant = () => {
    const vName = variantName.trim();
    const vPrice = Number(variantPrice);
    const vStock = Number(variantStock) || 0;
    const vSku = variantSku.trim();

    if (!vName || isNaN(vPrice) || !vSku) {
      toast.error('Please enter variant name, price and SKU');
      return;
    }

    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      name: vName,
      price: vPrice,
      stock: vStock,
      sku: vSku,
      images: variantImage.trim() ? [variantImage.trim()] : [],
    };

    setVariants((prev) => [...prev, newVariant]);
    setVariantName('');
    setVariantPrice('');
    setVariantStock('');
    setVariantSku('');
    setVariantImage('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product title is required');
      return;
    }
    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }
    if (typeof price !== 'number' || price <= 0) {
      toast.error('Valid positive price is required');
      return;
    }
    if (shippingType === 'PAID' && (!shippingCost || shippingCost <= 0)) {
      toast.error('Paid shipping requires a positive shipping cost');
      return;
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      category: category.trim(),
      price: Math.round(price),
      shippingType,
      shippingCost: shippingType === 'FREE' ? 0 : Math.round(shippingCost),
      status,
    };

    if (brand.trim()) payload.brand = brand.trim();
    if (description.trim()) payload.description = description.trim();
    if (typeof originalPrice === 'number' && originalPrice > 0) {
      payload.originalPrice = Math.round(originalPrice);
    }
    if (typeof discount === 'number' && discount > 0) {
      payload.discount = Math.round(discount);
    }
    if (typeof stock === 'number') {
      payload.stock = Math.max(0, Math.round(stock));
      payload.inStock = stock > 0;
    }
    if (sku.trim()) payload.sku = sku.trim();
    if (barcode.trim()) payload.barcode = barcode.trim();
    if (warranty.trim()) payload.warranty = warranty.trim();
    if (badge.trim()) payload.badge = badge.trim();
    if (images.length > 0) payload.images = images;
    if (Object.keys(specifications).length > 0) payload.specifications = specifications;
    if (variants.length > 0) {
      payload.variants = variants.map((v) => ({
        name: v.name,
        price: Math.round(v.price),
        stock: Math.round(v.stock),
        sku: v.sku,
        images: v.images || [],
      }));
    }

    try {
      await saveProductMutation.mutateAsync({ data: payload });
      toast.success('Product created successfully!');
      router.push('/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-xs text-gray-500">
              Create a new product listing for your storefront catalog.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                Publish Product
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Left Column (Main Information) ── */}
        <div className="space-y-6 lg:col-span-2">
          <ProductBasicInfoCard
            name={name}
            setName={setName}
            category={category}
            setCategory={setCategory}
            brand={brand}
            setBrand={setBrand}
            description={description}
            setDescription={setDescription}
            categories={categories}
            brands={brands}
          />

          <ProductMediaCard
            images={images}
            setImages={setImages}
          />

          {/* Specifications Card */}
          <Card className="border-gray-200 bg-white shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
                <Layers className="h-4 w-4 text-primary" />
                Technical Specifications
              </CardTitle>
              <CardDescription className="text-xs">
                Key-value attributes such as Processor, Display, Storage, Battery, etc.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSpecsSection
                specifications={specifications}
                specKey={specKey}
                setSpecKey={setSpecKey}
                specValue={specValue}
                setSpecValue={setSpecValue}
                onAdd={handleAddSpec}
                onRemove={handleRemoveSpec}
              />
            </CardContent>
          </Card>

          {/* Variants Card */}
          <Card className="border-gray-200 bg-white shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
                <Sparkles className="h-4 w-4 text-primary" />
                Product Variants (Optional)
              </CardTitle>
              <CardDescription className="text-xs">
                Add size, color, or storage variants with individual price, stock, SKU and images.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                onAddVariant={handleAddVariant}
                onRemoveVariant={handleRemoveVariant}
                formatPrice={(p) => `৳${p.toLocaleString()}`}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column (Sidebar Settings) ── */}
        <div className="space-y-6">
          <ProductPricingCard
            price={price}
            setPrice={setPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            discount={discount}
            setDiscount={setDiscount}
          />

          <ProductInventoryCard
            stock={stock}
            setStock={setStock}
            sku={sku}
            setSku={setSku}
            barcode={barcode}
            setBarcode={setBarcode}
          />

          {/* Shipping Configuration Card */}
          <Card className="border-gray-200 bg-white shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
                <Truck className="h-4 w-4 text-primary" />
                Shipping & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductShippingSection
                shippingType={shippingType}
                shippingCost={shippingCost}
                onShippingTypeChange={(type) => {
                  setShippingType(type);
                  if (type === 'FREE') setShippingCost(0);
                  else if (shippingCost === 0) setShippingCost(100);
                }}
                onShippingCostChange={setShippingCost}
              />
            </CardContent>
          </Card>

          <ProductStatusCard
            status={status}
            setStatus={setStatus}
            warranty={warranty}
            setWarranty={setWarranty}
            badge={badge}
            setBadge={setBadge}
          />
        </div>
      </div>
    </form>
  );
}
