/**
 * @fileoverview Absolute URL helpers for Dr Jasmine SEO (canonical, Open Graph, JSON-LD).
 */

/** Default production origin when `PUBLIC_SITE_ORIGIN` is unset. */
export const DEFAULT_SITE_ORIGIN = "https://doctorjasmine.com";

/**
 * Returns a trimmed absolute origin (scheme + host, no trailing slash).
 *
 * @param value - Candidate origin string
 * @returns Valid origin or `undefined` when invalid
 */
function parseOrigin(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }
  const trimmed = value.trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    return parsed.origin;
  } catch {
    return undefined;
  }
}

/**
 * Resolves the public site origin for absolute SEO URLs.
 *
 * @returns Origin such as `https://doctorjasmine.com`
 */
export function getSiteOrigin(): string {
  const fromEnv = parseOrigin(import.meta.env.PUBLIC_SITE_ORIGIN);
  if (fromEnv !== undefined) {
    return fromEnv;
  }
  return DEFAULT_SITE_ORIGIN;
}

/**
 * Normalizes Astro `BASE_URL` to always end with `/`.
 *
 * @param base - Astro base path
 * @returns Base with trailing slash
 */
export function normalizeBase(base: string): string {
  if (typeof base !== "string" || base.trim().length === 0) {
    return "/";
  }
  const trimmed = base.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

/**
 * Builds an absolute URL from a site-relative or root-relative path.
 *
 * @param pathOrUrl - Path (`/dr-jasmine/...`), Astro asset src, or already-absolute URL
 * @returns Absolute `https://…` URL
 */
export function toAbsoluteUrl(pathOrUrl: string): string {
  if (typeof pathOrUrl !== "string" || pathOrUrl.trim().length === 0) {
    throw new Error("toAbsoluteUrl requires a non-empty path or URL string.");
  }
  const trimmed = pathOrUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const origin = getSiteOrigin();
  if (trimmed.startsWith("/")) {
    return `${origin}${trimmed}`;
  }
  const base = normalizeBase(import.meta.env.BASE_URL);
  return `${origin}${base}${trimmed.replace(/^\/+/, "")}`;
}

/**
 * Canonical page URL for the current Astro request (respects `base`).
 *
 * @param pathname - `Astro.url.pathname` (includes base when under `/dr-jasmine/`)
 * @returns Absolute canonical URL with trailing slash for directory routes
 */
export function toCanonicalUrl(pathname: string): string {
  if (typeof pathname !== "string" || pathname.trim().length === 0) {
    throw new Error("toCanonicalUrl requires a non-empty pathname.");
  }
  const origin = getSiteOrigin();
  let path = pathname.trim();
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  if (!path.endsWith("/") && !/\.[a-z0-9]+$/i.test(path)) {
    path = `${path}/`;
  }
  return `${origin}${path}`;
}
