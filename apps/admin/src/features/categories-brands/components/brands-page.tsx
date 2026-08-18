"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BrandsTable } from "./brands-table";
import { BrandForm } from "./brand-form";
import initialBrands from "@/features/categories-brands/data/brands.json";
import type { Brand } from "@/features/categories-brands/types";

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);

  const handleSaveBrand = (brand: Brand) => {
    setBrands((prev) =>
      editingBrand
        ? prev.map((b) => (b.id === brand.id ? brand : b))
        : [...prev, brand]
    );
    setShowBrandForm(false);
    setEditingBrand(null);
  };

  const handleDeleteBrand = () => {
    if (deleteBrand) {
      setBrands((prev) => prev.filter((b) => b.id !== deleteBrand.id));
      setDeleteBrand(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands"
        description="Manage brand logos, names, and descriptions"
        actions={
          <Button
            onClick={() => {
              setEditingBrand(null);
              setShowBrandForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </Button>
        }
      />

      <BrandsTable
        data={brands}
        onEdit={(brand) => {
          setEditingBrand(brand);
          setShowBrandForm(true);
        }}
        onDelete={(id) => setDeleteBrand(brands.find((b) => b.id === id) ?? null)}
      />

      <BrandForm
        key={editingBrand ? editingBrand.id : "new-brand"}
        isOpen={showBrandForm}
        onClose={() => {
          setShowBrandForm(false);
          setEditingBrand(null);
        }}
        brand={editingBrand}
        onSave={handleSaveBrand}
      />

      <ConfirmDialog
        open={deleteBrand !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteBrand(null);
        }}
        title="Delete brand"
        description="Products under this brand are not removed."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteBrand}
      >
        <p>
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{deleteBrand?.name}</span>?
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </div>
  );
}