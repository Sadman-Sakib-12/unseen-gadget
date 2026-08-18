"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoriesTable } from "./categories-table";
import { CategoryForm } from "./category-form";
import initialCategories from "@/features/categories-brands/data/categories.json";
import type { Category } from "@/features/categories-brands/types";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const handleSaveCategory = (category: Category) => {
    setCategories((prev) =>
      editingCategory
        ? prev.map((c) => (c.id === category.id ? category : c))
        : [...prev, category]
    );
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    if (deleteCategory) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
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
        key={editingCategory ? editingCategory.id : "new-category"}
        isOpen={showCategoryForm}
        onClose={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
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