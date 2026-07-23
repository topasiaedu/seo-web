/**
 * @fileoverview Remap Media & Press fragment tokens to local asset URLs and
 * internal base paths (`/cae/`, `/cae/media/`).
 */

import { getHomeImage, type HomeImageAsset } from "@/data/home/images";

/**
 * @param asset - Astro/Vite image import
 * @returns URL string
 */
function assetSrc(asset: HomeImageAsset | string): string {
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
  throw new Error("mediaRemap: unsupported asset shape.");
}

/**
 * Eager URL map for every file under `src/assets/media/` (`?url` keeps SVGs
 * as strings instead of Astro SVG components).
 */
const mediaAssetModules = import.meta.glob("../../../assets/media/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/**
 * Builds filename → URL map for files under `src/assets/media/`.
 *
 * @returns Record of filename → URL
 */
export function buildMediaAssetUrlMap(): Readonly<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const [modPath, url] of Object.entries(mediaAssetModules)) {
    const filename = modPath.split("/").pop();
    if (typeof filename !== "string" || filename.length === 0) {
      continue;
    }
    if (typeof url === "string" && url.length > 0) {
      map[filename] = url;
    }
  }
  // Prefer the homepage logo import for the brand mark.
  map["67f10ca0e06ab0135af56cc0.png"] = assetSrc(getHomeImage("logo"));
  return map;
}

const TOKEN_RE = /__GHL_MEDIA_ASSET_([A-Za-z0-9._-]+)__/g;

/**
 * @param html - Fragment with tokens
 * @param urls - Filename → URL map
 * @returns Remapped HTML
 */
export function remapMediaHtml(
  html: string,
  urls: Readonly<Record<string, string>>,
): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const mediaHref = `${normalizedBase}media/`;

  let out = html.replace(/__GHL_BASE__/g, normalizedBase);
  out = out.replace(/__GHL_MEDIA__/g, mediaHref);

  out = out.replace(TOKEN_RE, (_full, filename: string) => {
    const url = urls[filename];
    if (typeof url !== "string" || url.length === 0) {
      if (filename.includes("67f10ca0e06ab0135af56cc0")) {
        return assetSrc(getHomeImage("logo"));
      }
      throw new Error(
        `remapMediaHtml: missing asset "${filename}". Known: ${Object.keys(urls).join(", ")}`,
      );
    }
    return url;
  });

  return out;
}
