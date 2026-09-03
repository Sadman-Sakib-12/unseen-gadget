/**
 * Shared string utilities across the platform.
 */

/**
 * Converts a string into a clean, URL-safe slug.
 */
export function slugify(input: string): string {
  if (!input) return '';
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a specified maximum length with an optional suffix.
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + suffix;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
