/**
 * @fileoverview SEO metadata for the CAE marketing homepage.
 */

/**
 * Page `<title>` and meta description for the CAE homepage.
 */
export const homeMeta = {
  title: "Purple Star Astrology & Life Strategy | Zi Wei Dou Shu | Chinese Astrology | Cae Goh",
  description:
    "Discover Your Destiny with Zi Wei Dou Shu Consulting: Expert Astrological Insights to Guide Your Life's Path, Enhance Relationships, and Prosper in Business.",
} as const;

/** Shape of {@link homeMeta}. */
export type HomeMeta = typeof homeMeta;

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
