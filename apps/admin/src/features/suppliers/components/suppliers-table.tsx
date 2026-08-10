"use client";

import { Supplier } from "@/features/suppliers/types";
import { Badge } from "@/components/ui/badge";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
}

export function SuppliersTable({ suppliers, onEdit }: SuppliersTableProps) {
  const totalDue = suppliers.reduce((sum, s) => sum + s.dueAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Total Due: <span className="font-semibold text-red-600">BDT {totalDue.toLocaleString()}</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Total Purchases</th>
              <th className="px-4 py-3 text-right">Due Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-xs text-gray-500">{supplier.address}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{supplier.company}</td>
                <td className="px-4 py-3 text-gray-500">{supplier.phone}</td>
                <td className="px-4 py-3 text-gray-500">{supplier.email}</td>
                <td className="px-4 py-3 text-right font-mono">BDT {supplier.totalPurchases.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono">
                  <span className={supplier.dueAmount > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                    BDT {supplier.dueAmount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={supplier.status === "ACTIVE" ? "success" : "secondary"}>
                    {supplier.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
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
