/**
 * @fileoverview Replaces `__GHL_ASSET_*__` tokens in lifted HTML with resolved
 * local asset URLs from {@link homeImages}, then applies UI-safe SEO fixes
 * (alt / loading / h1 demotion) via {@link applySeoHtmlPass}.
 */

import {
  getHomeImage,
  homeImages,
  isHomeImageKey,
  type HomeImageAsset,
  type HomeImageKey,
} from "@/data/home/images";
import { applySeoHtmlPass } from "./seoHtmlPass";

/**
 * Returns a usable `src` string from an Astro/Vite image import.
 *
 * @param asset - Static import from {@link homeImages}
 * @returns URL string for an `<img src>` or CSS `url()`
 */
export function assetSrc(asset: HomeImageAsset): string {
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
  throw new Error("remapHtml: unsupported home image asset shape.");
}

/**
 * Builds a map of every homepage image key to its runtime URL.
 *
 * @returns Record of HomeImageKey → URL string
 */
export function buildAssetUrlMap(): Readonly<Record<HomeImageKey, string>> {
  const map = {} as Record<HomeImageKey, string>;
  for (const key of Object.keys(homeImages) as HomeImageKey[]) {
    map[key] = assetSrc(getHomeImage(key));
  }
  return map;
}

const TOKEN_RE = /__GHL_ASSET_([A-Za-z0-9_]+)__/g;

/**
 * Substitutes asset tokens and applies known HTML post-fixes for the lift.
 *
 * @param html - Sanitized fragment containing `__GHL_ASSET_*__` tokens
 * @param urls - Prebuilt key → URL map from {@link buildAssetUrlMap}
 * @returns HTML ready for `set:html`
 */
export function remapGhlHtml(
  html: string,
  urls: Readonly<Record<string, string>>,
): string {
  let out = html.replace(TOKEN_RE, (_full, key: string) => {
    if (!isHomeImageKey(key)) {
      throw new Error(`remapGhlHtml: unknown asset key "${key}".`);
    }
    const url = urls[key];
    if (typeof url !== "string" || url.length === 0) {
      throw new Error(`remapGhlHtml: missing URL for "${key}".`);
    }
    return url;
  });

  const instagramUrl = urls.instagram;
  const facebookUrl = urls.facebook;
  if (typeof instagramUrl === "string" && instagramUrl.length > 0) {
    out = out.replace(
      /https:\/\/stcdn\.leadconnectorhq\.com\/funnel\/icons\/square\/instagram-square\.svg/g,
      instagramUrl,
    );
  }
  if (typeof facebookUrl === "string" && facebookUrl.length > 0) {
    out = out.replace(
      /https:\/\/stcdn\.leadconnectorhq\.com\/funnel\/icons\/square\/facebook-square\.svg/g,
      facebookUrl,
    );
  }

  // Drop remaining responsive <picture><source> wrappers — keep final <img>.
  out = out.replace(/<picture[^>]*>/gi, "");
  out = out.replace(/<\/picture>/gi, "");
  out = out.replace(/<source\b[^>]*>/gi, "");

  // Strip empty target="" attributes that sanitize left behind.
  out = out.replace(/\s+target(?:=["']{2})?(?=\s|>)/g, "");

  // Internal Media & Press / Blog routes (base-aware).
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  out = out.replace(
    /__GHL_INTERNAL_MEDIA__/g,
    `${normalizedBase}media/`,
  );
  out = out.replace(
    /https:\/\/caegoh\.com\/media\/?/g,
    `${normalizedBase}media/`,
  );
  out = out.replace(
    /__GHL_INTERNAL_BLOG__/g,
    `${normalizedBase}blog/`,
  );
  out = out.replace(
    /https:\/\/caegoh\.com\/blog\/?/g,
    `${normalizedBase}blog/`,
  );

  // Hero LEARN MORE formerly targeted Offerings; blog band replaced that slot.
  out = out.replace(/#section-gZkeGFtHWF\b/g, "#insights");
  out = out.replace(/#offerings\b/g, "#insights");

  // SEO: alts, loading hints, heading demotion (per-fragment aware).
  out = applySeoHtmlPass(out, urls);

  return out;
}
