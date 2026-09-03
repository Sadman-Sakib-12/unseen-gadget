/**
 * Shared formatting helpers for currency, numbers, dates, and discounts
 * across the Unseen Gadget platform (Admin, Frontend, and Backend).
 */

const BDT_FORMATTER = new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat('en-BD', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/**
 * Format numeric value to Bangladeshi Taka (৳) string (e.g. "৳1,85,000").
 */
export function formatBDT(value?: number | null): string {
  const num = typeof value === 'number' && !Number.isNaN(value) ? value : Number(value ?? 0) || 0;
  return BDT_FORMATTER.format(num);
}

/**
 * Compact currency for dense contexts, stat cards, etc. (e.g. "৳1.9Cr").
 */
export function formatBDTCompact(value?: number | null): string {
  const num = typeof value === 'number' && !Number.isNaN(value) ? value : Number(value ?? 0) || 0;
  if (Math.abs(num) < 100000) return BDT_FORMATTER.format(num);
  return `${COMPACT_NUMBER_FORMATTER.format(num)}`;
}

/**
 * Short human date for table cells and cards (e.g. "Aug 14, 2026").
 */
export function formatDate(input?: string | Date | number | null): string {
  if (!input) return '—';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Compact month + day only (e.g. "Aug 14").
 */
export function formatShortDate(input?: string | Date | number | null): string {
  if (!input) return '—';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });
}

/**
 * Date and time formatted string (e.g. "Aug 14, 2026, 3:42 PM").
 */
export function formatDateTime(input?: string | Date | number | null): string {
  if (!input) return '—';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Compact relative day ("Today", "Yesterday", or "Aug 14").
 */
export function formatRelativeDay(input?: string | Date | number | null): string {
  if (!input) return '—';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const today = new Date();
  const diffDays = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });
}

/**
 * Render an ISO date inside a modal/drawer with a muted label when invalid.
 */
export function formatDateOrDash(input?: string | Date | number | null): string {
  return input ? formatDate(input) : '—';
}

/**
 * Calculate amount saved between price and originalPrice.
 */
export function savingsAmount(product?: {
  price?: number;
  originalPrice?: number;
} | null): number {
  if (!product) return 0;
  const price = Number(product.price ?? 0);
  const orig = Number(product.originalPrice ?? 0);
  return orig > price ? orig - price : 0;
}

/**
 * Calculate discount percentage between current price and original price.
 */
export function calculateDiscountPercent(price?: number, originalPrice?: number): number {
  if (!price || !originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
