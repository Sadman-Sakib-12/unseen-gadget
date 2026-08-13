"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBDT } from "@/lib/load-dashboard-data";
import { PurchaseItem } from "@/features/purchases/types";

interface PurchaseItemsProps {
  items: PurchaseItem[];
  onChange: (items: PurchaseItem[]) => void;
}

export function PurchaseItems({ items, onChange }: PurchaseItemsProps) {
  const updateItem = (id: number, field: keyof PurchaseItem, value: string | number) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;
      const newItem = { ...item, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        newItem.total = Number(newItem.quantity) * Number(newItem.unitPrice);
      }
      return newItem;
    });
    onChange(updated);
  };

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    onChange([...items, { id: newId, productId: 0, productName: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (id: number) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                    placeholder="Product name"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-20 text-right"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                    className="w-28 text-right"
                  />
                </TableCell>
                <TableCell className="text-right font-mono text-sm tabular-nums">
                  {formatBDT(item.total)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    aria-label="Remove item"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}