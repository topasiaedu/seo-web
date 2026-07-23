# Source: Astro vs Next — APIs, limits, Vercel (session notes)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md](../../raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md) |
| Related research | [raw/research/astro-vs-next-vercel.md](../../raw/research/astro-vs-next-vercel.md) → [astro-vs-next-vercel.md](astro-vs-next-vercel.md) |
| Ingested | 2026-07-23 |

## Takeaways

- Astro and Next API handlers feel similar at the HTTP layer (named `GET`/`POST` + Web `Response`); they are **not** drop-in identical architectures.
- Astro limitations vs Next are mostly **product-fit** (interactivity model, RSC/app patterns, deeper Next+Vercel builtins) — Astro remains strong for SEO/marketing/content sites.
- Astro **can** host on Vercel: static zero-config; SSR/APIs/middleware need `@astrojs/vercel` + server output (or selective `prerender = false`).

## Project status (confirmed on ingest)

- `@seo/cae` remains `output: "static"`; **`@astrojs/vercel` not adopted yet**.
- Local CAE preview uses path gateway, not production SSR middleware.

## Affects

- [sources/astro-vs-next-vercel.md](astro-vs-next-vercel.md) — primary-docs companion
- [architecture/routing-vercel.md](../architecture/routing-vercel.md) — adapter / deploy gap
- [overview.md](../overview.md) — Deferred SSR adapter

## Open questions (from raw)

- Whether limitations framing deserves a dedicated `wiki/concepts/` “framework fit” page (not created this lint; still optional)
