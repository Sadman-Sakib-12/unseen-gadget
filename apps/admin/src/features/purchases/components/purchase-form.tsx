"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Purchase, PurchaseItem } from "@/features/purchases/types";
import { suppliers } from "@/features/suppliers/data";
import { PurchaseItems } from "@/features/purchases/components/purchase-items";
import { formatBDT } from "@/lib/load-dashboard-data";

interface PurchaseFormProps {
  purchase?: Purchase;
  open: boolean;
  onClose: () => void;
  onSave: (purchase: Omit<Purchase, "id">) => void;
}

let invoiceSeq = 0;
function nextInvoiceNumber(): string {
  invoiceSeq += 1;
  return `PO-2025-${String(invoiceSeq).padStart(3, "0")}`;
}

export function PurchaseForm({ purchase, open, onClose, onSave }: PurchaseFormProps) {
  const [supplierId, setSupplierId] = useState(purchase?.supplierId || 0);
  const [items, setItems] = useState<PurchaseItem[]>(purchase?.items || []);
  const [discount, setDiscount] = useState(purchase?.discount || 0);
  const [tax, setTax] = useState(purchase?.tax || 0);
  const [paidAmount, setPaidAmount] = useState(purchase?.paidAmount || 0);
  const [status, setStatus] = useState<Purchase["status"]>(purchase?.status || "DRAFT");

  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount + tax;
  const dueAmount = total - paidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;
    const invoiceNumber = purchase?.invoiceNumber || nextInvoiceNumber();
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
      invoiceNumber,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose} className="max-w-3xl">
      <DialogHeader close>
        <DialogTitle>{purchase ? "Edit Purchase" : "Create Purchase"}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <form id="purchase-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <Select
                value={String(supplierId)}
                onChange={(e) => setSupplierId(Number(e.target.value))}
                options={[
                  { value: "0", label: "Select supplier" },
                  ...suppliers.map((s) => ({
                    value: String(s.id),
                    label: `${s.name} - ${s.company}`,
                  })),
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as Purchase["status"])}
                options={[
                  { value: "DRAFT", label: "Draft" },
                  { value: "PENDING", label: "Pending" },
                  { value: "RECEIVED", label: "Received" },
                  { value: "CANCELLED", label: "Cancelled" },
                ]}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Items</label>
            <PurchaseItems items={items} onChange={setItems} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Discount (BDT)
              </label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Tax (BDT)</label>
              <Input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Paid Amount (BDT)
              </label>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-md border border-gray-100 bg-gray-50/50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium text-red-600">{formatBDT(discount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium text-gray-900">{formatBDT(tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatBDT(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Due Amount</span>
              <span
                className={dueAmount > 0 ? "font-medium text-red-600" : "font-medium text-green-600"}
              >
                {formatBDT(dueAmount)}
              </span>
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="purchase-form">
          {purchase ? "Update" : "Create"} Purchase
        </Button>
      </DialogFooter>
    </Dialog>
  );
}