"use client";

import { Printer, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
}: ReceiptModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Receipt</CardTitle>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="rounded p-2 hover:bg-gray-100">
              <Printer className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold">Unseen Gadget</h2>
              <p className="text-sm text-gray-500">123 Tech Street, Dhaka, Bangladesh</p>
              <p className="text-sm text-gray-500">+880 1234-567890</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Receipt No</p>
                <p className="font-medium">{orderId}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Cashier</p>
                <p className="font-medium">Admin</p>
              </div>
              <div>
                <p className="text-gray-500">Payment</p>
                <Badge variant="success" className="capitalize">{paymentMethod}</Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left">Item</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{item.price.toLocaleString()}</td>
                      <td className="py-2 text-right">{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{subtotal.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="text-red-600">-{discount.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>{tax.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{total.toLocaleString()} BDT</span>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 pt-4 border-t">
              Thank you for shopping with us!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
