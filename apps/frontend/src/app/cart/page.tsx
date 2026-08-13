"use client";

import {
  ChevronRight,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useCartStore, cartItemCount, cartSubtotal, cartSavings } from "@/features/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatBDT } from "@/components/price";
import { ImageWithFallback } from "@/components/image-with-fallback";

const cx = "mx-auto w-full max-w-[1320px] px-4";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const shownItems = hydrated ? items : [];
  const count = cartItemCount(shownItems);
  const subtotal = cartSubtotal(shownItems);
  const savings = cartSavings(shownItems);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className={`${cx} py-6`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {shownItems.length} item{shownItems.length !== 1 && "s"} in your cart
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
          >
            Continue Shopping <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {shownItems.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart items */}
            <div className="space-y-3 lg:col-span-2">
              {shownItems.map((item) => (
                <div
                  key={item.key}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                        iconSize="h-8 w-8"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {item.color && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.key)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Qty */}
                        <div className="flex items-center gap-1 rounded-full border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900">
                            {formatBDT(item.price * item.quantity)}
                          </p>
                          {item.originalPrice != null && item.originalPrice > item.price && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatBDT(item.originalPrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.originalPrice != null && item.originalPrice > item.price && (
                    <div className="flex items-center gap-1.5 border-t border-dashed border-green-100 bg-green-50 px-4 py-2">
                      <Tag className="h-3 w-3 text-green-600" />
                      <span className="text-[11px] font-medium text-green-700">
                        You&rsquo;re saving {formatBDT((item.originalPrice - item.price) * item.quantity)} on this item
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Coupon */}
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4">
                <p className="mb-2 text-xs font-semibold text-gray-700">Have a coupon?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                  <button className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="mb-4 text-sm font-bold text-gray-900">Order Summary</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Subtotal ({count} items)</span>
                      <span className="font-medium text-gray-900">
                        {formatBDT(subtotal)}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatBDT(savings)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-emerald-600">Free</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
                      <span className="text-sm font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatBDT(total)}
                      </span>
                    </div>
                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Trust row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Truck, label: "Free Delivery" },
                    { icon: Shield, label: "Secure Pay" },
                    { icon: Tag, label: "Best Price" },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 bg-white py-3 text-center"
                    >
                      <t.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-[10px] font-medium text-gray-600">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
            <ShoppingCart className="h-14 w-14 text-gray-200" />
            <h2 className="mt-4 text-lg font-bold text-gray-700">Your cart is empty</h2>
            <p className="mt-1 text-sm text-gray-400">
              Looks like you haven&rsquo;t added anything yet.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}