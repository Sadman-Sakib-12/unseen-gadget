"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { purchases } from "@/features/purchases/data";
import { Purchase } from "@/features/purchases/types";
import { PurchasesTable } from "@/features/purchases/components/purchases-table";
import { PurchaseForm } from "@/features/purchases/components/purchase-form";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchases</h1>
          <p className="text-gray-500">Manage purchase orders and supplier payments</p>
        </div>
        <Button onClick={handleAdd}>Create Purchase</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchasesTable purchases={purchases} onView={handleView} />
        </CardContent>
      </Card>

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
