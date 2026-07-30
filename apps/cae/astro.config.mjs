/**
 * @fileoverview Astro config for the independent CAE brand app.
 *
 * Hosting modes:
 * - Local gateway: `base: "/cae/"` (proxied from `:4321` → this process on `:4322`)
 * - Dedicated Vercel project (`seo-web-cae`): `base: "/"` so HTML asset URLs match
 *   Build Output API paths (`/_astro/...`, `/`, `/blog/`)
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

/**
 * Path prefix for this app.
 * Dedicated Vercel hosts mount the app at `/`; local gateway keeps `/cae/`.
 */
const basePath = useVercelAdapter ? "/" : "/cae/";

/** Production origin for absolute sitemap / canonical URLs. */
const siteOrigin =
  typeof process.env.PUBLIC_SITE_ORIGIN === "string" &&
  process.env.PUBLIC_SITE_ORIGIN.trim().length > 0
    ? process.env.PUBLIC_SITE_ORIGIN.trim().replace(/\/+$/, "")
    : "https://caegoh.com";

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
    port: 4322,
  },
  integrations: [
    react(),
    sitemap({
      /**
       * Exclude blog scaffold until Supabase-backed posts ship.
       *
       * @param page - Absolute page URL
       * @returns Whether to include the page in the sitemap
       */
      filter: (page) => !page.includes("/blog"),
    }),
  ],
});
