"use client";

import { useState, useEffect, useCallback } from "react";
import { PackageCheck, Plus, Receipt, ShoppingCart, TriangleAlert, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

interface Purchase {
  id: string | number;
  supplierId: string | number;
  supplier?: { id: string; name: string };
  items: Array<{ productId?: string; productName?: string; quantity: number; unitPrice: number }>;
  total?: number;
  paidAmount?: number;
  dueAmount?: number;
  invoiceNumber?: string;
  date?: string;
  status?: string;
  notes?: string;
}

interface SupplierItem {
  id: string | number;
  name: string;
  company?: string;
}

interface ProductItem {
  id: string | number;
  name: string;
  price?: number;
}

export function PurchasesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [deletingPurchase, setDeletingPurchase] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemUnitPrice, setItemUnitPrice] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setSelectedSupplier("");
    setInvoiceNumber("");
    setSelectedProduct("");
    setItemQuantity(1);
    setItemUnitPrice(0);
    setPaidAmount(0);
    setNotes("");
    setEditingPurchase(null);
    setShowForm(false);
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setSelectedSupplier(String(purchase.supplierId || ""));
    setInvoiceNumber(purchase.invoiceNumber || "");
    const firstItem = purchase.items?.[0];
    if (firstItem) {
      setSelectedProduct(String(firstItem.productId || ""));
      setItemQuantity(firstItem.quantity || 1);
      setItemUnitPrice(firstItem.unitPrice || 0);
    } else {
      setSelectedProduct("");
      setItemQuantity(1);
      setItemUnitPrice(0);
    }
    setPaidAmount(purchase.paidAmount || 0);
    setNotes(purchase.notes || "");
    setShowForm(true);
  };

  const loadData = useCallback(async () => {
    try {
      const [purRes, supRes, prodRes] = await Promise.all([
        api.purchases.list().catch(() => ({ success: true, data: [] })),
        api.suppliers.list().catch(() => ({ success: true, data: [] })),
        api.products.list().catch(() => ({ success: true, data: [] })),
      ]);

      if (Array.isArray(purRes.data)) setPurchases(purRes.data as Purchase[]);
      if (Array.isArray(supRes.data)) setSuppliers(supRes.data as SupplierItem[]);
      if (Array.isArray(prodRes.data)) setProducts(prodRes.data as ProductItem[]);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to load purchases data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [purRes, supRes, prodRes] = await Promise.all([
          api.purchases.list().catch(() => ({ success: true, data: [] })),
          api.suppliers.list().catch(() => ({ success: true, data: [] })),
          api.products.list().catch(() => ({ success: true, data: [] })),
        ]);

        if (!ignore) {
          if (Array.isArray(purRes.data)) setPurchases(purRes.data as Purchase[]);
          if (Array.isArray(supRes.data)) setSuppliers(supRes.data as SupplierItem[]);
          if (Array.isArray(prodRes.data)) setProducts(prodRes.data as ProductItem[]);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const errorObj = err as { message?: string };
          setError(errorObj.message || "Failed to load purchases data");
          setIsLoading(false);
        }
      }
    }
    void init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSavePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) {
      toast.error("Please select a supplier");
      return;
    }
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    setIsSubmitting(true);
    try {
      const prod = products.find((p) => String(p.id) === String(selectedProduct));
      const payload = {
        supplierId: selectedSupplier,
        invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
        items: [
          {
            productId: selectedProduct,
            productName: prod?.name || "Product",
            quantity: Number(itemQuantity),
            unitPrice: Number(itemUnitPrice),
          },
        ],
        paidAmount: Number(paidAmount) || 0,
        notes: notes || undefined,
      };

      if (editingPurchase) {
        await api.purchases.update(String(editingPurchase.id), payload);
        toast.success("Purchase order updated successfully");
      } else {
        await api.purchases.create(payload);
        toast.success("Purchase order created successfully");
      }

      resetForm();
      void loadData();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to save purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePurchase = async () => {
    if (!deletingPurchase) return;
    try {
      await api.purchases.delete(String(deletingPurchase.id));
      toast.success("Purchase order deleted successfully");
      setDeletingPurchase(null);
      void loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete purchase order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h3 className="mt-3 text-sm font-bold text-foreground">Loading purchases...</h3>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Error: {error}</div>;
  }

  const totalValue = purchases.reduce((sum, p) => sum + (p.total ?? 0), 0);
  const totalPaid = purchases.reduce((sum, p) => sum + (p.paidAmount ?? 0), 0);
  const totalDue = purchases.reduce((sum, p) => sum + (p.dueAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Manage purchase orders and supplier payments."
        actions={
          <Button onClick={() => (showForm ? resetForm() : startCreate())}>
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Create Purchase"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard title="Total purchases" value={purchases.length} icon={ShoppingCart} iconClassName="bg-blue-50 text-blue-700" />
        <StatCard title="Total value" value={formatBDT(totalValue)} icon={Receipt} iconClassName="bg-violet-50 text-violet-700" />
        <StatCard title="Amount paid" value={formatBDT(totalPaid)} icon={PackageCheck} iconClassName="bg-emerald-50 text-emerald-700" />
        <StatCard title="Amount due" value={formatBDT(totalDue)} icon={TriangleAlert} iconClassName="bg-red-50 text-red-700" />
      </div>

      {showForm && (
        <form onSubmit={handleSavePurchase} className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground">
              {editingPurchase ? `Edit Purchase Order #${editingPurchase.invoiceNumber || editingPurchase.id}` : "New Purchase Order"}
            </h3>
            <span className="text-xs text-muted-foreground">Connected to Backend Procurement API</span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Supplier *</label>
              <select
                required
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select a supplier...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.company ? `(${s.company})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2026-001"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Product *</label>
              <select
                required
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  const prod = products.find((p) => String(p.id) === e.target.value);
                  if (prod && prod.price) setItemUnitPrice(Math.round(prod.price * 0.8));
                }}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={itemQuantity}
                onChange={(e) => setItemQuantity(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Unit Cost (৳) *</label>
              <input
                type="number"
                min="0"
                required
                value={itemUnitPrice}
                onChange={(e) => setItemUnitPrice(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">Paid Amount (৳)</label>
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1 block text-xs font-medium text-foreground">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional purchase details or payment terms"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <div className="text-sm font-semibold text-foreground">
              Total Cost: <span className="text-primary">{formatBDT(itemQuantity * itemUnitPrice)}</span>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingPurchase ? "Update Purchase" : "Save Purchase"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {purchases.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Supplier</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Paid</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Due</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">#{String(purchase.id).slice(-6)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{purchase.invoiceNumber || "-"}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{purchase.supplier?.name || `Supplier #${purchase.supplierId}`}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{formatBDT(purchase.total ?? 0)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatBDT(purchase.paidAmount ?? 0)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatBDT(purchase.dueAmount ?? 0)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{purchase.status || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{purchase.date ? new Date(purchase.date).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(purchase)}
                        title="Edit purchase"
                        aria-label={`Edit purchase ${purchase.invoiceNumber || purchase.id}`}
                      >
                        <Pencil className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => setDeletingPurchase(purchase)}
                        title="Delete purchase"
                        aria-label={`Delete purchase ${purchase.invoiceNumber || purchase.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
          <h3 className="mt-3 text-sm font-semibold text-foreground">No purchases found</h3>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deletingPurchase !== null}
        onOpenChange={(open) => !open && setDeletingPurchase(null)}
        title="Delete Purchase Order?"
        description={
          deletingPurchase
            ? `Are you sure you want to delete purchase order "${deletingPurchase.invoiceNumber || deletingPurchase.id}"? This will update supplier balances and cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleDeletePurchase()}
      />
    </div>
  );
}
