"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Layers,
  PackagePlus,
  PackageX,
  TriangleAlert,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import {
  fetchInventoryItems,
  fetchStockMovements,
  createStockAdjustment,
} from "@/features/inventory/data";
import { InventoryItem, StockMovement } from "@/features/inventory/types";
import { StockTable } from "@/features/inventory/components/stock-table";
import { StockAdjustmentModal } from "@/features/inventory/components/stock-adjustment-modal";
import { StockHistory } from "@/features/inventory/components/stock-history";

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [inventoryData, movementsData] = await Promise.all([
        fetchInventoryItems(),
        fetchStockMovements(),
      ]);
      setItems(inventoryData);
      setMovements(movementsData);
    } catch (e) {
      console.error("Failed to load inventory data:", e);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [inventoryData, movementsData] = await Promise.all([
          fetchInventoryItems(),
          fetchStockMovements(),
        ]);
        if (!ignore) {
          setItems(inventoryData);
          setMovements(movementsData);
        }
      } catch (e) {
        console.error("Failed to load inventory data:", e);
      }
    }
    void init();
    return () => {
      ignore = true;
    };
  }, []);

  const inStock = items.filter((i) => i.status === "IN_STOCK").length;
  const lowStock = items.filter((i) => i.status === "LOW_STOCK").length;
  const outOfStock = items.filter((i) => i.status === "OUT_OF_STOCK").length;

  const handleAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
  };

  const handleSaveAdjustment = async (data: {
    itemId?: string;
    productId: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    reason: string;
    reference?: string;
  }) => {
    try {
      await createStockAdjustment({
        productId: data.productId,
        type: data.type,
        quantity: data.quantity,
        note: data.reason,
        reference: data.reference,
      });
      toast.success(
        data.type === "IN"
          ? "Stock in recorded successfully"
          : data.type === "OUT"
            ? "Stock out recorded successfully"
            : "Stock adjusted successfully"
      );
      await loadData();
    } catch (e: unknown) {
      const err = e as { error?: string; message?: string };
      toast.error(err.error || err.message || "Failed to record stock movement");
      throw e;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage stock levels and warehouse inventory."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedItem(null);
                setShowAdjustModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Record Movement
            </Button>
            <Link href="/products" className={buttonVariants({})}>
              <PackagePlus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total SKUs"
          value={items.length}
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

      <StockTable items={items} onAdjust={handleAdjust} />

      <StockHistory movements={movements} />

      <StockAdjustmentModal
        key={selectedItem?.id ?? "adjust"}
        item={selectedItem}
        items={items}
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
