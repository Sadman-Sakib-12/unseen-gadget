"use client";

import { useState } from "react";
import { Layers, PackageX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { inventoryItems, stockMovements } from "@/features/inventory/data";
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
  placeholderTitle?: string;
  placeholderDescription?: string;
  placeholderIcon?: LucideIcon;
}

const SECTION_CONFIG: Record<string, SectionConfig> = {
  "stock-management": {
    title: "Stock Management",
    description: "Manage stock levels and warehouse inventory.",
    kind: "table",
  },
  "stock-in": {
    title: "Stock In",
    description: "Incoming stock movements received from suppliers.",
    kind: "history",
    typeFilter: "IN",
  },
  "stock-out": {
    title: "Stock Out",
    description: "Outgoing stock movements from sales and dispatches.",
    kind: "history",
    typeFilter: "OUT",
  },
  "stock-adjustment": {
    title: "Stock Adjustment",
    description: "Manual stock adjustments and count corrections.",
    kind: "history",
    typeFilter: "ADJUSTMENT",
  },
  "stock-transfer": {
    title: "Stock Transfer",
    description: "Transfers of stock between warehouses and locations.",
    kind: "placeholder",
    placeholderTitle: "No stock transfers yet",
    placeholderDescription: "Stock transfers between warehouses will appear here.",
    placeholderIcon: Layers,
  },
  "low-stock": {
    title: "Low Stock",
    description: "Products running below their minimum stock level.",
    kind: "table",
    statusFilter: "LOW_STOCK",
  },
  "out-of-stock": {
    title: "Out of Stock",
    description: "Products that are currently out of stock.",
    kind: "table",
    statusFilter: "OUT_OF_STOCK",
  },
  "damaged-stock": {
    title: "Damaged Stock",
    description: "Stock flagged as damaged or defective.",
    kind: "placeholder",
    placeholderTitle: "No damaged stock",
    placeholderDescription: "Damaged or defective units will appear here.",
    placeholderIcon: PackageX,
  },
  warehouse: {
    title: "Warehouse",
    description: "Stock levels across all warehouses.",
    kind: "table",
  },
  "stock-history": {
    title: "Stock History",
    description: "Full history of stock movements across all products.",
    kind: "history",
  },
};

export function InventorySectionPage({ section }: { section: string }) {
  const config = SECTION_CONFIG[section];
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

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

  if (!config) return null;

  const items = config.statusFilter
    ? inventoryItems.filter((i) => i.status === config.statusFilter)
    : inventoryItems;
  const movements = config.typeFilter
    ? stockMovements.filter((m) => m.type === config.typeFilter)
    : stockMovements;

  return (
    <div className="space-y-6">
      <PageHeader title={config.title} description={config.description} />

      {config.kind === "table" && <StockTable items={items} onAdjust={handleAdjust} />}

      {config.kind === "history" && <StockHistory movements={movements} />}

      {config.kind === "placeholder" && (
        <EmptyState
          icon={config.placeholderIcon}
          title={config.placeholderTitle ?? ""}
          description={config.placeholderDescription ?? ""}
        />
      )}

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