# Routing on Vercel / local gateway

## Intent (target)

- Path gateway in front of one Astro app per brand
- Prefer **host-based** branding over path prefixes for public SEO in production
- Independent apps: CAE + Dr Jasmine live; CMS deferred

## Local preview (current)

1. **`@seo/gateway`** listens on **4321** (`0.0.0.0`).
2. Proxies `/cae` → `http://127.0.0.1:4322` (`@seo/cae`, Astro `base: "/cae/"`).
3. Proxies `/dr-jasmine` → `http://127.0.0.1:4323` (`@seo/dr-jasmine`, Astro `base: "/dr-jasmine/"`).
4. `/cms` on the gateway returns **not migrated yet** (`DEFERRED_PATH_PREFIXES = ["/cms"]`).
5. Root `pnpm dev` starts gateway + CAE + Dr Jasmine concurrently.

## Root `vercel.json` (current)

- `framework: "astro"`
- `installCommand: "pnpm install"`
- `buildCommand: "pnpm --filter @seo/cae build"`
- `outputDirectory: "apps/cae/dist"`

The CAE app uses Astro `base: "/cae/"`, so production URLs are under `/cae/`. Root `/` is not a brand homepage yet. Dr Jasmine is built separately (`pnpm build:dr-jasmine`); production DJ hosting is not wired in root `vercel.json` yet.

### Still open

- Host-based multi-brand routing (ADR 0001 intent) when more apps exist
- Production deploy path for `@seo/dr-jasmine` (Node host / SSR adapter)
- Astro `output: "static"` — no `@astrojs/vercel` adapter yet (CAE/DJ use Node adapter for server mode)
- Gateway is local-preview only today (not the Vercel edge front door)
- Activate `/cms` when `apps/cms` is scaffolded

## Key files

- `apps/gateway/src/` — path proxy (`/cae`, `/dr-jasmine`; deferred `/cms`)
- `apps/cae/astro.config.mjs` — `base: "/cae/"`, port 4322
- `apps/dr-jasmine/astro.config.mjs` — `base: "/dr-jasmine/"`, port 4323
- `vercel.json`
- `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md` (CMS only)
- `docs/implementation-plan/dr-jasmine-landing-and-admin.md`
- `docs/implementation-plan/dr-jasmine-true-website.md`
