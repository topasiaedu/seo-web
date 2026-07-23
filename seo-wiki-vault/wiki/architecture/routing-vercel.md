# Routing on Vercel / local gateway

## Intent (target)

- Path gateway in front of one Astro app per brand
- Prefer **host-based** branding over path prefixes for public SEO in production
- Independent apps: CAE live; cms / dr-jasmine deferred

## Local preview (current)

1. **`@seo/gateway`** listens on **4321** (`0.0.0.0`).
2. Proxies `/cae` → `http://127.0.0.1:4322` (`@seo/cae`, Astro `base: "/cae/"`).
3. `/dr-jasmine` and `/cms` on the gateway return **not migrated yet** (apps not scaffolded).
4. Root `pnpm dev` starts gateway + CAE concurrently.

## Root `vercel.json` (current)

- `framework: "astro"`
- `installCommand: "pnpm install"`
- `buildCommand: "pnpm --filter @seo/cae build"`
- `outputDirectory: "apps/cae/dist"`

The CAE app uses Astro `base: "/cae/"`, so production URLs are under `/cae/`. Root `/` is not a brand homepage yet.

### Still open

- Host-based multi-brand routing (ADR 0001 intent) when more apps exist
- Astro `output: "static"` — no `@astrojs/vercel` adapter yet
- Gateway is local-preview only today (not the Vercel edge front door)

## Key files

- `apps/gateway/src/` — path proxy
- `apps/cae/astro.config.mjs` — `base: "/cae/"`, port 4322
- `vercel.json`
- `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md`
