'use client';

import { Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ProductBasicInfoCardProps {
  name: string;
  setName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  categories: any[];
  brands: any[];
}

export function ProductBasicInfoCard({
  name,
  setName,
  category,
  setCategory,
  brand,
  setBrand,
  description,
  setDescription,
  categories,
  brands,
}: ProductBasicInfoCardProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
          <Package className="h-4 w-4 text-primary" />
          General Information
        </CardTitle>
        <CardDescription className="text-xs">
          Title, brand, category and detailed product description.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Product Name / Title <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apple iPhone 16 Pro Max 256GB Natural Titanium"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: '', label: '-- Select Category --' },
                ...categories.map((c: any) => ({
                  value: c.slug || c.id,
                  label: c.name,
                })),
              ]}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Brand</label>
            <Select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              options={[
                { value: '', label: '-- Select Brand (Optional) --' },
                ...brands.map((b: any) => ({
                  value: b.name,
                  label: b.name,
                })),
                { value: 'Apple', label: 'Apple' },
                { value: 'Samsung', label: 'Samsung' },
                { value: 'Google', label: 'Google' },
                { value: 'Xiaomi', label: 'Xiaomi' },
                { value: 'Sony', label: 'Sony' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Product Description
          </label>
          <Textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of features, materials, in-the-box contents, and performance highlights..."
            className="text-xs leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
