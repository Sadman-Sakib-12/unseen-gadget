"use client";

import { useState, useRef } from "react";
import { Purchase, PurchaseItem } from "@/features/purchases/types";
import { suppliers } from "@/features/suppliers/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PurchaseItems } from "@/features/purchases/components/purchase-items";

interface PurchaseFormProps {
  purchase?: Purchase;
  open: boolean;
  onClose: () => void;
  onSave: (purchase: Omit<Purchase, "id">) => void;
}

export function PurchaseForm({ purchase, open, onClose, onSave }: PurchaseFormProps) {
  const [supplierId, setSupplierId] = useState(purchase?.supplierId || 0);
  const [items, setItems] = useState<PurchaseItem[]>(purchase?.items || []);
  const [discount, setDiscount] = useState(purchase?.discount || 0);
  const [tax, setTax] = useState(purchase?.tax || 0);
  const [paidAmount, setPaidAmount] = useState(purchase?.paidAmount || 0);
  const [status, setStatus] = useState<Purchase["status"]>(purchase?.status || "DRAFT");
  const invoiceRef = useRef<string>(purchase?.invoiceNumber || `PO-2025-${String(Date.now()).slice(-6)}`);

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount + tax;
  const dueAmount = total - paidAmount;

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    onSave({
      supplierId,
      supplierName: selectedSupplier.name,
      items,
      subtotal,
      discount,
      tax,
      total,
      paidAmount,
      dueAmount,
      status,
      date: new Date().toISOString().split("T")[0],
      invoiceNumber: invoiceRef.current,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{purchase ? "Edit Purchase" : "Create Purchase"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value))}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                required
              >
                <option value={0}>Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} - {s.company}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Purchase["status"])}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="RECEIVED">Received</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Items</label>
            <PurchaseItems items={items} onChange={setItems} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (BDT)</label>
              <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax (BDT)</label>
              <Input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (BDT)</label>
              <Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">BDT {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium text-red-600">BDT {discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium">BDT {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span>Total</span>
              <span>BDT {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Due Amount</span>
              <span className={dueAmount > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                BDT {dueAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{purchase ? "Update" : "Create"} Purchase</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
