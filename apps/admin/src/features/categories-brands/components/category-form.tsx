"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Category } from "@/features/categories-brands/types";
import allCategories from "@/features/categories-brands/data/categories.json";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Category) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function CategoryForm({ isOpen, onClose, category, onSave }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    id: category?.id ?? "",
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image: category?.image ?? null,
    parentId: category?.parentId ?? null,
    status: category?.status ?? "active",
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `CAT-${Date.now().toString().slice(-3)}`;
    onSave({ ...formData, id } as Category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>{category ? "Edit Category" : "Create Category"}</DialogTitle>
        <DialogDescription>
          {category
            ? `Update the details for ${category.name}.`
            : "Create a new category to organize your catalog."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. Smartphones"
                required
              />
            </Field>
            <Field label="Slug">
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => update({ slug: e.target.value })}
                placeholder="e.g. smartphones"
                required
              />
            </Field>
            <Field label="Parent Category">
              <Select
                value={formData.parentId ?? ""}
                onChange={(e) => update({ parentId: e.target.value || null })}
                options={[
                  { value: "", label: "None (Top Level)" },
                  ...allCategories
                    .filter((c) => c.id !== formData.id)
                    .map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) => update({ status: e.target.value })}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  value={formData.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  placeholder="Short category description"
                />
              </Field>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="category-form">
          {category ? "Update Category" : "Save Category"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}