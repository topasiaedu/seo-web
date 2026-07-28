# Session notes: Dr Jasmine homepage Health Insights band (Option B)

**Date:** 2026-07-28  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Prior raw:**  
- `raw/inbox/2026-07-28-dr-jasmine-home-ia-and-polish.md` (locked “no invented blog band”; **superseded for home blog only**)  
- `raw/inbox/2026-07-27-cae-homepage-blog-bento.md` (CAE pattern reference — soft bento; DJ chose equal tiles)  
**Related code:**  
- `apps/dr-jasmine/src/pages/index.astro`  
- `apps/dr-jasmine/src/components/home/HomeBlog.astro`  
- `apps/dr-jasmine/src/components/home/home.css`  
- `apps/dr-jasmine/src/components/blog/PostCard.astro`  
- `apps/dr-jasmine/src/components/blog/blog-page.css`  
- `apps/dr-jasmine/src/styles/blog-tokens.css`  
- `packages/blog` (`listPublishedPostsPage`)  
**Topic:** Wire the newest published Posts onto the marketing homepage as an image-led Health Insights band (Option B).

---

## Context

Home was GHL-sourced conversion bands only (Hero → Discover → Meet → Proof → Workshop CTA → FAQ). Public blog already lived at `/dr-jasmine/blog` (SSR + Supabase + `PostCard` tiles). Goal: surface recent Posts on home for trust/SEO without competing with workshop conversion.

Prior home IA polish explicitly omitted homepage blog. This session **revises that**: add a blog teaser band; keep GHL wording on workshop bands unchanged.

---

## Design options considered

| Option | Layout | Outcome |
|--------|--------|---------|
| A | Compact text cards (revive dead `.dj-home-blog__*` link cards) | Not chosen |
| **B** | **Equal image-led tiles via existing `PostCard`** | **Locked** |
| C | Featured + 2 side list | Not chosen |
| D | Single featured strip | Not chosen |

### Locked UI (Option B)

- **Count:** latest **3** live posts (`listPublishedPostsPage` limit 3)
- **Placement:** after Proof (testimonials), before Workshop closing CTA
- **Empty state:** omit entire section when 0 live posts
- **Copy:** align with `/blog` — eyebrow `Blog`, heading `Health Insights`, lede matching index description, `View all` → `/blog`
- **Tiles:** reuse `PostCard` (hero, category, title, excerpt, date · read time)
- **Heading a11y:** `PostCard` gained optional `titleTag` (`h2` default on index; home passes `h3`)

---

## Data / SSR

- Home already `prerender = false`.
- Fetch in `pages/index.astro`: `requireBlogSupabase` + `listPublishedPostsPage(supabase, projectId, { limit: 3, offset: 0 })`.
- Chronological newest-first only — no featured/pin flag (still deferred).

---

## Implementation notes

1. **`HomeBlog.astro`** — soft section chrome + header + `<ul class="blog-grid">` of `PostCard`s; imports `blog-tokens.css` + `blog-page.css`.
2. **`home.css`** — define `--blog-*` / `--cae-*` vars on `.dj-home-blog` so tiles work **without** wrapping in `.blog-page` (avoids ivory radial + min-height bleed). Removed unused Option A text-card rules (`.dj-home-blog__link`, etc.).
3. Grid breakpoints come from `.blog-grid` (1 → 2 @640 → 3 @1024), same as blog index.

### Homepage order (current)

```text
Hero → Discover → Meet Doctor → Proof → Health Insights (HomeBlog)
→ Workshop CTA → FAQ
```

---

## Out of scope / deferred

- Featured DB flag for homepage pin (`docs/future-enhancements/featured-posts.md`)
- Changing `/blog` index layout or pagination
- Soft-bento / featured+side layouts (Options C–D / CAE bento)
- Invented workshop marketing copy outside this insights band

---

## Smoke checklist

- [ ] `/dr-jasmine/` shows Health Insights after Proof when ≥1 published Post
- [ ] At most 3 tiles; newest first
- [ ] 0 live posts → band absent
- [ ] View all → `/dr-jasmine/blog`
- [ ] Card titles are `h3` under section `h2`
- [ ] Tile hover / images match blog index look
