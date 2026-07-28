/**
 * @fileoverview Public route URL helpers for sitemap and JSON-LD (T10).
 * Uses `PUBLIC_SITE_ORIGIN` and Astro `BASE_URL` for absolute paths.
 */

import { getSiteOrigin, normalizeBase } from "@/lib/site-url";

/**
 * Public marketing route segments included in the sitemap (no slashes).
 * Home is represented by an empty string when building paths.
 */
export const PUBLIC_SITEMAP_SEGMENTS = [
  "",
  "blog",
] as const;

/** One public route segment used in {@link PUBLIC_SITEMAP_SEGMENTS}. */
export type PublicSitemapSegment = (typeof PUBLIC_SITEMAP_SEGMENTS)[number];

/**
 * Builds a site-relative path for a public route under the Astro base.
 *
 * @param segment - Route segment (`""` for home)
 * @param basePath - Astro `import.meta.env.BASE_URL` or config base
 * @returns Path such as `/dr-jasmine/blog/`
 */
export function publicRoutePath(
  segment: PublicSitemapSegment,
  basePath: string,
): string {
  const base = normalizeBase(basePath);
  if (segment.length === 0) {
    return base;
  }
  const cleaned = segment.replace(/^\/+|\/+$/g, "");
  return `${base}${cleaned}/`;
}

/**
 * Resolves a public route to an absolute URL for sitemap `customPages`.
 *
 * @param segment - Route segment (`""` for home)
 * @param origin - Absolute site origin (no trailing slash)
 * @param basePath - Astro base path
 * @returns Absolute URL such as `https://doctorjasmine.com/dr-jasmine/blog/`
 */
export function publicRouteAbsoluteUrl(
  segment: PublicSitemapSegment,
  origin: string,
  basePath: string,
): string {
  if (typeof origin !== "string" || origin.trim().length === 0) {
    throw new Error("publicRouteAbsoluteUrl requires a non-empty origin.");
  }
  const trimmedOrigin = origin.trim().replace(/\/+$/, "");
  const path = publicRoutePath(segment, basePath);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedOrigin}${normalizedPath}`;
}

/**
 * SSR marketing routes that are not prerendered and must be listed via sitemap
 * `customPages`. Prerendered routes are discovered automatically.
 */
export const SSR_SITEMAP_SEGMENTS: readonly PublicSitemapSegment[] = [
  "",
  "blog",
];

/**
 * Builds absolute URLs for sitemap `customPages` entries.
 *
 * @param origin - Production origin; defaults to {@link getSiteOrigin} when omitted
 * @param basePath - Astro base path (defaults to `/dr-jasmine/`)
 * @returns Absolute URLs for SSR public routes
 */
export function buildSitemapCustomPages(
  origin?: string,
  basePath = "/dr-jasmine/",
): string[] {
  const resolvedOrigin =
    origin !== undefined && origin.trim().length > 0
      ? origin.trim().replace(/\/+$/, "")
      : getSiteOrigin();

  return SSR_SITEMAP_SEGMENTS.map((segment) =>
    publicRouteAbsoluteUrl(segment, resolvedOrigin, basePath),
  );
}
