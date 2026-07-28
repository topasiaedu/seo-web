# Source: CAE native ZWDS public redesign cutover

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md](../../raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md) |
| Ingested | 2026-07-28 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related prior | [cae-nm-zwds-brand-theme-and-public-theme-toggle](cae-nm-zwds-brand-theme-and-public-theme-toggle.md); [cae-blog-immersive-story-redesign](cae-blog-immersive-story-redesign.md); [cae-homepage-blog-bento](cae-homepage-blog-bento.md); [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md) (**superseded** for live home/media chrome) |

## Takeaways

- Live **homepage**, **media**, and **blog chrome** cut over from GHL lift to **native** ZWDS components (`SiteHeader` / `SiteFooter` / `components/home/*`).
- Home composition: Header → Hero → Press → Insights bento → Pillars → Platform → Testimonials → Connect → Footer.
- Hero uses **photo + scrim only** (no starfield / arc / constellation overlays).
- Footer copyright is **plain text** (no terms link).
- Blog keeps Immersive Story article layout; adds gold language, FAQ chevron, TOC **scroll spy**, byline Instagram/Facebook under name, solid hero pills.
- GHL fragments remain on disk as archive / unwired code — **not** the primary public marketing path.

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/components/HomePage.astro` | Native section composition |
| `apps/cae/src/layouts/HomeLayout.astro` | `global.css` + `decorative.css` |
| `apps/cae/src/components/home/*` · `styles/home/*` | Marketing sections |
| `apps/cae/src/pages/media/index.astro` · `components/media/MediaArticles.astro` | Native media page |
| `apps/cae/src/components/blog/BlogLayout.astro` | Shared native chrome for blog |
| `apps/cae/src/components/blog/blog-page.css` | Magazine + Immersive Story + gold polish |
| `apps/cae/src/components/blog/TableOfContents.astro` | TOC + scroll spy |
| `apps/cae/src/components/blog/AuthorByline.astro` | Name + social pills |

## Affects

- [sites/cae.md](../sites/cae.md) — marketing stack rewritten
- [overview.md](../overview.md) · [architecture/overview.md](../architecture/overview.md)
- [glossary.md](../glossary.md) — Native ZWDS public stack; update GHL lift note
- [cae-blog-immersive-story-redesign](cae-blog-immersive-story-redesign.md) — chrome + polish supersessions
- [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md) — live chrome superseded

## Open / deferred (from raw)

1. Formal Appendix B visual smoke (375/1280, light+dark)
2. Wire or drop unused index `LeadPost`
3. Optional later archive/delete of unwired GHL homepage components
4. Commit/push when ready

## Does not change

- Admin Blog / `@seo/blog` APIs / scheduling
- Insights soft bento data model (newest 4 live Posts)
- Vault GHL capture archives under `raw/research/`
- Gateway / Vercel deploy wiring
