'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { BrandsTable } from './brands-table';
import { BrandForm } from './brand-form';
import type { Brand } from '@/features/categories-brands/types';
import {
  useAdminBrands,
  useSaveAdminBrand,
  useDeleteAdminBrand,
} from '@/hooks/use-admin-queries';

export function BrandsPage() {
  const { data: brandsRes } = useAdminBrands();
  const saveBrandMutation = useSaveAdminBrand();
  const deleteBrandMutation = useDeleteAdminBrand();

  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);

  const brands = useMemo(() => {
    const raw = (brandsRes as any)?.data ?? brandsRes;
    if (!Array.isArray(raw)) return [];
    return raw.map((b: Partial<Brand> & { active?: boolean; _count?: { products?: number } }) => ({
      id: b.id || '',
      name: b.name || '',
      slug: b.slug || '',
      logo: b.logo || null,
      description: b.description || '',
      status: b.active === false ? 'inactive' : (b.status || 'active'),
      productCount: b._count?.products ?? b.productCount ?? 0,
    })) as Brand[];
  }, [brandsRes]);

  const handleSaveBrand = async (brand: Partial<Brand>) => {
    try {
      await saveBrandMutation.mutateAsync({
        id: editingBrand?.id,
        data: brand as Record<string, unknown>,
      });
      toast.success(editingBrand ? 'Brand updated successfully' : 'Brand created successfully');
      setShowBrandForm(false);
      setEditingBrand(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to save brand');
    }
  };

  const handleDeleteBrand = async () => {
    if (!deleteBrand) return;
    try {
      await deleteBrandMutation.mutateAsync(deleteBrand.id);
      toast.success('Brand deleted successfully');
      setDeleteBrand(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to delete brand');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage brand logos, names, and descriptions"
        actions={
          <Button
            onClick={() => {
              setEditingBrand(null);
              setShowBrandForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </Button>
        }
      />

      <BrandsTable
        data={brands}
        onEdit={(brand) => {
          setEditingBrand(brand);
          setShowBrandForm(true);
        }}
        onDelete={(id) => setDeleteBrand(brands.find((b) => b.id === id) ?? null)}
      />

      <BrandForm
        key={editingBrand ? editingBrand.id : "new-brand"}
        isOpen={showBrandForm}
        onClose={() => {
          setShowBrandForm(false);
          setEditingBrand(null);
        }}
        brand={editingBrand}
        onSave={handleSaveBrand}
      />

      <ConfirmDialog
        open={deleteBrand !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteBrand(null);
        }}
        title="Delete brand"
        description="Products under this brand are not removed."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteBrand}
      >
        <p>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{deleteBrand?.name}</span>?
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </div>
  );
}