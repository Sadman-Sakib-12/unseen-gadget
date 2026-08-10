"use client";

import { InventoryItem } from "@/features/inventory/types";
import { Badge } from "@/components/ui/badge";

interface StockTableProps {
  items: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
}

const statusVariants: Record<string, "default" | "destructive" | "secondary" | "success" | "warning"> = {
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "destructive",
};

export function StockTable({ items, onAdjust }: StockTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Warehouse</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-right">Min</th>
            <th className="px-4 py-3 text-right">Max</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Last Restocked</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="bg-white hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
              <td className="px-4 py-3 text-gray-500">{item.sku}</td>
              <td className="px-4 py-3 text-gray-500">{item.warehouse}</td>
              <td className="px-4 py-3 text-right font-mono">{item.stock}</td>
              <td className="px-4 py-3 text-right text-gray-500">{item.minStock}</td>
              <td className="px-4 py-3 text-right text-gray-500">{item.maxStock}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariants[item.status]}>{item.status.replace("_", " ")}</Badge>
              </td>
              <td className="px-4 py-3 text-right text-gray-500">{item.lastRestocked}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onAdjust(item)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Adjust
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
