# Session notes: CAE homepage Blog band (replace Offerings + soft bento)

**Date:** 2026-07-27  
**Kind:** Chat / implementation notes  
**Related:**  
- `apps/cae/src/components/home/HomeInsights.astro`  
- `apps/cae/src/components/home/home-insights.css`  
- `apps/cae/src/components/HomePage.astro`  
- `apps/cae/src/pages/index.astro`  
- `apps/cae/src/data/home/hero.ts`  
- `apps/cae/src/components/ghl/remapHtml.ts`  
- Prior raw: `raw/inbox/2026-07-24-cae-public-blog-redesign.md`  
**Topic:** Wire recent Posts onto the marketing homepage; replace the GHL Offerings (“LIFE STARTS AT YOUR FULL POTENTIAL”) section with a Blog band; redesign that band as a soft bento (Option D).

---

## Context

Homepage was GHL section-lift only (no live blog module). Public blog already lived at `/cae/blog` (SSR + Supabase). Goal: surface the newest published Posts on home without duplicating the full archive.

---

## Placement decisions

1. **First attempt:** Insights band after testimonials / before Connect (soft content before hard CTA).
2. **Revised (locked):** Remove that late Insights slot. Replace the **Offerings** block (`section-gZkeGFtHWF`, headline “LIFE STARTS AT YOUR FULL POTENTIAL”) with the Blog band — after Press, before Pillars.
3. Offerings artifacts (`ghl/Offerings.astro`, `fragments/offerings.html`, `data/home/offerings.ts`) left **unwired**, not deleted.
4. Section anchor: `id="insights"`. Hero LEARN MORE remapped from `#offerings` / `#section-gZkeGFtHWF` → `#insights` (native `homeHero.ctaHref` + `remapHtml.ts` + lift script defaults).

---

## Data / SSR

- Home route [`pages/index.astro`](apps/cae/src/pages/index.astro): `prerender = false` so middleware wires Supabase.
- Fetch: `listPublishedPostsPage(..., { limit: 4, offset: 0 })` for `caeSiteConfig.projectId`.
- Empty published set → `HomeInsights` renders nothing (section hidden).

---

## UI evolution (same component)

File: `HomeInsights.astro` + `home-insights.css`.

| Stage | Layout |
|-------|--------|
| v1 | Equal 1×4 image tiles + text below / then square overlay cards |
| Polish | Thumbnail height / square card experiments; “View all blog” button CTA |
| **v2 (locked)** | **Option D soft bento** — newest post = feature 2×2; posts 2–3 = small top cells; post 4 = wide bottom cell |

### Soft bento (desktop ≥960px)

```text
┌──────────────────────┬───────────┬───────────┐
│                      │  Post 2   │  Post 3   │
│     FEATURE 2×2      ├───────────┴───────────┤
│   (newest + excerpt) │       Post 4 wide     │
└──────────────────────┴───────────────────────┘
```

- Count collapse: 1 = feature full width; 2 = feature + tall side; 3 = feature + two stacked side rows; 4 = full bento.
- Mobile / tablet: feature first, then stack (tablet may put support in 2 columns).
- Cells: image fill + bottom scrim + category / title / meta; feature also shows excerpt.
- Header: eyebrow “Blog”, title “Insights”, lede, purple **View all blog** button → `/cae/blog`.

### Design options considered (not shipped)

- A — Featured lead + 3 cards  
- B — Magazine split (feature left + mini stack)  
- C — Cinema banner + side rail  
- **D — Soft bento (chosen)**

---

## Homepage order (current)

```text
LogoBar → Nav → Hero → Press → Blog (HomeInsights) → Pillars → Platform
→ SocialProof → TestimonialCarousel → Connect → Footer
```

---

## Out of scope / deferred

- Featured DB flag for homepage pin (still `docs/future-enhancements/featured-posts.md`)
- Deleting Offerings GHL assets
- Changing Pillars / Platform / Connect layout for the missing Offerings overlap bar
- Redesigning `/cae/blog` index to match the bento (homepage-only)

---

## Smoke checklist

- [ ] `/cae` shows Blog after Press when ≥1 published Post
- [ ] Newest Post is visually dominant (feature cell)
- [ ] 1–4 Post counts look intentional (no broken grid holes)
- [ ] View all blog → `/cae/blog`
- [ ] Hero LEARN MORE scrolls to `#insights`
- [ ] 375px and ~1280px: no overflow, readable overlays
