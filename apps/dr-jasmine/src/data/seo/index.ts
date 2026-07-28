/**
 * @fileoverview Public SEO helpers — JSON-LD, sitemap URLs, OG defaults (T10).
 */

export {
  buildFaqPageJsonLd,
  buildWebSiteJsonLd,
  type WebSiteJsonLdInput,
} from "@/data/seo/jsonld-pages";

export {
  defaultPublicOgImageUrl,
  fallbackOgImageFromBase,
} from "@/data/seo/og-defaults";

export {
  buildSitemapCustomPages,
  publicRouteAbsoluteUrl,
  publicRoutePath,
  PUBLIC_SITEMAP_SEGMENTS,
  SSR_SITEMAP_SEGMENTS,
  type PublicSitemapSegment,
} from "@/data/seo/urls";
