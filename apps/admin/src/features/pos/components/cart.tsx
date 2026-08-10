"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PosCartItem, PosProduct } from "../types";

interface CartProps {
  items: PosCartItem[];
  products: PosProduct[];
  discount: number;
  taxRate: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onDiscountChange: (discount: number) => void;
  onTaxRateChange: (taxRate: number) => void;
  onCheckout: () => void;
}

export function Cart({
  items,
  products,
  discount,
  taxRate,
  onUpdateQuantity,
  onRemoveItem,
  onDiscountChange,
  onTaxRateChange,
  onCheckout,
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const getProduct = (productId: number) => products.find((p) => p.id === productId);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Cart ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex-1 overflow-auto space-y-2 max-h-[400px]">
          {items.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">Cart is empty</p>
          ) : (
            items.map((item) => {
              const product = getProduct(item.productId);
              return (
                <div key={item.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  {product && (
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.price.toLocaleString()} BDT</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        className="rounded p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="ml-auto rounded p-1 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()} BDT</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t pt-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Discount (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => onDiscountChange(Number(e.target.value))}
                className="w-20 rounded border border-gray-200 px-2 py-1 text-sm text-right"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Tax (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => onTaxRateChange(Number(e.target.value))}
                className="w-20 rounded border border-gray-200 px-2 py-1 text-sm text-right"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{subtotal.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="text-red-600">-{discountAmount.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span>{taxAmount.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{total.toLocaleString()} BDT</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full rounded-lg bg-black py-3 text-white font-medium hover:bg-gray-800"
            >
              Checkout
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
