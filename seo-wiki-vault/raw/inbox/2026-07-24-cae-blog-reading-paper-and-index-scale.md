# Session notes: CAE blog reading paper, index scale, tags, author card

**Date:** 2026-07-24  
**Kind:** Chat / implementation session  
**Related:**
- Prior redesign raw: `raw/inbox/2026-07-24-cae-public-blog-redesign.md`
- Plan (earlier magazine chrome): `docs/cae-blog-full-redesign-plan.md`
- Partner reference (index UX): https://jacksonyew.com/blog
- Runtime: `apps/cae/` (`@seo/cae`, `base: "/cae/"`)
- Package: `packages/blog/` (`@seo/blog`)
**Topic:** Improve long-form readability on `/cae/blog/[slug]`, scale `/cae/blog` for 100+ posts, surface tags + end-of-article author card.

---

## Context

After the GHL-chrome magazine redesign (same-day raw above), slug reading still felt hard: headings and body were near-identical lavender-whites on continuous dark purple, and the index would dump every post into one endless grid (featured lead + all remaining rows) — not viable at 100+ posts.

---

## Decisions from session

1. **Light reading paper on slug (locked).** Keep purple GHL nav / full-bleed hero / footer. From byline through related posts, article sits on a light CAE press-band surface (`--cae-press-bg: #f9f1ff`) with dark ink — not continuous dark-violet prose.
2. **Index follows Jackson-style discovery.** Category filter chips + uniform dense card grid + pagination. Drop the oversized featured `LeadPost` from the public index path (component file may remain unused for a future Featured flag).
3. **Page size = 12** published posts; query params `?category=<slug>` and `?page=<n>` (page 1 omits `page`).
4. **Tags:** Admin free-form `string[]`; already fed into BlogPosting JSON-LD `keywords`. No `/blog/tag/…` routes yet — categories own browsing. Show tag chips on the slug page (display only).
5. **Author card:** End-of-article “Written by” block with name, photo (or initial), optional bio, and social pills from homepage Connect data (`homeCta.social` — Instagram + Facebook only today). CAE lavender paper styling, not a copy of partner neo-brutalist cream/orange.

---

## What shipped (code)

### Slug — light reading paper

| Path | Role |
|------|------|
| `apps/cae/src/pages/blog/[slug].astro` | `blog-page--article` on main; wrap shell contents in `blog-article-paper` |
| `apps/cae/src/components/blog/blog-page.css` | Paper shell + scoped dark-on-light overrides for byline, takeaway, TOC, prose, FAQ, sources, related |

Notable CSS:
- `.blog-page--article` — solid brand purple ground (no violet radial wash under the article)
- `.blog-article-paper` — light bg, dark ink tokens, H2 size step + lavender rule under H2
- Index tiles/lead styles remain on the dark magazine palette (scoped so paper overrides don’t leak)

### Index — filters + pagination

| Path | Role |
|------|------|
| `packages/blog/src/posts-public.ts` | New `listPublishedPostsPage` (category slug + limit/offset + total count); keep `listPublishedPosts` for related-post resolution |
| `packages/blog/src/types.ts` | `ListPublishedPostsOptions`, `PublishedPostsPage` |
| `packages/blog/src/index.ts` | Re-exports |
| `apps/cae/src/pages/blog/index.astro` | Intro + category chips + uniform `PostCard` grid + pager; no `LeadPost` |
| `apps/cae/src/components/blog/PostCard.astro` | Category eyebrow above title; date · read time meta |
| `apps/cae/src/components/blog/blog-format.ts` | `buildBlogIndexHref(base, { categorySlug, page })` |
| `apps/cae/src/components/blog/blog-page.css` | Filter chips, denser tiles (2-line excerpt clamp), pagination |

Invalid / unknown `category` query → treated as “All posts”. Out-of-range `page` clamps to last page.

### Tags on slug

| Path | Role |
|------|------|
| `apps/cae/src/components/blog/PostTags.astro` | Non-link chips from `post.tags` |
| `apps/cae/src/pages/blog/[slug].astro` | Renders under byline, above key takeaway |
| Paper CSS | Light-surface chip styles under `.blog-article-paper` |

### Author card on slug

| Path | Role |
|------|------|
| `apps/cae/src/components/blog/AuthorCard.astro` | Name / photo / bio + `homeCta.social` pills |
| `apps/cae/src/pages/blog/[slug].astro` | After sources, before related |
| `apps/cae/src/data/home/cta.ts` | Source of Instagram + Facebook hrefs |

Fallback name when author missing: `"Cae Goh"`. Photo empty → initial circle.

---

## Tags vs categories (clarified)

| | Categories | Tags |
|--|------------|------|
| Storage | `categories` table + `posts.category_id` | `posts.tags` `text[]` |
| Admin | CRUD list + post picker | Free-form chip input |
| Public browse | Index filter chips (`?category=`) | Not yet (no tag routes) |
| SEO | Article section / grouping | JSON-LD `keywords` |
| Slug UI | Hero eyebrow | Chip row under byline |

---

## Still deferred

- Tag archive routes / clickable tags that filter the index  
- Featured DB flag + optional lead pin (`docs/future-enhancements/featured-posts.md`)  
- More social networks on author card (only IG + FB exist in `homeCta` today)  
- Author “title / role” field and “full story” about-page link (partner card had these; CAE lacks routes/fields)  
- Shared CMS (`apps/cms`)  
- Scheduled publishing  

---

## Smoke

1. `/cae/blog/[slug]` — purple hero + light reading column; H2s clearly darker/larger than body.  
2. Tags appear under byline when the post has tags.  
3. Author card near end shows name + IG/FB; photo if Admin author has `photo_url`.  
4. `/cae/blog` — chips (All + categories); 3-col grid; no giant featured lead.  
5. With enough posts: `?page=2` pager; `?category=<slug>` filters and resets paging.  
6. Typecheck/build: `pnpm --filter @seo/cae typecheck` / `build`.

---

## Open / follow-ups

- Ingest this raw (+ prior `2026-07-24-cae-public-blog-redesign.md` if not yet) into `wiki/sources/` and sync `wiki/sites/cae.md` + `wiki/packages/blog.md` (pagination API, reading paper, index chips).  
- Prior redesign raw still listed pagination / public tags as deferred — those claims are now outdated for this follow-up.  
- Optional: delete or repurpose unused `LeadPost.astro` when Featured ships.
