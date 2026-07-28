# Source: CAE blog post — Immersive Story redesign

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-27-cae-blog-immersive-story-redesign.md](../../raw/inbox/2026-07-27-cae-blog-immersive-story-redesign.md) |
| Ingested | 2026-07-27 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related prior | `raw/inbox/2026-07-24-cae-public-blog-redesign.md` (uningested); `raw/inbox/2026-07-24-cae-blog-reading-paper-and-index-scale.md` (**superseded** for article surface) |

## Takeaways

- `/cae/blog/[slug]` moved from dark hero + **light lavender paper** (wiki-like) to a **dark Immersive Story** layout (design option C).
- Light `.blog-article-paper` wrapper removed from the article path.
- Hero stack: back + category → title → **Key takeaway** (frosted, full hero width) → date · read time.
- Reading column **56rem** (with TOC rail ~70rem); mid-article images break out wider than text.
- TOC: sticky minimal **rail** (dots + labels) on desktop; `<details>` on mobile.
- Related posts: full-bleed horizontal **strip** below the article (not boxed cards in the main column).
- FAQ / author: hairline separators instead of heavy bordered cards.
- Brand chrome unchanged (`MediaNav` / `MediaFooter`); markdown → HTML + `@seo/blog` pipeline unchanged.
- Blog **index** not redesigned in this pass (`LeadPost` still unused vs Jul 24 plan).

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/pages/blog/[slug].astro` | Immersive article markup (`blog-page--immersive`) |
| `apps/cae/src/components/blog/blog-page.css` | Immersive + index styles |
| `apps/cae/src/components/blog/TableOfContents.astro` | TOC rail |
| `apps/cae/src/components/blog/RelatedPosts.astro` | Continue-reading strip |
| `apps/cae/src/components/blog/KeyTakeaway.astro` | Callout (hero-scoped CSS) |

## Affects

- [sites/cae.md](../sites/cae.md) — public post UI description
- [overview.md](../overview.md) — public blog surface note
- [glossary.md](../glossary.md) — Immersive Story; Key takeaway placement
- [sources/cae-homepage-blog-bento.md](cae-homepage-blog-bento.md) — “does not change” line (slug UI did change)

## Open questions / deferred (from raw)

1. Wire or drop unused index `LeadPost` vs Jul 24 magazine plan
2. TOC active-section scroll spy (styles ready; no JS this pass)
3. Further hero/width polish from live preview
4. Ingest older Jul 24 blog redesign / reading-paper raws (reading-paper article surface is superseded)

## Does not change

- Homepage Insights soft bento
- Admin authoring / scheduling / bulk import
- Media & Press GHL lift
- Supabase schema / `@seo/blog` public query contract
