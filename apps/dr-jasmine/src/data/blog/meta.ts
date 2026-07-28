/**
 * @fileoverview SEO metadata helpers for Dr Jasmine public blog pages.
 */

/**
 * Default blog meta when a page does not override copy.
 */
export const blogMeta = {
  siteName: "Dr Jasmine",
  defaultDescription:
    "Evidence-based insights on diabetes reversal, blood sugar, and metabolic health from Dr Jasmine.",
  twitterCard: "summary_large_image",
} as const;

/**
 * Validates a required non-empty meta string.
 *
 * @param value - Candidate value from config or capture
 * @param fallback - Fallback when invalid
 * @returns Trimmed non-empty string
 */
export function requireMetaString(value: unknown, fallback: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    if (typeof fallback !== "string" || fallback.trim().length === 0) {
      throw new Error("requireMetaString requires a non-empty fallback string.");
    }
    return fallback.trim();
  }
  return value.trim();
}
