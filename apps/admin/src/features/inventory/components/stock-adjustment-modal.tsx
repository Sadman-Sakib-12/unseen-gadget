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
  open: boolean;
  onClose: () => void;
  onSave: (itemId: number, quantity: number, reason: string) => void;
}

export function StockAdjustmentModal({ item, open, onClose, onSave }: StockAdjustmentModalProps) {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  const handleSave = () => {
    if (!item) return;
    onSave(item.id, quantity, reason);
    setQuantity(0);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open && item !== null} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>Adjust Stock</DialogTitle>
        {item ? <DialogDescription>{item.name}</DialogDescription> : null}
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          {item ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5">
                <p className="text-gray-500">Current Stock</p>
                <p className="mt-0.5 text-lg font-semibold text-gray-900">{item.stock}</p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3.5">
                <p className="text-gray-500">Min Stock</p>
                <p className="mt-0.5 text-lg font-semibold text-gray-900">{item.minStock}</p>
              </div>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Quantity Change
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Use negative for reduction"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Enter adjustment reason..."
            />
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Adjustment</Button>
      </DialogFooter>
    </Dialog>
  );
}