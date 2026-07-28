/**
 * @fileoverview Astro config for the independent Dr Jasmine brand app.
 * Served under `/dr-jasmine/` (gateway proxies to this process on port 4323).
 * Server output enables future Admin session cookies; marketing pages may opt into prerender.
 */
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

/** Production origin for absolute sitemap / canonical URLs. */
const siteOrigin =
  typeof process.env.PUBLIC_SITE_ORIGIN === "string" &&
  process.env.PUBLIC_SITE_ORIGIN.trim().length > 0
    ? process.env.PUBLIC_SITE_ORIGIN.trim().replace(/\/+$/, "")
    : "https://doctorjasmine.com";

/** Astro base path for this app (must match `defineConfig.base`). */
const basePath = "/dr-jasmine/";

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
  adapter: node({
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
