'use client';

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/features/categories-brands/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (category: Partial<Category>) => Promise<void> | void;
  categories?: Category[];
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function CategoryForm({
  isOpen,
  onClose,
  category,
  onSave,
  categories,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    id: category?.id ?? "",
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    image: category?.image ?? "",
    parentId: category?.parentId ?? "",
    status: category?.status ?? "active",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleNameChange = (name: string) => {
    if (!slugManuallyEdited && !category) {
      update({ name, slug: slugify(name) });
    } else {
      update({ name });
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        update({ image: data.data.url });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || data.message || "Failed to upload image");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Category> = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || slugify(formData.name),
        description: formData.description.trim() || null,
        image: formData.image.trim() || null,
        parentId: formData.parentId ? formData.parentId : null,
        status: formData.status,
      };

      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="xl">
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DialogHeader close>
          <DialogTitle>{category ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {category
              ? `Update the details for ${category.name}.`
              : "Create a new category to organize your catalog."}
          </DialogDescription>
        </DialogHeader>

        <DialogContent className="space-y-5">
          <div className="space-y-4">
            {/* Category Image Upload */}
            <Field label="Category Image / Icon">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: "none" }}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 shadow-sm">
                    {formData.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.image}
                        alt="Category preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  {formData.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => update({ image: "" })}
                    >
                      <X className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="shrink-0"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-primary" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-1.5 h-4 w-4 text-primary" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground">or paste URL:</span>
                  </div>

                  <Input
                    type="text"
                    value={formData.image}
                    onChange={(e) => update({ image: e.target.value })}
                    placeholder="https://... or /images/categories/category.png"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category Name *">
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Smartphones, Audio, Laptops"
                  required
                />
              </Field>

              <Field label="Slug (URL Key) *">
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    update({ slug: e.target.value });
                  }}
                  placeholder="e.g. smartphones"
                  required
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Parent Category">
                <Select
                  value={formData.parentId}
                  onChange={(e) => update({ parentId: e.target.value })}
                  options={[
                    { value: "", label: "None (Top Level)" },
                    ...(categories
                      ? categories
                          .filter((c) => c.id !== formData.id)
                          .map((c) => ({ value: c.id, label: c.name }))
                      : []),
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
            </div>

            <Field label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={3}
                placeholder="Short category description for SEO and catalog grouping"
              />
            </Field>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose} disabled={saving || uploading}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {category ? "Update Category" : "Save Category"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}