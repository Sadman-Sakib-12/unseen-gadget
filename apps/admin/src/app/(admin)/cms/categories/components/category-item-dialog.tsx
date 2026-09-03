"use client";

import { useRef } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BUILTIN_ICONS, renderIconPreview } from "./category-icons";

export interface CategoryShowcaseItem {
  id: string;
  name: string;
  href: string;
  iconType: string;
  image?: string;
  active: boolean;
}

interface CategoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formData: CategoryShowcaseItem;
  setFormData: React.Dispatch<React.SetStateAction<CategoryShowcaseItem>>;
  categoriesList: Array<{ id: string; name: string; slug?: string; image?: string }>;
  uploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export function CategoryItemDialog({
  open,
  onOpenChange,
  isEditing,
  formData,
  setFormData,
  categoriesList,
  uploading,
  onFileUpload,
  onSave,
}: CategoryItemDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectStoreCategory = (catIdOrSlug: string) => {
    const cat = categoriesList.find((c) => c.id === catIdOrSlug || c.slug === catIdOrSlug);
    if (cat) {
      setFormData((prev) => ({
        ...prev,
        id: cat.slug || cat.id,
        name: cat.name,
        href: `/category/${cat.slug}`,
        iconType: cat.slug || prev.iconType,
        image: cat.image || prev.image,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader close>
        <DialogTitle>
          {isEditing ? "Edit Category Showcase Item" : "Add New Category Showcase"}
        </DialogTitle>
        <DialogDescription>
          Upload a custom logo image, select vector icon, set name and target link.
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          {/* Quick Fill from Store Categories */}
          {categoriesList.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Quick Select from Store Categories (Autofill)
              </label>
              <select
                onChange={(e) => handleSelectStoreCategory(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- Choose Category to Autofill --</option>
                {categoriesList.map((c) => (
                  <option key={c.id} value={c.slug || c.id}>
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Category Title *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. iPhones, MacBooks, Accessories..."
            />
          </div>

          {/* Target URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Target URL (href) *
            </label>
            <Input
              value={formData.href}
              onChange={(e) => setFormData((p) => ({ ...p, href: e.target.value }))}
              placeholder="e.g. /category/phones or /category/computers"
              className="font-mono text-xs"
            />
          </div>

          {/* Logo / Image Upload Section */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Category Logo / Icon
              </label>
              {formData.image && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove Image
                </Button>
              )}
            </div>

            {/* Image Preview & Upload Buttons */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary overflow-hidden shadow-inner">
                {renderIconPreview(formData.iconType, formData.image)}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileUpload}
                />

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Upload Image / Logo File
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Upload PNG, SVG, JPG or WebP (Recommended transparent background).
                </p>
              </div>
            </div>

            {/* Or Custom Image URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500">Or Paste Image URL</label>
              <Input
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    image: e.target.value,
                    iconType: "custom-image",
                  }))
                }
                placeholder="https://example.com/logo.png"
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* Built-in Vector Icon Style */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-500">
                Or Select Built-in Vector Icon
              </label>
              <select
                value={formData.iconType}
                onChange={(e) => setFormData((p) => ({ ...p, iconType: e.target.value }))}
                className="h-9 w-full rounded-lg border border-border bg-card px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {BUILTIN_ICONS.map((icon) => (
                  <option key={icon.id} value={icon.id}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Display on Storefront
            </span>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => setFormData((p) => ({ ...p, active: checked }))}
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          {isEditing ? "Update Category" : "Add Category"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
