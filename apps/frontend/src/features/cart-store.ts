"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockProduct } from "@/components/product-types";

export interface CartItem {
  key: string;
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  color?: string;
  image?: string;
  quantity: number;
  inStock?: boolean;
}

export function cartItemKey(productId: number, color?: string): string {
  return `${productId}:${color ?? "default"}`;
}

interface CartState {
  items: CartItem[];
  addItem: (product: MockProduct, quantity?: number, color?: string) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1, color) =>
        set((state) => {
          const key = cartItemKey(product.id, color);
          const existing = state.items.find((item) => item.key === key);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          const item: CartItem = {
            key,
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            color,
            image: product.image,
            quantity,
            inStock: product.inStock !== false,
          };
          return { items: [...state.items, item] };
        }),
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "unseen-gadget-cart" }
  )
);

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartSavings(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    if (item.originalPrice != null && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
}