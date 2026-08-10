"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product, ProductVariant, Category } from "../types";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (product: Partial<Product>) => void;
}

export function ProductForm({ isOpen, onClose, product, categories, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "",
    description: product?.description || "",
    price: product?.price || 0,
    discount: product?.discount || 0,
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    stock: product?.stock || 0,
    warranty: product?.warranty || "",
    status: (product?.status || "ACTIVE") as Product["status"],
  });

  const [specifications, setSpecifications] = useState<Record<string, string>>(product?.specifications || {});
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
  const [variantName, setVariantName] = useState("");
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantStock, setVariantStock] = useState(0);
  const [variantSku, setVariantSku] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, specifications, variants });
    onClose();
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setSpecifications({ ...specifications, [specKey]: specValue });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  const addVariant = () => {
    if (variantName && variantPrice > 0 && variantStock > 0 && variantSku) {
      setVariants([
        ...variants,
        { id: `v-${Date.now()}`, name: variantName, price: variantPrice, stock: variantStock, sku: variantSku },
      ]);
      setVariantName("");
      setVariantPrice(0);
      setVariantStock(0);
      setVariantSku("");
    }
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{product ? "Edit Product" : "Add Product"}</CardTitle>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Product["status"] })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (BDT)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Barcode</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Warranty</label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Specifications</label>
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="rounded p-1 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Display)"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 6.1 inch)"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Variants</label>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div key={variant.id} className="flex items-center gap-2">
                    <span className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                      {variant.name} - {variant.price.toLocaleString()} BDT - Stock: {variant.stock} - SKU: {variant.sku}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="rounded p-1 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Variant name"
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  className="col-span-2 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variantPrice || ""}
                  onChange={(e) => setVariantPrice(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variantStock || ""}
                  onChange={(e) => setVariantStock(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={variantSku}
                  onChange={(e) => setVariantSku(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-black focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Plus className="h-4 w-4" /> Add Variant
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                {product ? "Update Product" : "Create Product"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
