"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InventoryItem } from "@/features/inventory/types";

interface StockAdjustmentModalProps {
  item: InventoryItem | null;
  items?: InventoryItem[];
  defaultType?: "IN" | "OUT" | "ADJUSTMENT";
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    itemId?: string;
    productId: string;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    reason: string;
    reference?: string;
  }) => Promise<void> | void;
}

export function StockAdjustmentModal({
  item,
  items = [],
  defaultType = "IN",
  open,
  onClose,
  onSave,
}: StockAdjustmentModalProps) {
  const initialProductId = item ? (item.productId || item.id) : (items.length > 0 ? (items[0].productId || items[0].id) : "");
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [type, setType] = useState<"IN" | "OUT" | "ADJUSTMENT">(defaultType);
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prevItem, setPrevItem] = useState(item);
  const [prevOpen, setPrevOpen] = useState(open);

  if (item !== prevItem || open !== prevOpen) {
    setPrevItem(item);
    setPrevOpen(open);
    setSelectedProductId(item ? (item.productId || item.id) : (items.length > 0 ? (items[0].productId || items[0].id) : ""));
    setType(defaultType);
    setQuantity(1);
    setReference("");
    setReason("");
  }

  const activeItem = item || items.find((i) => (i.productId || i.id) === selectedProductId);

  const handleSave = async () => {
    const targetProductId = activeItem?.productId || activeItem?.id || selectedProductId;
    if (!targetProductId || quantity <= 0) return;

    setIsSubmitting(true);
    try {
      await onSave({
        itemId: activeItem?.id,
        productId: targetProductId,
        type,
        quantity: Math.abs(quantity),
        reason: reason.trim() || (type === "IN" ? "Stock In Received" : type === "OUT" ? "Stock Out Dispatched" : "Stock Count Adjusted"),
        reference: reference.trim() || undefined,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>
          {type === "IN"
            ? "Record Stock In"
            : type === "OUT"
              ? "Record Stock Out"
              : "Adjust Stock"}
        </DialogTitle>
        <DialogDescription>
          {activeItem ? activeItem.name : "Select a product and record stock movement"}
        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          {/* Movement Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Movement Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType("IN")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                  type === "IN"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                + Stock In (Add)
              </button>
              <button
                type="button"
                onClick={() => setType("OUT")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                  type === "OUT"
                    ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                - Stock Out (Deduct)
              </button>
              <button
                type="button"
                onClick={() => setType("ADJUSTMENT")}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                  type === "ADJUSTMENT"
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                }`}
              >
                ± Set Target Stock
              </button>
            </div>
          </div>

          {/* Product Select if item not fixed */}
          {!item && items.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
              >
                {items.map((i) => (
                  <option key={i.id || i.productId} value={i.productId || i.id}>
                    {i.name} (SKU: {i.sku} | Stock: {i.stock})
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeItem && (
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-xs dark:border-gray-800 dark:bg-gray-900/50">
              <div>
                <p className="text-gray-500">Current Stock</p>
                <p className="mt-0.5 text-base font-bold text-gray-900 dark:text-gray-100">{activeItem.stock}</p>
              </div>
              <div>
                <p className="text-gray-500">Min Level</p>
                <p className="mt-0.5 text-base font-bold text-gray-900 dark:text-gray-100">{activeItem.minStock}</p>
              </div>
              <div>
                <p className="text-gray-500">New Result</p>
                <p className="mt-0.5 text-base font-bold text-primary">
                  {type === "IN"
                    ? activeItem.stock + Number(quantity || 0)
                    : type === "OUT"
                      ? Math.max(0, activeItem.stock - Number(quantity || 0))
                      : Number(quantity || 0)}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {type === "ADJUSTMENT" ? "New Exact Stock" : "Quantity"} *
              </label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="Quantity"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">Reference / Invoice #</label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. PO-1024 or INV-008"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">Note / Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="Enter note or reason for stock movement..."
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Movement"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}