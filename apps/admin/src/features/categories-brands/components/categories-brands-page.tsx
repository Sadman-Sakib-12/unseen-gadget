"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { CategoriesTable } from "@/features/categories-brands/components/categories-table";
import { BrandsTable } from "@/features/categories-brands/components/brands-table";
import { CategoryForm } from "@/features/categories-brands/components/category-form";
import initialCategories from "@/features/categories-brands/data/categories.json";
import initialBrands from "@/features/categories-brands/data/brands.json";
import { Category, Brand } from "@/features/categories-brands/types";

export function CategoriesBrandsPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands] = useState<Brand[]>(initialBrands);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const handleSaveCategory = (category: Category) => {
    if (editingCategory) {
      setCategories(categories.map((c) => (c.id === category.id ? category : c)));
    } else {
      setCategories([...categories, category]);
    }
    setShowCategoryForm(false);
    setEditingCategory(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories & Brands</h1>
        <p className="text-gray-500">Organize products with categories and brands</p>
      </div>
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setEditingCategory(undefined); setShowCategoryForm(true); }}
              className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
          {showCategoryForm && (
            <CategoryForm
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => { setShowCategoryForm(false); setEditingCategory(undefined); }}
            />
          )}
          <CategoriesTable data={categories} />
        </TabsContent>
        <TabsContent value="brands" className="mt-4">
          <BrandsTable data={brands} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
