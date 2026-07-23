# Concept: Site pages integration (historical)

| Field | Value |
|-------|--------|
| Status | **Removed** with the legacy `website/` package (2026-07-23) |
| Former code | `website/src/integrations/site-pages.ts` |
| Former wiring | `website/astro.config.mjs` → `integrations: [sitePagesIntegration()]` |

## Former behavior

1. Read enabled sites from `getEnabledSites()` (`website/src/lib/sites.ts`).
2. Scan `website/<slug>/pages/**/*.astro`.
3. Call Astro `injectRoute` so each file was available at `/{slug}/…`.

## Current model

- Brand routes live in `apps/<slug>/src/pages/` with Astro `base: "/<slug>/"`.
- Local path front door is `apps/gateway`.
- Do not reintroduce a shared site-pages registry.

## Related

- [ADR 0003](../decisions/0003-astro-single-app-per-site-folders.md) — one app per brand + gateway
- [Routing](../architecture/routing-vercel.md)
- [Monorepo](../architecture/monorepo.md)
- Deferred cms/dr-jasmine apps: `docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md`
