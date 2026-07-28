/**
 * @fileoverview Replaces `__GHL_ASSET_*__` tokens in lifted HTML with resolved
 * local asset URLs from {@link landingImages}, then applies UI-safe SEO fixes
 * via {@link applySeoHtmlPass}. Also remaps register CTA + blog path tokens
 * for the `/dr-jasmine/` Astro base.
 */

import {
  getLandingImage,
  isLandingImageKey,
  landingImages,
  type LandingImageAsset,
  type LandingImageKey,
} from "@/data/landing/images";
import { applySeoHtmlPass } from "./seoHtmlPass";

/** Default live register funnel (start URL; redirects to join page). */
export const DEFAULT_REGISTER_URL = "https://doctorjasmine.com/register";

/**
 * Returns a usable `src` string from an Astro/Vite image import.
 *
 * @param asset - Static import from {@link landingImages}
 * @returns URL string for an `<img src>` or CSS `url()`
 */
export function assetSrc(asset: LandingImageAsset): string {
  if (typeof asset === "string") {
    return asset;
  }
  if (
    typeof asset === "object" &&
    asset !== null &&
    "src" in asset &&
    typeof asset.src === "string"
  ) {
    return asset.src;
  }
  throw new Error("remapHtml: unsupported landing image asset shape.");
}

/**
 * Builds a map of every landing image key to its runtime URL.
 *
 * @returns Record of LandingImageKey → URL string
 */
export function buildAssetUrlMap(): Readonly<Record<LandingImageKey, string>> {
  const map = {} as Record<LandingImageKey, string>;
  for (const key of Object.keys(landingImages) as LandingImageKey[]) {
    map[key] = assetSrc(getLandingImage(key));
  }
  return map;
}

const TOKEN_RE = /__GHL_ASSET_([A-Za-z0-9_]+)__/g;

/**
 * Substitutes asset tokens and applies known HTML post-fixes for the lift.
 *
 * @param html - Sanitized fragment containing `__GHL_ASSET_*__` tokens
 * @param urls - Prebuilt key → URL map from {@link buildAssetUrlMap}
 * @param options - Optional register URL override
 * @returns HTML ready for `set:html`
 */
export function remapGhlHtml(
  html: string,
  urls: Readonly<Record<string, string>>,
  options?: Readonly<{ registerUrl?: string }>,
): string {
  let out = html.replace(TOKEN_RE, (_full, key: string) => {
    if (!isLandingImageKey(key)) {
      throw new Error(`remapGhlHtml: unknown asset key "${key}".`);
    }
    const url = urls[key];
    if (typeof url !== "string" || url.length === 0) {
      throw new Error(`remapGhlHtml: missing URL for "${key}".`);
    }
    return url;
  });

  // Drop remaining responsive <picture><source> wrappers — keep final <img>.
  out = out.replace(/<picture[^>]*>/gi, "");
  out = out.replace(/<\/picture>/gi, "");
  out = out.replace(/<source\b[^>]*>/gi, "");

  // Strip empty target="" attributes that sanitize left behind.
  out = out.replace(/\s+target(?:=["']{2})?(?=\s|>)/g, "");

  const registerUrl =
    typeof options?.registerUrl === "string" && options.registerUrl.length > 0
      ? options.registerUrl
      : DEFAULT_REGISTER_URL;
  out = out.replace(/__GHL_REGISTER_URL__/g, registerUrl);
  // Absolute join/register paths → live funnel (v1 keeps GHL registration).
  out = out.replace(
    /https?:\/\/(?:www\.)?doctorjasmine\.com\/(?:register|join-v2-6756)\/?/gi,
    registerUrl,
  );

  // Internal blog route (base-aware for /dr-jasmine/).
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  out = out.replace(/__GHL_INTERNAL_BLOG__/g, `${normalizedBase}blog/`);
  out = out.replace(
    /https:\/\/(?:www\.)?doctorjasmine\.com\/blog\/?/g,
    `${normalizedBase}blog/`,
  );

  out = applySeoHtmlPass(out, urls);

  return out;
}
