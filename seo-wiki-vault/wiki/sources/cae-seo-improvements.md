# Source: CAE website SEO improvements

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-23-cae-seo-improvements.md](../../raw/inbox/2026-07-23-cae-seo-improvements.md) |
| Ingested | 2026-07-23 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related lift | [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md) |
| Related media design | [cms-media-library-and-cae-image-alt](cms-media-library-and-cae-image-alt.md) |

## Takeaways

- CAE marketing SEO was hardened **UI-safely** on the live GHL section lift: no rewire to parked BEM, no GHL CSS restyle, no class/ID/structure changes.
- Shared document head via `SeoHead.astro`: description, robots, canonical, Open Graph, Twitter, favicon, JSON-LD.
- Absolute URLs use `PUBLIC_SITE_ORIGIN` (default `https://caegoh.com`) + Astro `base: "/cae/"`.
- `@astrojs/sitemap` + `public/robots.txt`; blog scaffold **excluded** from sitemap until posts exist.
- Image alts / loading / single-h1 policy applied in `seoHtmlPass.ts` after remappers (`remapHtml` / `remapMediaHtml`) so re-lifts stay patchable.
- One `<h1>` per page: keep first h1 in hero `section-GdS5u8Huz` and media `section-D3OvNABS8F`; demote all other fragment h1→h2 (tag only). GHL CSS co-selects h1/h2; `host-patch.css` equalizes UA margins.

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/components/seo/SeoHead.astro` | Shared head SEO tags |
| `apps/cae/src/data/home/meta.ts` · `jsonld.ts` | Page meta + JSON-LD builders |
| `apps/cae/src/lib/site-url.ts` | Origin / canonical / absolute URL helpers |
| `apps/cae/src/components/ghl/seoHtmlPass.ts` | UI-safe HTML post-pass |
| `apps/cae/astro.config.mjs` | `site` + `@astrojs/sitemap` |
| `apps/cae/public/robots.txt` | Crawl + sitemap pointer |

## Affects

- [sites/cae.md](../sites/cae.md) — SEO stack, sitemap, remapper pass
- [sources/cae-ghl-section-lift-and-media-page.md](cae-ghl-section-lift-and-media-page.md) — lift remains runtime; SEO layers on remappers
- [sources/cms-media-library-and-cae-image-alt.md](cms-media-library-and-cae-image-alt.md) — interim alts now via remapper; CMS Media Library still deferred
- [overview.md](../overview.md) — CAE SEO posture noted under current focus
- [glossary.md](../glossary.md) — **SEO remapper pass** term

## Open questions (from raw)

1. Apex cutover: `base: "/"` on caegoh.com — refresh canonical / sitemap / robots
2. Per-post blog SEO + sitemap inclusion when Supabase posts ship
3. Richer media-article alts via future CMS Media Library
4. Confirm Facebook `sameAs` URL in JSON-LD
5. Set `PUBLIC_SITE_ORIGIN` explicitly in production host env vs code default

## Does not change

- GHL fragment structure / parked native BEM / external CTA funnels / blog content wiring
