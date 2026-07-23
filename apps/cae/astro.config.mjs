/**
 * @fileoverview Astro config for the independent CAE brand app.
 * Served under `/cae/` (gateway proxies to this process on port 4322).
 */
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  base: "/cae/",
  server: {
    host: true,
    port: 4322,
  },
});
