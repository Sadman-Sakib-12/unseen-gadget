"use client";

import { useState } from "react";
import { PackageCheck, Plus, Receipt, ShoppingCart, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { purchases } from "@/features/purchases/data";
import { Purchase } from "@/features/purchases/types";
import { PurchasesTable } from "@/features/purchases/components/purchases-table";
import { PurchaseForm } from "@/features/purchases/components/purchase-form";
import { formatBDT } from "@/lib/load-dashboard-data";

export function PurchasesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | undefined>();

  const handleSave = (purchaseData: Omit<Purchase, "id">) => {
    if (editingPurchase) {
      const idx = purchases.findIndex((p) => p.id === editingPurchase.id);
      if (idx >= 0) {
        purchases[idx] = { ...purchaseData, id: editingPurchase.id };
      }
    } else {
      const newId = Math.max(...purchases.map((p) => p.id), 0) + 1;
      purchases.push({ ...purchaseData, id: newId });
    }
    setShowForm(false);
    setEditingPurchase(undefined);
  };

  const handleView = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPurchase(undefined);
    setShowForm(true);
  };

  const totalValue = purchases.reduce((sum, p) => sum + p.total, 0);
  const totalPaid = purchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalDue = purchases.reduce((sum, p) => sum + p.dueAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Manage purchase orders and supplier payments."
        actions={
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Create Purchase
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total purchases"
          value={purchases.length}
          icon={ShoppingCart}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Total value"
          value={formatBDT(totalValue)}
          icon={Receipt}
          iconClassName="bg-violet-50 text-violet-700"
        />
        <StatCard
          title="Amount paid"
          value={formatBDT(totalPaid)}
          icon={PackageCheck}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Amount due"
          value={formatBDT(totalDue)}
          icon={TriangleAlert}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      <PurchasesTable purchases={purchases} onView={handleView} />

      <PurchaseForm
        key={editingPurchase?.id || "new"}
        purchase={editingPurchase}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPurchase(undefined);
        }}
        onSave={handleSave}
      />
    </div>
  );
}