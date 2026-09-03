"use client";

import { useState, useEffect, useCallback } from "react";
import { Layers, PackagePlus, PackageMinus, PackageX, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import {
  fetchInventoryItems,
  fetchStockMovements,
  createStockAdjustment,
} from "@/features/inventory/data";
import { InventoryItem, StockMovement } from "@/features/inventory/types";
import { StockTable } from "@/features/inventory/components/stock-table";
import { StockHistory } from "@/features/inventory/components/stock-history";
import { StockAdjustmentModal } from "@/features/inventory/components/stock-adjustment-modal";

interface SectionConfig {
  title: string;
  description: string;
  kind: "table" | "history" | "placeholder";
  statusFilter?: InventoryItem["status"];
  typeFilter?: StockMovement["type"];
  defaultModalType?: "IN" | "OUT" | "ADJUSTMENT";
  actionButtonLabel?: string;
  placeholderTitle?: string;
  placeholderDescription?: string;
  placeholderIcon?: LucideIcon;
}

const SECTION_CONFIG: Record<string, SectionConfig> = {
  "stock-management": {
    title: "Stock Management",
    description: "Manage stock levels, thresholds and warehouse inventory.",
    kind: "table",
    defaultModalType: "ADJUSTMENT",
    actionButtonLabel: "Adjust Stock",
  },
  "stock-in": {
    title: "Stock In",
    description: "Incoming stock movements received from suppliers and purchases.",
    kind: "history",
    typeFilter: "IN",
    defaultModalType: "IN",
    actionButtonLabel: "Record Stock In",
  },
  "stock-out": {
    title: "Stock Out",
    description: "Outgoing stock movements from customer orders, sales and dispatches.",
    kind: "history",
    typeFilter: "OUT",
    defaultModalType: "OUT",
    actionButtonLabel: "Record Stock Out",
  },
  "stock-adjustment": {
    title: "Stock Adjustment",
    description: "Manual stock count adjustments, corrections and reconciliation.",
    kind: "history",
    typeFilter: "ADJUSTMENT",
    defaultModalType: "ADJUSTMENT",
    actionButtonLabel: "Record Adjustment",
  },
  "stock-transfer": {
    title: "Stock Transfer",
    description: "Transfers of stock between warehouses and physical locations.",
    kind: "placeholder",
    placeholderTitle: "No stock transfers yet",
    placeholderDescription: "Stock transfers between warehouses will appear here.",
    placeholderIcon: Layers,
  },
  "low-stock": {
    title: "Low Stock",
    description: "Products running below their configured minimum safety stock level.",
    kind: "table",
    statusFilter: "LOW_STOCK",
    defaultModalType: "IN",
    actionButtonLabel: "Restock (Stock In)",
  },
  "out-of-stock": {
    title: "Out of Stock",
    description: "Products that are completely out of stock and require immediate replenishment.",
    kind: "table",
    statusFilter: "OUT_OF_STOCK",
    defaultModalType: "IN",
    actionButtonLabel: "Restock (Stock In)",
  },
  "damaged-stock": {
    title: "Damaged Stock",
    description: "Stock flagged as damaged, expired or defective.",
    kind: "placeholder",
    placeholderTitle: "No damaged stock",
    placeholderDescription: "Damaged or defective units will appear here.",
    placeholderIcon: PackageX,
  },
  warehouse: {
    title: "Warehouse",
    description: "Stock levels across all registered warehouses.",
    kind: "table",
    defaultModalType: "ADJUSTMENT",
    actionButtonLabel: "Adjust Stock",
  },
  "stock-history": {
    title: "Stock History",
    description: "Full chronological log of all stock movements across all products.",
    kind: "history",
    defaultModalType: "IN",
    actionButtonLabel: "Record Movement",
  },
};

export function InventorySectionPage({ section }: { section: string }) {
  const config = SECTION_CONFIG[section];
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

  if (!config) return null;

  const filteredItems = config.statusFilter
    ? items.filter((i) => i.status === config.statusFilter)
    : items;
  const filteredMovements = config.typeFilter
    ? movements.filter((m) => m.type === config.typeFilter)
    : movements;

  const getActionIcon = () => {
    if (config.defaultModalType === "IN") return <PackagePlus className="h-4 w-4" />;
    if (config.defaultModalType === "OUT") return <PackageMinus className="h-4 w-4" />;
    return <RefreshCw className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          config.actionButtonLabel ? (
            <Button
              onClick={() => {
                setSelectedItem(null);
                setShowAdjustModal(true);
              }}
            >
              {getActionIcon()}
              {config.actionButtonLabel}
            </Button>
          ) : undefined
        }
      />

      {config.kind === "table" && (
        <StockTable items={filteredItems} onAdjust={handleAdjust} />
      )}

      {config.kind === "history" && (
        <StockHistory movements={filteredMovements} />
      )}

      {config.kind === "placeholder" && (
        <EmptyState
          icon={config.placeholderIcon}
          title={config.placeholderTitle ?? ""}
          description={config.placeholderDescription ?? ""}
        />
      )}

      <StockAdjustmentModal
        key={selectedItem?.id ?? `modal-${config.defaultModalType ?? "adjust"}`}
        item={selectedItem}
        items={items}
        defaultType={config.defaultModalType ?? "IN"}
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
