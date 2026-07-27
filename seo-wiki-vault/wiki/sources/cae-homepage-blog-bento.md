# Source: CAE homepage Blog band (Offerings → soft bento)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-27-cae-homepage-blog-bento.md](../../raw/inbox/2026-07-27-cae-homepage-blog-bento.md) |
| Ingested | 2026-07-27 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related prior | Public blog redesign notes in `raw/inbox/2026-07-24-cae-public-blog-redesign.md` (not yet a separate wiki source) |

## Takeaways

- Homepage now surfaces the **newest 4 published Posts** in a Blog / Insights band after Press (replacing the GHL Offerings section “LIFE STARTS AT YOUR FULL POTENTIAL”).
- Offerings GHL artifacts remain in the tree but are **unwired** (not deleted).
- Home route is **SSR** (`prerender = false`) so Supabase middleware can feed `listPublishedPostsPage`.
- Locked UI: **Option D soft bento** — feature cell (2×2) for newest Post + supporting cells; collapses for 1–3 Posts; stacks on mobile.
- Section `id="insights"`; hero LEARN MORE remapped from `#offerings` / `#section-gZkeGFtHWF` → `#insights`.
- CTA: purple **View all blog** button → `/cae/blog`.
- Empty published set hides the section entirely.
- Featured DB pin remains deferred; homepage order is chronological newest-first only.

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/pages/index.astro` | SSR home; fetches 4 published Posts |
| `apps/cae/src/components/HomePage.astro` | Composes Blog band after Press |
| `apps/cae/src/components/home/HomeInsights.astro` | Soft bento UI |
| `apps/cae/src/components/home/home-insights.css` | Bento + responsive collapse |
| `apps/cae/src/data/home/hero.ts` | `ctaHref: "#insights"` |
| `apps/cae/src/components/ghl/remapHtml.ts` | Remaps Offerings hash → `#insights` |

## Homepage order (locked)

```text
LogoBar → Nav → Hero → Press → Blog (HomeInsights) → Pillars → Platform
→ SocialProof → TestimonialCarousel → Connect → Footer
```

## Affects

- [sites/cae.md](../sites/cae.md) — home SSR + Blog band; Offerings unwired
- [overview.md](../overview.md) — home Insights module + SSR note
- [architecture/overview.md](../architecture/overview.md) — CAE home pulls live Posts

## Open questions / deferred (from raw)

1. Featured DB flag for homepage pin (`docs/future-enhancements/featured-posts.md`)
2. Whether to delete unused Offerings fragments after superior acceptance
3. Pillars light bar was designed to overlap Offerings — visual QA vs live GHL
4. Align `/cae/blog` index styling with homepage bento (homepage-only for now)

## Does not change

- Public `/cae/blog` + `/cae/blog/[slug]` magazine redesign
- Admin authoring model
- Media & Press GHL lift
