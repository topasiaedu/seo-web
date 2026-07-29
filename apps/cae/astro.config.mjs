/**
 * @fileoverview Astro config for the independent CAE brand app.
 * Served under `/cae/` (gateway proxies to this process on port 4322).
 * Server output enables Admin session cookies; marketing pages opt into prerender.
 * Uses @astrojs/vercel adapter for Vercel serverless deployment.
 */
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

/** Production origin for absolute sitemap / canonical URLs. */
const siteOrigin =
  typeof process.env.PUBLIC_SITE_ORIGIN === "string" &&
  process.env.PUBLIC_SITE_ORIGIN.trim().length > 0
    ? process.env.PUBLIC_SITE_ORIGIN.trim().replace(/\/+$/, "")
    : "https://caegoh.com";

export default defineConfig({
  site: siteOrigin,
  output: "server",
  adapter: vercel(),
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
