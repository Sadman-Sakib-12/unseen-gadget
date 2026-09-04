export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  color?: string;
  variantName?: string;
  image?: string;
  quantity: number;
  shippingType?: "FREE" | "PAID";
  shippingCost?: number;
}

export function normalizeCartItem(raw: any): CartItem {
  return {
    id: String(raw.id || raw.key || raw.productId),
    productId: String(raw.productId || raw.product?.id || raw.id),
    variantId: raw.variantId ? String(raw.variantId) : undefined,
    name: raw.productName || raw.product?.name || raw.name || "Product",
    slug: raw.productSlug || raw.product?.slug || raw.slug || "",
    price: Number(raw.price ?? raw.product?.price ?? 0),
    originalPrice: raw.originalPrice ?? raw.product?.originalPrice,
    color: raw.color || raw.variantName,
    variantName: raw.variantName,
    image: raw.image || raw.product?.images?.[0] || raw.product?.image || "",
    quantity: Number(raw.quantity ?? 1),
    shippingType: raw.shippingType || raw.product?.shippingType || "FREE",
    shippingCost: Number(raw.shippingCost ?? raw.product?.shippingCost ?? 0),
  };
}

export type DeliveryZone = "inside-dhaka" | "outside-dhaka";

export function calculateOrderShipping(
  items: Array<{ productId: string; shippingType?: string; shippingCost?: number }>,
  zone: DeliveryZone = "inside-dhaka"
): number {
  const isPaid = items.some(
    (item) => item.shippingType === "PAID" || (item.shippingCost ?? 0) > 0
  );
  if (!isPaid && items.length > 0 && items.every((i) => i.shippingType === "FREE")) {
    return 0;
  }

  const uniqueProductShippingMap = new Map<string, number>();
  for (const item of items) {
    if (item.shippingType === "PAID" && (item.shippingCost ?? 0) > 0) {
      uniqueProductShippingMap.set(item.productId, item.shippingCost!);
    }
  }

  const baseCost = Array.from(uniqueProductShippingMap.values()).reduce(
    (sum, cost) => sum + cost,
    0
  );

  if (baseCost === 0 && !isPaid) {
    return 0;
  }

  // Inside Dhaka: base product cost (or standard 60)
  // Outside Dhaka: base product cost + 50 (or standard 120)
  if (zone === "outside-dhaka") {
    return baseCost > 0 ? baseCost + 50 : 120;
  }

  return baseCost > 0 ? baseCost : 60;
}
