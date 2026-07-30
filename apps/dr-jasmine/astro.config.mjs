/**
 * @fileoverview Astro config for the independent Dr Jasmine brand app.
 *
 * Hosting modes:
 * - Local gateway: `base: "/dr-jasmine/"` (proxied from `:4321` → this process on `:4323`)
 * - Dedicated Vercel project (`seo-web-dr-jasmine`): `base: "/"` so HTML asset URLs
 *   match Build Output API paths (`/_astro/...`, `/`, `/blog/`)
 *
 * Adapter selection:
 * - Vercel (`VERCEL=1` during platform builds) → `@astrojs/vercel` (Build Output API)
 * - Local / Node hosts (Render, `pnpm start`) → `@astrojs/node` standalone
 */
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { defineConfig } from "astro/config";

/**
 * True on Vercel CI/runtime so we emit `.vercel/output` instead of a Node standalone server.
 * Local Windows builds stay on `@astrojs/node` to avoid NFT symlink EPERM failures.
 */
const useVercelAdapter = process.env.VERCEL === "1";

/** Production origin for absolute sitemap / canonical URLs. */
const siteOrigin =
  typeof process.env.PUBLIC_SITE_ORIGIN === "string" &&
  process.env.PUBLIC_SITE_ORIGIN.trim().length > 0
    ? process.env.PUBLIC_SITE_ORIGIN.trim().replace(/\/+$/, "")
    : "https://doctorjasmine.com";

/**
 * Path prefix for this app (must match `defineConfig.base`).
 * Dedicated Vercel hosts mount the app at `/`; local gateway keeps `/dr-jasmine/`.
 */
const basePath = useVercelAdapter ? "/" : "/dr-jasmine/";

/**
 * SSR public routes not prerendered at build time — listed via `customPages`.
 * Prerendered routes are discovered automatically.
 */
const ssrSitemapSegments = ["", "blog"];

/**
 * Builds an absolute sitemap URL for a public route segment.
 *
 * @param {string} segment - Route segment (`""` for home)
 * @returns {string} Absolute URL with trailing slash
 */
function publicRouteAbsoluteUrl(segment) {
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const path =
    segment.length === 0
      ? normalizedBase
      : `${normalizedBase}${segment.replace(/^\/+|\/+$/g, "")}/`;
  return `${siteOrigin}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute URLs for SSR marketing pages included in the sitemap. */
const sitemapCustomPages = ssrSitemapSegments.map(publicRouteAbsoluteUrl);

export default defineConfig({
  site: siteOrigin,
  output: "server",
  adapter: useVercelAdapter
    ? vercel()
    : node({
        mode: "standalone",
      }),
  base: basePath,
  server: {
    host: true,
    port: 4323,
  },
  integrations: [
    react(),
    sitemap({
      customPages: sitemapCustomPages,
      /**
       * Include public marketing routes; exclude Admin and auth surfaces.
       *
       * @param {string} page - Absolute page URL
       * @returns {boolean} Whether to include the page in the sitemap
       */
      filter: (page) => !page.includes("/admin"),
    }),
  ],
});
