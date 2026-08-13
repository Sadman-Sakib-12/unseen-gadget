export function formatBDT(value: number): string {
  return `\u09F3${value.toLocaleString("en-IN")}`;
}

export function savingsAmount(product: {
  price: number;
  originalPrice?: number;
}): number {
  return product.originalPrice != null && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;
}