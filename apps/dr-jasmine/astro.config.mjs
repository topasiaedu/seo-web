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
 *
 * CSRF / logout: Astro `security.checkOrigin` compares the browser `Origin` header to
 * the request URL. Behind the local gateway (`changeOrigin` + `xfwd`) or Vercel
 * (internal `localhost` URL), that mismatch returns
 * "Cross-site POST form submissions are forbidden". `security.allowedDomains`
 * lets Astro trust `X-Forwarded-Host` / `X-Forwarded-Proto` for those hosts.
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
 * Builds Astro `security.allowedDomains` so forwarded hosts are trusted for CSRF.
 *
 * @returns {Array<{ hostname: string, protocol?: string }>} Permitted host patterns.
 */
function buildAllowedDomains() {
  /** @type {Array<{ hostname: string, protocol?: string }>} */
  const domains = [
    { hostname: "doctorjasmine.com", protocol: "https" },
    { hostname: "www.doctorjasmine.com", protocol: "https" },
    { hostname: "seo-web-dr-jasmine.vercel.app", protocol: "https" },
    // Preview / branch deployments: `*.vercel.app` and nested `**.vercel.app`
    { hostname: "*.vercel.app", protocol: "https" },
    { hostname: "**.vercel.app", protocol: "https" },
    // Local gateway (`:4321`) and direct app (`:4323`)
    { hostname: "localhost", protocol: "http" },
    { hostname: "127.0.0.1", protocol: "http" },
  ];

  try {
    const parsed = new URL(siteOrigin);
    domains.push({
      hostname: parsed.hostname,
      protocol: parsed.protocol.replace(":", ""),
    });
  } catch {
    // Keep the static defaults when PUBLIC_SITE_ORIGIN is malformed.
  }

  const vercelUrl =
    typeof process.env.VERCEL_URL === "string" ? process.env.VERCEL_URL.trim() : "";
  if (vercelUrl.length > 0) {
    domains.push({
      hostname: vercelUrl.replace(/^https?:\/\//i, "").split("/")[0] ?? vercelUrl,
      protocol: "https",
    });
  }

  return domains;
}

/**
 * SSR public routes not prerendered at build time — listed via `customPages`.
 * Prerendered routes are discovered automatically.
 */
const ssrSitemapSegments = ["", "about", "reels", "blog"];

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
  security: {
    checkOrigin: true,
    allowedDomains: buildAllowedDomains(),
  },
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
