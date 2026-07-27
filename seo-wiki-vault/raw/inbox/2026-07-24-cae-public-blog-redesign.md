# Session notes: CAE public blog redesign (GHL chrome + magazine UI)

**Date:** 2026-07-24  
**Kind:** Chat / implementation notes after redesign  
**Related:**  
- `docs/cae-blog-full-redesign-plan.md`  
- `apps/cae/CONTEXT.md`  
- `apps/cae/src/components/blog/BlogLayout.astro`  
- `apps/cae/src/components/blog/blog-page.css`  
- Prior raw: `raw/inbox/2026-07-23-cae-admin-blog-posting-accepted.md`  
**Topic:** Why blog had separate chrome; redesign so `/cae/blog` and `/cae/blog/[slug]` share home/media GHL header/footer and use a modern magazine reading UI.

---

## Problem (audit)

Public blog v1 (Admin waves T11) used a **custom** `BlogNav` / `BlogFooter` + `blog-chrome.css` inside `BlogLayout`, intentionally kept off the GHL stack so articles stayed a light editorial column.

That created a **site break**: Blog felt like a different product from homepage / Media & Press (which use GHL section-lift nav/footer).

Slug UI was functional but scaffold-like: narrow ~42–56rem shell, small hero, utilitarian stack, list-row index.

---

## Decisions locked

1. **Header + footer = home family** — reuse GHL Media nav/footer (same visual system as home/media).
2. **Article body stays native** — not a GHL HTML lift; magazine CSS under `.blog-page`.
3. **Modern editorial redesign** of index + slug (not another polish pass).
4. Keep Supabase data model, Admin, JSON-LD helpers, markdown → HTML pipeline.

**Chrome choice:** Mirror Media page pattern (`MediaNav` + `MediaFooter`) so Success Stories links stay base-aware (`{BASE}/#section-…`). Home `Nav` alone uses bare `#section-…`, which breaks off-home.

Home + Media GHL nav fragments also gained a **BLOG** item → `/cae/blog/` (tokens `__GHL_INTERNAL_BLOG__` / `__GHL_BLOG__` remapped in `remapHtml.ts` / `remapMediaHtml.ts`).

---

## What shipped

### Layout / chrome

| Before | After |
|--------|--------|
| `BlogNav` + `BlogFooter` + `blog-chrome.css` | `MediaNav` + `MediaFooter` + GHL `ghl-runtime.css` + `media-page.css` + `host-patch.css` |
| Isolated dark chrome | Same sticky GHL header / footer as Media |

Deleted from public path: `BlogNav.astro`, `BlogFooter.astro`, `blog-chrome.css`, old `blog.css`, `blog-lead.css`, `blog-post-sections.css`.

New: `blog-page.css` scoped under `.blog-page`.

### Index `/cae/blog`

- Intro band: **Insights** + lede  
- Featured newest Post: hero + category + title + excerpt + meta + “Read article →”  
- Remaining Posts: image-led **grid tiles** (not hairline list rows)  
- Empty state when zero published Posts  
- CollectionPage / Blog JSON-LD via `data/blog/jsonld.ts`

### Post `/cae/blog/[slug]`

- Full-bleed hero with scrim; category eyebrow + title on/under hero  
- Content shell ~**80vw** (capped) — reading column no longer ~42rem-only  
- Author byline includes **publish date · reading time** (date removed from hero meta)  
- Key takeaway, sticky TOC (desktop) / `<details>` (mobile), body prose  
- FAQ as `<details>` accordion  
- Sources; related as image cards  
- BlogPosting + FAQPage JSON-LD when FAQ present  
- 404 for missing / unpublished

### Plan doc

Implementation plan + checklist: `docs/cae-blog-full-redesign-plan.md` (marked implemented W1–W4).

---

## Key paths

| Path | Role |
|------|------|
| `apps/cae/src/components/blog/BlogLayout.astro` | Document + GHL chrome + SeoHead |
| `apps/cae/src/components/blog/blog-page.css` | Magazine index + article styles |
| `apps/cae/src/pages/blog/index.astro` | Insights + LeadPost + grid |
| `apps/cae/src/pages/blog/[slug].astro` | Hero + byline meta + wide shell |
| `apps/cae/src/components/blog/LeadPost.astro` | Featured tile |
| `apps/cae/src/components/blog/PostCard.astro` | Grid tile |
| `apps/cae/src/components/blog/AuthorByline.astro` | Author + date + reading time |
| `apps/cae/src/data/blog/jsonld.ts` | Index + post structured data |
| `apps/cae/src/components/ghl/fragments/nav.html` | Home nav + BLOG link |
| `apps/cae/src/components/ghl/media/fragments/nav.html` | Media/blog shared nav + BLOG link |

---

## Still deferred (unchanged)

- Shared **CMS** (`apps/cms`)  
- Scheduled publishing / Featured posts  
- Category/tag archive routes / pagination  
- Public tags on blog UI  
- Production SSR host cutover beyond static-only Vercel assumptions  

---

## Smoke (redesign)

1. Gateway or CAE alone: open `/cae/` — nav shows **BLOG**.  
2. `/cae/blog` — GHL nav/footer match Media; featured lead + grid.  
3. `/cae/blog/[slug]` — GHL chrome; wide content (~80%); date under author; TOC/FAQ/related.  
4. Success Stories from blog → home hash; Media / Home / Blog links under `/cae` base.  
5. View-source: JSON-LD on index + post.  
6. Optional: 375px / 1280px visual check on Zi Wei post.

---

## Open / follow-ups

- Ingest this raw into `wiki/sources/` and sync `wiki/sites/cae.md` (blog chrome + UI claims; BaseLayout note is stale — blog no longer uses BaseLayout).  
- Confirm first published post (intro Zi Wei Dou Shu) still looks correct after width/byline tweak.  
- Consider deleting parked `components/home/*` after marketing acceptance (unrelated, still open on site page).
