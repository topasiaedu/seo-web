/**
 * @fileoverview SEO metadata for CAE marketing pages (home + media + social).
 */

/**
 * Page `<title>` and meta description for the CAE homepage.
 */
export const homeMeta = {
  title:
    "Purple Star Astrology & Life Strategy | Zi Wei Dou Shu | Chinese Astrology | Cae Goh",
  description:
    "Discover Your Destiny with Zi Wei Dou Shu Consulting: Expert Astrological Insights to Guide Your Life's Path, Enhance Relationships, and Prosper in Business.",
  ogType: "website",
  siteName: "Cae Goh",
  twitterCard: "summary_large_image",
} as const;

/** Shape of {@link homeMeta}. */
export type HomeMeta = typeof homeMeta;

/**
 * SEO copy for the Media & Press route.
 */
export const mediaMeta = {
  title: "Media & Press - Cae Goh",
  description:
    "Media & Press coverage featuring CAE Goh and the Predictable Destiny System.",
  ogType: "website",
  siteName: "Cae Goh",
  twitterCard: "summary_large_image",
} as const;

/** Shape of {@link mediaMeta}. */
export type MediaMeta = typeof mediaMeta;

/**
 * SEO copy for the Social Media hub route.
 */
export const socialMeta = {
  title: "Social Media - Cae Goh",
  description:
    "Follow Cae Goh on Instagram and Facebook for Zi Wei Dou Shu insights and updates.",
  ogType: "website",
  siteName: "Cae Goh",
  twitterCard: "summary_large_image",
} as const;

/** Shape of {@link socialMeta}. */
export type SocialMeta = typeof socialMeta;

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
