"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { CategoriesTable } from "./categories-table";
import { BrandsTable } from "./brands-table";
import { CategoryForm } from "./category-form";
import initialCategories from "@/features/categories-brands/data/categories.json";
import initialBrands from "@/features/categories-brands/data/brands.json";
import type { Category, Brand } from "@/features/categories-brands/types";

export function CategoriesBrandsPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands] = useState<Brand[]>(initialBrands);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === category.id ? category : c)));
    } else {
      setCategories([...categories, category]);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories & Brands"
        description="Organize products with categories and brands"
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
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-4">
          <CategoriesTable data={categories} />
        </TabsContent>
        <TabsContent value="brands" className="mt-4">
          <BrandsTable data={brands} />
        </TabsContent>
      </Tabs>

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
    </div>
  );
}