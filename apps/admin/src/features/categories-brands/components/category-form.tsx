"use client";
import { useState } from "react";
import { Category } from "@/features/categories-brands/types";
import allCategories from "@/features/categories-brands/data/categories.json";

interface CategoryFormProps {
  category?: Category;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    id: category?.id || "CAT-" + String(Date.now()).slice(-3),
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || null,
    parentId: category?.parentId || null,
    status: category?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold">{category ? "Edit Category" : "Create Category"}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input type="text" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Parent Category</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.parentId || ""} onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}>
            <option value="">None (Top Level)</option>
            {allCategories.filter((c) => c.id !== formData.id).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Save Category</button>
      </div>
    </form>
  );
}
