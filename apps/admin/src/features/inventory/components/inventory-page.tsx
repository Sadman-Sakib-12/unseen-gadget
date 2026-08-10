"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inventoryItems, stockMovements } from "@/features/inventory/data";
import { InventoryItem } from "@/features/inventory/types";
import { StockTable } from "@/features/inventory/components/stock-table";
import { StockAdjustmentModal } from "@/features/inventory/components/stock-adjustment-modal";
import { StockHistory } from "@/features/inventory/components/stock-history";

export function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const inStock = inventoryItems.filter((i) => i.status === "IN_STOCK").length;
  const lowStock = inventoryItems.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStock = inventoryItems.filter((i) => i.status === "OUT_OF_STOCK").length;

  const handleAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
  };

  const handleSaveAdjustment = (itemId: number, quantity: number, reason: string) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item) {
      item.stock += quantity;
      if (item.stock <= 0) item.status = "OUT_OF_STOCK";
      else if (item.stock < item.minStock) item.status = "LOW_STOCK";
      else item.status = "IN_STOCK";
      item.lastRestocked = new Date().toISOString().split("T")[0];
      console.log("Adjustment reason:", reason);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-500">Manage stock levels and warehouse inventory</p>
        </div>
        <Button onClick={() => alert("Add product feature coming soon")}>Add Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inStock}</div>
            <p className="text-xs text-gray-500">{Math.round((inStock / inventoryItems.length) * 100)}% of total products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStock}</div>
            <p className="text-xs text-gray-500">Below minimum threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
            <p className="text-xs text-gray-500">Immediate restock required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <StockTable items={inventoryItems} onAdjust={handleAdjust} />
        </CardContent>
      </Card>

      <StockHistory movements={stockMovements} />

      <StockAdjustmentModal
        item={selectedItem}
        open={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveAdjustment}
      />
    </div>
  );
}
