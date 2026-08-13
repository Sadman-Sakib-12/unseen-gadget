"use client";

import { useState } from "react";
import { BadgeDollarSign, Building2, Plus, Truck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { suppliers } from "@/features/suppliers/data";
import { Supplier } from "@/features/suppliers/types";
import { SuppliersTable } from "@/features/suppliers/components/suppliers-table";
import { SupplierForm } from "@/features/suppliers/components/supplier-form";
import { formatBDT } from "@/lib/load-dashboard-data";

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

  const totalDue = suppliers.reduce((sum, s) => sum + s.dueAmount, 0);
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0);
  const active = suppliers.filter((s) => s.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage supplier information and payments."
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total suppliers"
          value={suppliers.length}
          icon={Truck}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active"
          value={active}
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Total purchases"
          value={formatBDT(totalPurchases)}
          icon={Building2}
          iconClassName="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Total due"
          value={formatBDT(totalDue)}
          icon={BadgeDollarSign}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      <SuppliersTable suppliers={suppliers} onEdit={handleEdit} />

      <SupplierForm
        key={editingSupplier?.id ?? "new"}
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