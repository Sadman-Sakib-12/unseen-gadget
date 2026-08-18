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
import { Textarea } from "@/components/ui/textarea";
import { BrandLogo } from "./brand-logo";
import type { Brand } from "@/features/categories-brands/types";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  onSave: (brand: Brand) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
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
    logo: brand?.logo ?? null,
    status: brand?.status ?? "active",
  });

  const update = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const handleLogoChange = (value: string) => update({ logo: value || null });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const id = formData.id || `BR-${Date.now().toString().slice(-3)}`;
    onSave({ ...formData, id } as Brand);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>{brand ? "Edit Brand" : "Create Brand"}</DialogTitle>
        <DialogDescription>
          {brand
            ? `Update the details for ${brand.name}.`
            : "Create a new brand to organize your catalog."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form id="brand-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Logo">
                <div className="flex items-center gap-3">
                  <BrandLogo
                    key={formData.logo ?? "none"}
                    name={formData.name}
                    logo={formData.logo}
                    className="h-12 w-12"
                  />
                  <div className="min-w-0 flex-1">
                    <Input
                      type="text"
                      value={formData.logo ?? ""}
                      onChange={(e) => handleLogoChange(e.target.value)}
                      placeholder="/images/brands/techpro.png"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Paste an image URL or path. If it cannot be loaded, the brand initials are shown.
                    </p>
                  </div>
                </div>
              </Field>
            </div>
            <Field label="Name">
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. Samsung"
                required
              />
            </Field>
            <Field label="Slug">
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => update({ slug: e.target.value })}
                placeholder="e.g. samsung"
                required
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
                <Textarea
                  value={formData.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  placeholder="Short brand description"
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
        <Button type="submit" form="brand-form">
          {brand ? "Update Brand" : "Save Brand"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}