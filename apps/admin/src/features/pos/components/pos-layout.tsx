"use client";

import { useState, useMemo } from "react";
import { LayoutDashboard } from "lucide-react";
import { ProductSearch } from "./product-search";
import { Cart } from "./cart";
import { PaymentModal } from "./payment-modal";
import { ReceiptModal } from "./receipt-modal";
import allProducts from "@/features/pos/data/products.json";
import posSession from "@/features/pos/data/pos-session.json";
import type { PosProduct, PosCartItem } from "../types";

export function PosLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<PosCartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderId, setOrderId] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    const query = searchQuery.toLowerCase();
    return allProducts.filter(
      (p: PosProduct) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.barcode.includes(query)
    );
  }, [searchQuery]);

  const addToCart = (product: PosProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: item.price * (item.quantity + 1) }
            : item
        );
      }
      const newItem: PosCartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
        tax: 0,
        total: product.price,
      };
      return [...prev, newItem];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleCheckout = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentConfirm = (method: string) => {
    setPaymentMethod(method);
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    setIsPaymentOpen(false);
    setIsReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setCartItems([]);
    setDiscount(0);
    setTaxRate(5);
    setPaymentMethod("");
    setOrderId("");
    setIsReceiptOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-gray-500">Session: {posSession.id} | Cash in Hand: {posSession.cashInHand.toLocaleString()} BDT</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
          <LayoutDashboard className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">POS Active</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBarcodeScan={() => setSearchQuery("")}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product: PosProduct) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="rounded-lg border border-gray-200 bg-white p-3 text-left hover:border-black transition-colors"
              >
                <div className="aspect-square rounded-lg bg-gray-100 mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">{product.price.toLocaleString()} BDT</span>
                  <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Cart
            items={cartItems}
            products={allProducts}
            discount={discount}
            taxRate={taxRate}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onDiscountChange={setDiscount}
            onTaxRateChange={setTaxRate}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        total={total}
        onConfirm={handlePaymentConfirm}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleReceiptClose}
        items={cartItems}
        paymentMethod={paymentMethod}
        subtotal={subtotal}
        discount={discountAmount}
        tax={taxAmount}
        total={total}
        orderId={orderId}
      />
    </div>
  );
}
