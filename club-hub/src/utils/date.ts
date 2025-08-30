/**
 * Format an ISO date/time string into a localized date-time string.
 * Returns the original value if parsing fails.
 */
export function formatDateTime(value: string): string {
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString();
}
