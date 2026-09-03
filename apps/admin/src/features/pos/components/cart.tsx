"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatBDT } from "@/lib/load-dashboard-data";
import type { PosCartItem, PosProduct } from "../types";

interface CartProps {
  items: PosCartItem[];
  products: PosProduct[];
  discount: number;
  taxRate: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  onCustomerNameChange: (val: string) => void;
  onCustomerPhoneChange: (val: string) => void;
  onCustomerAddressChange: (val: string) => void;
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
  customerName,
  customerPhone,
  customerAddress,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onCustomerAddressChange,
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
      <CardHeader className="border-b border-gray-100 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-gray-500" />
          Cart ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="max-h-[400px] flex-1 space-y-2 overflow-auto">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Cart is empty"
              description="Click a product to add it to the current sale."
            />
          ) : (
            items.map((item) => {
              const product = getProduct(item.productId);
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                >
                  {product && (
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatBDT(item.price)}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onRemoveItem(item.productId)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-gray-900">
                    {formatBDT(item.price * item.quantity)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="space-y-2 rounded-lg bg-gray-50 p-3 border border-gray-100 text-xs">
              <p className="font-semibold text-gray-700">Customer & Store Info</p>
              <div>
                <label className="block text-[11px] text-gray-500 mb-0.5">Customer Name</label>
                <Input
                  type="text"
                  placeholder="Walk-in Customer"
                  value={customerName}
                  onChange={(e) => onCustomerNameChange(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-0.5">Phone Number</label>
                  <Input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => onCustomerPhoneChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-0.5">Store / Location</label>
                  <Input
                    type="text"
                    placeholder="Main Outlet, Dhaka"
                    value={customerAddress}
                    onChange={(e) => onCustomerAddressChange(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Discount (%)</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => onDiscountChange(Number(e.target.value))}
                className="h-8 w-20 text-right"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-500">Tax (%)</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => onTaxRateChange(Number(e.target.value))}
                className="h-8 w-20 text-right"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="tabular-nums text-gray-900">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="tabular-nums text-red-600">-{formatBDT(discountAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="tabular-nums text-gray-900">{formatBDT(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="tabular-nums text-gray-900">{formatBDT(total)}</span>
            </div>
            <Button type="button" className="w-full" size="lg" onClick={onCheckout}>
              Checkout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}