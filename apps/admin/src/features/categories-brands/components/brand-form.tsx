"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
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
import { BrandLogo } from "./brand-logo";
import type { Brand } from "@/features/categories-brands/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onSave: (brand: Partial<Brand>) => Promise<void> | void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function BrandForm({ isOpen, onClose, brand, onSave }: BrandFormProps) {
  const [formData, setFormData] = useState({
    id: brand?.id ?? "",
    name: brand?.name ?? "",
    slug: brand?.slug ?? "",
    description: brand?.description ?? "",
    logo: brand?.logo ?? "",
    status: brand?.status ?? "active",
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleNameChange = (name: string) => {
    if (!slugManuallyEdited && !brand) {
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
        update({ logo: data.data.url });
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(data.error || data.message || "Failed to upload logo");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Logo upload failed");
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
      toast.error("Brand name is required");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Brand> = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || slugify(formData.name),
        logo: formData.logo.trim() || null,
        description: formData.description.trim() || null,
        status: formData.status as "active" | "inactive",
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
          <DialogTitle>{brand ? "Edit Brand" : "Create Brand"}</DialogTitle>
          <DialogDescription>
            {brand
              ? `Update details for ${brand.name}.`
              : "Add a new brand to categorize products and showcase on the storefront."}
          </DialogDescription>
        </DialogHeader>

        <DialogContent className="space-y-5">
          <div className="space-y-4">
            {/* Brand Logo Upload & Preview */}
            <Field label="Brand Logo">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                style={{ display: "none" }}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <BrandLogo
                    key={formData.logo || "none"}
                    name={formData.name || "Brand"}
                    logo={formData.logo}
                    className="h-16 w-16 border-2 shadow-sm"
                  />
                  {formData.logo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => update({ logo: "" })}
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
                          Upload Logo Image
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-muted-foreground">or paste URL:</span>
                  </div>

                  <Input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => update({ logo: e.target.value })}
                    placeholder="https://... or /images/brands/brand.png"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand Name *">
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Apple, Samsung, Sony"
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
                  placeholder="e.g. apple, samsung"
                  required
                />
              </Field>
            </div>

            <Field label="Status">
              <Select
                value={formData.status}
                onChange={(e) => update({ status: e.target.value })}
                options={[
                  { value: "active", label: "Active (Visible on Store)" },
                  { value: "inactive", label: "Inactive (Hidden)" },
                ]}
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={formData.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={3}
                placeholder="Short brand overview or warranty summary"
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
            {brand ? "Update Brand" : "Save Brand"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}