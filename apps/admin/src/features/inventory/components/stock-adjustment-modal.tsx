"use client";

import { useState } from "react";
import { InventoryItem } from "@/features/inventory/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StockAdjustmentModalProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (itemId: number, quantity: number, reason: string) => void;
}

export function StockAdjustmentModal({ item, open, onClose, onSave }: StockAdjustmentModalProps) {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");

  if (!open || !item) return null;

  const handleSave = () => {
    onSave(item.id, quantity, reason);
    setQuantity(0);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Adjust Stock - {item.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Current Stock</span>
              <p className="font-medium">{item.stock}</p>
            </div>
            <div>
              <span className="text-gray-500">Min Stock</span>
              <p className="font-medium">{item.minStock}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Change</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Use negative for reduction"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              placeholder="Enter adjustment reason..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Adjustment</Button>
        </div>
      </div>
    </div>
  );
}
