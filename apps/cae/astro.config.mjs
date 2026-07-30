/**
 * @fileoverview Astro config for the independent CAE brand app.
 * Served under `/cae/` (gateway proxies to this process on port 4322).
 * Server output enables Admin session cookies; marketing pages opt into prerender.
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
    : "https://caegoh.com";

export default defineConfig({
  site: siteOrigin,
  output: "server",
  adapter: useVercelAdapter
    ? vercel()
    : node({
        mode: "standalone",
      }),
  base: "/cae/",
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
