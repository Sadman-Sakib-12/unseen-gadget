"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Layers,
  PackagePlus,
  PackageX,
  TriangleAlert,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
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
    void reason;
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item) {
      item.stock += quantity;
      if (item.stock <= 0) item.status = "OUT_OF_STOCK";
      else if (item.stock < item.minStock) item.status = "LOW_STOCK";
      else item.status = "IN_STOCK";
      item.lastRestocked = new Date().toISOString().split("T")[0];
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage stock levels and warehouse inventory."
        actions={
          <Link href="/products" className={buttonVariants({})}>
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total SKUs"
          value={inventoryItems.length}
          icon={Layers}
          iconClassName="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="In stock"
          value={inStock}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Low stock"
          value={lowStock}
          icon={TriangleAlert}
          iconClassName="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Out of stock"
          value={outOfStock}
          icon={PackageX}
          iconClassName="bg-red-50 text-red-700"
        />
      </div>

      <StockTable items={inventoryItems} onAdjust={handleAdjust} />

      <StockHistory movements={stockMovements} />

      <StockAdjustmentModal
        key={selectedItem?.id ?? "adjust"}
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