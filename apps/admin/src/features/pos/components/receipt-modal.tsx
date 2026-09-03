"use client";

import { Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatBDT } from "@/lib/load-dashboard-data";
import type { PosCartItem } from "../types";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PosCartItem[];
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export function ReceiptModal({
  isOpen,
  onClose,
  items,
  paymentMethod,
  subtotal,
  discount,
  tax,
  total,
  orderId,
  customerName,
  customerPhone,
  customerAddress,
}: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader close>
        <DialogTitle>Receipt</DialogTitle>
        <DialogDescription>{orderId}</DialogDescription>
      </DialogHeader>
      <DialogContent>
        <div className="space-y-4">
          <div className="border-b pb-4 text-center">
            <h2 className="text-xl font-bold text-gray-900">Unseen Gadget</h2>
            <p className="text-sm text-gray-500">{customerAddress || "Main Outlet, Dhaka, Bangladesh"}</p>
            <p className="text-sm text-gray-500">+880 1823-388272</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-500">Receipt No</p>
              <p className="font-semibold text-gray-900">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-semibold text-gray-900">{customerName || "Walk-in Customer"}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-semibold text-gray-900">{customerPhone || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-500">Cashier</p>
              <p className="font-semibold text-gray-900">Admin</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <Badge variant="success" className="capitalize text-[10px]">
                {paymentMethod}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left font-medium text-gray-500">Item</th>
                  <th className="pb-2 text-right font-medium text-gray-500">Qty</th>
                  <th className="pb-2 text-right font-medium text-gray-500">Price</th>
                  <th className="pb-2 text-right font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{item.name}</td>
                    <td className="py-2 text-right text-gray-900">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-600">{formatBDT(item.price)}</td>
                    <td className="py-2 text-right text-gray-900">
                      {formatBDT(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-1 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span className="text-red-600">-{formatBDT(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">{formatBDT(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatBDT(total)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
            Thank you for shopping with us!
          </div>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="button" variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button type="button" onClick={onClose}>
          New Sale
        </Button>
      </DialogFooter>
    </Dialog>
  );
}