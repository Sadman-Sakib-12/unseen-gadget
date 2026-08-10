"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { suppliers } from "@/features/suppliers/data";
import { Supplier } from "@/features/suppliers/types";
import { SuppliersTable } from "@/features/suppliers/components/suppliers-table";
import { SupplierForm } from "@/features/suppliers/components/supplier-form";

export function SuppliersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();

  const handleSave = (supplierData: Omit<Supplier, "id">) => {
    if (editingSupplier) {
      const idx = suppliers.findIndex((s) => s.id === editingSupplier.id);
      if (idx >= 0) {
        suppliers[idx] = { ...supplierData, id: editingSupplier.id };
      }
    } else {
      const newId = Math.max(...suppliers.map((s) => s.id), 0) + 1;
      suppliers.push({ ...supplierData, id: newId });
    }
    setShowForm(false);
    setEditingSupplier(undefined);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingSupplier(undefined);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-gray-500">Manage supplier information and payments</p>
        </div>
        <Button onClick={handleAdd}>Add Supplier</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <SuppliersTable suppliers={suppliers} onEdit={handleEdit} />
        </CardContent>
      </Card>

      <SupplierForm
        supplier={editingSupplier}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSupplier(undefined);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
