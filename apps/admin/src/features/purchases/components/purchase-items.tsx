"use client";

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
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2 text-right">Qty</th>
              <th className="px-3 py-2 text-right">Unit Price</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="bg-white">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                    placeholder="Product name"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                    className="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  />
                </td>
                <td className="px-3 py-2 text-right font-mono text-sm">
                  BDT {item.total.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={items.length === 1}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addItem}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Item
      </button>
    </div>
  );
}
