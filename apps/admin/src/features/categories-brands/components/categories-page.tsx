'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CategoriesTable } from './categories-table';
import { CategoryForm } from './category-form';
import type { Category } from '@/features/categories-brands/types';
import {
  useAdminCategories,
  useSaveAdminCategory,
  useDeleteAdminCategory,
} from '@/hooks/use-admin-queries';

export function CategoriesPage() {
  const { data: categoriesRes } = useAdminCategories();
  const saveCategoryMutation = useSaveAdminCategory();
  const deleteCategoryMutation = useDeleteAdminCategory();

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const categories = useMemo(() => {
    const raw = (categoriesRes as any)?.data ?? categoriesRes;
    if (!Array.isArray(raw)) return [];
    return raw.map((c: Partial<Category> & { active?: boolean; _count?: { products?: number } }) => ({
      id: c.id || '',
      name: c.name || '',
      slug: c.slug || '',
      description: c.description || null,
      image: c.image || null,
      parentId: c.parentId || null,
      status: c.active === false ? 'inactive' : (c.status || 'active'),
      productCount: c._count?.products ?? c.productCount ?? 0,
    })) as Category[];
  }, [categoriesRes]);

  const handleSaveCategory = async (category: Partial<Category>) => {
    try {
      await saveCategoryMutation.mutateAsync({
        id: editingCategory?.id,
        data: category as Record<string, unknown>,
      });
      toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    try {
      await deleteCategoryMutation.mutateAsync(deleteCategory.id);
      toast.success('Category deleted successfully');
      setDeleteCategory(null);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to delete category');
      setDeleteCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize products with categories"
        actions={
          <Button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <CategoriesTable
        data={categories}
        onEdit={(category) => {
          setEditingCategory(category);
          setShowCategoryForm(true);
        }}
        onDelete={(id) =>
          setDeleteCategory(categories.find((c) => c.id === id) ?? null)
        }
      />

      <CategoryForm
        key={editingCategory ? editingCategory.id : 'new-category'}
        isOpen={showCategoryForm}
        onClose={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        categories={categories}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        open={deleteCategory !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCategory(null);
        }}
        title="Delete category"
        description="Products in this category are not removed."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteCategory}
      >
        <p>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{deleteCategory?.name}</span>?
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </div>
  );
}