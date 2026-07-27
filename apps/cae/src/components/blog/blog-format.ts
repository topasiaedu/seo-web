/**
 * @fileoverview Shared formatting helpers for public CAE blog pages.
 */

/**
 * Formats an ISO date for display on the public blog (e.g. "Jul 23, 2026").
 *
 * @param iso - ISO-8601 timestamp, or `null` / invalid.
 * @returns Locale-formatted date, or empty string when unavailable.
 */
export function formatBlogDate(iso: string | null): string {
  if (typeof iso !== "string" || iso.trim().length === 0) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Builds a reading-time label from minutes.
 *
 * @param minutes - Stored or computed reading time.
 * @returns Label such as `"5 min read"`, or empty when unset / invalid.
 */
export function formatReadingTime(minutes: number | null): string {
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0) {
    return "";
  }
  const rounded = Math.max(1, Math.round(minutes));
  return `${String(rounded)} min read`;
}

/**
 * Joins Astro `base` with an app-relative public path (blog links).
 *
 * @param baseUrl - Astro `import.meta.env.BASE_URL` (e.g. `/cae/`).
 * @param path - App-relative path (with or without leading slash).
 * @returns Absolute-from-origin path including base.
 */
export function joinBlogPath(baseUrl: string, path: string): string {
  if (typeof baseUrl !== "string") {
    throw new TypeError("joinBlogPath requires a string baseUrl");
  }
  if (typeof path !== "string" || path.trim().length === 0) {
    throw new TypeError("joinBlogPath requires a non-empty path");
  }
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const relative = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${relative}`;
}

/**
 * Builds a `/blog` index URL with optional category + page query params.
 *
 * @param baseUrl - Astro `import.meta.env.BASE_URL`.
 * @param options - Optional category slug and 1-based page (page 1 omits `page`).
 * @returns Path including base and query string when needed.
 */
export function buildBlogIndexHref(
  baseUrl: string,
  options: { categorySlug?: string; page?: number } = {},
): string {
  const path = joinBlogPath(baseUrl, "blog");
  const params = new URLSearchParams();

  const categorySlug =
    typeof options.categorySlug === "string" ? options.categorySlug.trim() : "";
  if (categorySlug.length > 0) {
    params.set("category", categorySlug);
  }

  const page = options.page;
  if (typeof page === "number" && Number.isFinite(page) && page > 1) {
    params.set("page", String(Math.floor(page)));
  }

  const query = params.toString();
  return query.length > 0 ? `${path}?${query}` : path;
}

/**
 * Returns the request-scoped Supabase client or throws when middleware skipped wiring.
 *
 * @param supabase - `Astro.locals.supabase` (undefined on prerendered routes).
 * @returns Bound server client for this request.
 */
export function requireBlogSupabase<T>(supabase: T | undefined): T {
  if (supabase === undefined) {
    throw new Error(
      "Supabase client missing from locals; blog SSR routes require middleware session wiring.",
    );
  }
  return supabase;
}

/**
 * Picks SEO title with fallbacks: seoTitle → title.
 *
 * @param seoTitle - Optional Admin SEO title.
 * @param title - Post title.
 * @returns Non-empty document title base (without brand suffix).
 */
export function resolvePostSeoTitle(
  seoTitle: string | null,
  title: string,
): string {
  if (typeof seoTitle === "string" && seoTitle.trim().length > 0) {
    return seoTitle.trim();
  }
  if (typeof title === "string" && title.trim().length > 0) {
    return title.trim();
  }
  return "Blog";
}

/**
 * Picks meta description with fallbacks: seoDescription → excerpt → title.
 *
 * @param seoDescription - Optional Admin SEO description.
 * @param excerpt - Post excerpt / dek.
 * @param title - Post title fallback.
 * @returns Non-empty meta description.
 */
export function resolvePostSeoDescription(
  seoDescription: string | null,
  excerpt: string,
  title: string,
): string {
  if (typeof seoDescription === "string" && seoDescription.trim().length > 0) {
    return seoDescription.trim();
  }
  if (typeof excerpt === "string" && excerpt.trim().length > 0) {
    return excerpt.trim();
  }
  if (typeof title === "string" && title.trim().length > 0) {
    return title.trim();
  }
  return "CAE blog post.";
}

/**
 * Picks OG image with fallbacks: ogImageUrl → heroImageUrl → undefined (layout default).
 *
 * @param ogImageUrl - Optional dedicated OG image URL.
 * @param heroImageUrl - Hero image URL.
 * @returns Absolute or relative image URL, or `undefined` to use brand default.
 */
export function resolvePostOgImage(
  ogImageUrl: string | null,
  heroImageUrl: string | null,
): string | undefined {
  if (typeof ogImageUrl === "string" && ogImageUrl.trim().length > 0) {
    return ogImageUrl.trim();
  }
  if (typeof heroImageUrl === "string" && heroImageUrl.trim().length > 0) {
    return heroImageUrl.trim();
  }
  return undefined;
}
