"use client";

import { StockMovement } from "@/features/inventory/types";
import { Badge } from "@/components/ui/badge";

interface StockHistoryProps {
  movements: StockMovement[];
}

const typeColors: Record<string, "success" | "destructive" | "secondary"> = {
  IN: "success",
  OUT: "destructive",
  ADJUSTMENT: "secondary",
};

export function StockHistory({ movements }: StockHistoryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold">Stock Movement History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{movement.date}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{movement.productName}</td>
                <td className="px-4 py-3">
                  <Badge variant={typeColors[movement.type]}>{movement.type}</Badge>
                </td>
                <td className={`px-4 py-3 text-right font-mono ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                  {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                </td>
                <td className="px-4 py-3 text-gray-500">{movement.reference}</td>
                <td className="px-4 py-3 text-gray-500">{movement.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
