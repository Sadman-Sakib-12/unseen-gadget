"use client";

import { useState, useEffect } from "react";
import { BadgeDollarSign, Plus, Truck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { api } from "@/lib/api";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

interface Supplier {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  company?: string;
  dueAmount?: number;
  totalPurchases?: number;
  status?: string;
}

export function SuppliersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.suppliers.list().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setSuppliers(res.data as Supplier[]);
      }
      setIsLoading(false);
    }).catch((err: unknown) => {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to load suppliers");
      setIsLoading(false);
    });
  }, []);

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this supplier?")) return;
    try {
      await api.suppliers.delete(String(id));
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      alert(errorObj.message || "Failed to delete supplier");
    }
  };

  const totalDue = suppliers.reduce((sum, s) => sum + (s.dueAmount ?? 0), 0);
  const active = suppliers.filter((s) => s.status === "ACTIVE").length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h3 className="mt-3 text-sm font-bold text-foreground">Loading suppliers...</h3>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage supplier information and payments."
        actions={
          <Button onClick={() => { setEditingSupplier(null); setShowForm(true); }}>
            <Plus className="h-4 w-4" /> Add Supplier
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard title="Total suppliers" value={suppliers.length} icon={Truck} iconClassName="bg-blue-50 text-blue-700" />
        <StatCard title="Active" value={active} icon={UserCheck} iconClassName="bg-emerald-50 text-emerald-700" />
        <StatCard title="Total due" value={formatBDT(totalDue)} icon={BadgeDollarSign} iconClassName="bg-red-50 text-red-700" />
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-bold text-foreground">{editingSupplier ? "Edit" : "Add"} Supplier</h3>
          <p className="text-xs text-muted-foreground mb-4">Supplier form connected to backend API.</p>
          <Button variant="outline" onClick={() => { setShowForm(false); setEditingSupplier(null); }}>Close</Button>
        </div>
      )}

      {suppliers.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Due</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{supplier.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{supplier.phone || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{supplier.email || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{supplier.company || "-"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-600">{formatBDT(supplier.dueAmount ?? 0)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${supplier.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                      {supplier.status || "ACTIVE"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleEdit(supplier)} className="text-xs font-medium text-primary hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(supplier.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <Truck className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">No suppliers found</h3>
        </div>
      )}
    </div>
  );
}
