"use client";

import { Purchase } from "@/features/purchases/types";
import { Badge } from "@/components/ui/badge";

interface PurchasesTableProps {
  purchases: Purchase[];
  onView: (purchase: Purchase) => void;
}

const statusVariants: Record<string, "default" | "secondary" | "success" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  PENDING: "outline",
  RECEIVED: "success",
  CANCELLED: "destructive",
};

export function PurchasesTable({ purchases, onView }: PurchasesTableProps) {
  const totalDue = purchases.reduce((sum, p) => sum + p.dueAmount, 0);
  const totalPaid = purchases.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Total Paid: <span className="font-semibold text-green-600">BDT {totalPaid.toLocaleString()}</span>
          {" "} | Total Due: <span className="font-semibold text-red-600">BDT {totalDue.toLocaleString()}</span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
              <th className="px-4 py-3 text-right">Discount</th>
              <th className="px-4 py-3 text-right">Tax</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Paid</th>
              <th className="px-4 py-3 text-right">Due</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{purchase.invoiceNumber}</td>
                <td className="px-4 py-3 text-gray-700">{purchase.supplierName}</td>
                <td className="px-4 py-3 text-gray-500">{purchase.date}</td>
                <td className="px-4 py-3 text-right font-mono">BDT {purchase.subtotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono text-red-500">BDT {purchase.discount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono">BDT {purchase.tax.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono font-medium">BDT {purchase.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono text-green-600">{purchase.paidAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className={purchase.dueAmount > 0 ? "text-red-600 font-medium" : "text-gray-500"}>
                    BDT {purchase.dueAmount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariants[purchase.status]}>{purchase.status}</Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onView(purchase)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
