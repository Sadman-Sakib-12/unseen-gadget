/** Shared formatting helpers so dates, money, and identifiers render identically
 *  across every admin table, card, and modal. */

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

/** "৳1,85,000" — BDT with en-BD digit grouping (lakh/crore). */
export const formatBDT = (amount: number): string => BDT_FORMATTER.format(amount);

/** Compact money for dense contexts, e.g. "৳1.9Cr". */
export const formatBDTCompact = (amount: number): string => {
  if (Math.abs(amount) < 100000) return BDT_FORMATTER.format(amount);
  return `${COMPACT_NUMBER_FORMATTER.format(amount)}`;
};

/** "Aug 14, 2026" — short human date for table cells. */
export const formatDate = (input: string | Date | number): string => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** "Aug 14, 2026" — month + day only, for compact ranges/rows. */
export const formatShortDate = (input: string | Date | number): string => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });
};

/** "Aug 14, 2026, 3:42 PM" — for detail views and drawers. */
export const formatDateTime = (input: string | Date | number): string => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleString('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/** Compact "Aug 14" for timeline/feed rows where the year is obvious. */
export const formatRelativeDay = (input: string | Date | number): string => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return String(input);
  const today = new Date();
  const diffDays = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short' });
};

/** Render an ISO date inside a modal/drawer with a muted label when invalid. */
export const formatDateOrDash = (input: string | Date | number | null | undefined): string =>
  input ? formatDate(input) : '—';