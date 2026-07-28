/**
 * @fileoverview Default Open Graph image helpers for public marketing pages (T10).
 */

import { landingImages } from "@/data/landing/images";
import { normalizeBase, toAbsoluteUrl } from "@/lib/site-url";

/**
 * Default OG image for public pages — Dr Jasmine portrait.
 *
 * @returns Absolute image URL suitable for `og:image` / `twitter:image`
 */
export function defaultPublicOgImageUrl(): string {
  return toAbsoluteUrl(landingImages.drJasminePortrait.src);
}

/**
 * Fallback OG image when no page-specific asset is set (site logo / base path).
 *
 * @param basePath - Astro `import.meta.env.BASE_URL`
 * @returns Absolute URL for the public site root under the base path
 */
export function fallbackOgImageFromBase(basePath: string): string {
  return toAbsoluteUrl(normalizeBase(basePath));
}
