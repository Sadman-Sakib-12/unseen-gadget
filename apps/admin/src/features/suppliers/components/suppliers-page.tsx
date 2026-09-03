"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BadgeDollarSign, Building2, Plus, Truck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { fetchSuppliers } from "@/features/suppliers/data";
import { api } from "@/lib/api";
import { Supplier } from "@/features/suppliers/types";
import { SuppliersTable } from "@/features/suppliers/components/suppliers-table";
import { SupplierForm } from "@/features/suppliers/components/supplier-form";
import { formatBDT } from "@/lib/load-dashboard-data";

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();

  useEffect(() => {
    fetchSuppliers()
      .then(setSuppliers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const handleSave = async (supplierData: Omit<Supplier, "id">) => {
    try {
      if (editingSupplier) {
        const res = await api.suppliers.update(String(editingSupplier.id), supplierData);
        setSuppliers((prev) => prev.map((s) => (s.id === editingSupplier.id ? (res.data as Supplier) : s)));
        toast.success("Supplier updated successfully");
      } else {
        const res = await api.suppliers.create(supplierData);
        setSuppliers((prev) => [...prev, res.data as Supplier]);
        toast.success("Supplier created successfully");
      }
      setShowForm(false);
      setEditingSupplier(undefined);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to save supplier");
    }
  };

  const handleDelete = (supplier: Supplier) => {
    setDeleteTarget(supplier);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await api.suppliers.delete(String(deleteTarget.id));
        setSuppliers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        toast.success(`Supplier "${deleteTarget.name}" deleted successfully`);
        setDeleteTarget(null);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete supplier");
      }
    }
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <SuppliersTable suppliers={suppliers} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Supplier"
        description={`Are you sure you want to delete supplier "${deleteTarget?.name}"?`}
        confirmLabel="Delete Supplier"
        destructive
      />

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
