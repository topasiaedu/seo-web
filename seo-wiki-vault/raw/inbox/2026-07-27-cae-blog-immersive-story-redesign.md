# Session notes: CAE blog post — Immersive Story redesign

**Date:** 2026-07-27  
**Kind:** Chat / implementation notes  
**Related:**  
- `apps/cae/src/pages/blog/[slug].astro`  
- `apps/cae/src/components/blog/blog-page.css`  
- `apps/cae/src/components/blog/TableOfContents.astro`  
- `apps/cae/src/components/blog/RelatedPosts.astro`  
- `apps/cae/src/components/blog/KeyTakeaway.astro`  
- Prior plan: `docs/cae-blog-full-redesign-plan.md`  
- Prior raw: `raw/inbox/2026-07-24-cae-public-blog-redesign.md`  
- Prior raw: `raw/inbox/2026-07-24-cae-blog-reading-paper-and-index-scale.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-blog-post-polish-and-bulk-seo-fix.md`  
**Topic:** Replace the light “Wikipedia paper” article body with an Immersive Story layout (option C) on `/cae/blog/[slug]`, then tune hero / takeaway / reading width from live preview.

---

## Problem

After the Jul 24 magazine redesign, the **post detail** still felt like a docs/wiki page:

- Dark full-bleed hero → abrupt **light lavender paper** (`.blog-article-paper`, `#f9f1ff`)
- H2s with underline rules, wide line length (`80vw` / `80rem` shell), bordered TOC / FAQ / author / related cards
- Reading surface felt text-only and utilitarian — bad for someone browsing blogs

Index magazine tiles stayed dark; article body felt like a different product.

---

## Design choice

Presented three directions; user picked **C — Immersive Story**:

| Option | Summary |
|--------|---------|
| A Editorial Magazine | Dark continuous, ~42rem column, no paper |
| B Soft Atelier | Designed light reading surface |
| **C Immersive Story** | Cinematic hero, dark continuous scroll, breakout images, minimal TOC rail, related strip |

Shared goals regardless of option: narrower-than-80rem measure, Archivo Black H2s, less card clutter, richer prose (code/tables/hr).

---

## What shipped (Immersive Story)

### Layout / structure (`[slug].astro`)

```text
BlogLayout (unchanged MediaNav/Footer)
└ main.blog-page.blog-page--article.blog-page--immersive
   └ article
      ├ header.blog-post-hero
      │    media + scrim
      │    back + category
      │    H1 title
      │    KeyTakeaway (when set)
      │    date · reading time
      ├ shell
      │    blog-article [--with-toc]
      │       TOC rail | main (byline, tags, body, FAQ, sources, author card)
      └ RelatedPosts (full-bleed horizontal strip)
```

Removed: `.blog-article-paper` light reading wrapper and the separate full-bleed takeaway band between hero and body.

### Visual / CSS (`blog-page.css`)

| Area | Behavior |
|------|----------|
| Page ground | Continuous dark purple; light paper styles removed from article path |
| Hero | Taller cinematic frame; optional ken-burns on hero image; title on wide shell |
| Key takeaway | Inside hero under title; frosted panel; full width of hero inner (same as title) |
| Meta | Date · read time **below** takeaway (or under title if no takeaway) |
| Reading column | **56rem** main; with TOC up to ~**70rem** (`56rem` + rail) |
| TOC | Desktop: minimal sticky **rail** (dots + labels); mobile: `<details>` |
| Body | Archivo Black H2s; lavender H3s; italic blockquotes; code/pre/table/hr styles |
| Images | Mid-article images **break out** wider than the text column |
| FAQ / author | Borderless / hairline separators instead of heavy cards |
| Related | Horizontal image-led **strip** at page bottom (scroll-snap on wider viewports) |

### Components touched

| File | Change |
|------|--------|
| `TableOfContents.astro` | Rail markup (`blog-toc--rail`, dots + labels) |
| `RelatedPosts.astro` | Moved out of main column; `blog-related-strip` wrapper |
| `KeyTakeaway.astro` | Unchanged API; styled via hero-scoped CSS |

---

## Live preview tuning (same session)

1. Dropped hero inner `width: min(100%, 42rem)` → hero uses `--blog-wide` again.  
2. Moved key takeaway into hero (was a separate band).  
3. Takeaway width = title width; date/read time moved under takeaway.  
4. Widened body from **42rem → 56rem**.

Stopping point: user happy with immersive slug for now; index not redesigned in this pass.

---

## Key paths

| Path | Role |
|------|------|
| `apps/cae/src/pages/blog/[slug].astro` | Immersive article markup |
| `apps/cae/src/components/blog/blog-page.css` | Immersive + index styles (paper block removed from article path) |
| `apps/cae/src/components/blog/TableOfContents.astro` | Minimal TOC rail |
| `apps/cae/src/components/blog/RelatedPosts.astro` | Continue-reading strip |
| `apps/cae/src/styles/tokens.css` | Brand colors/fonts (unchanged) |

---

## Still deferred / open

- Blog **index** featured `LeadPost` still unused vs Jul 24 plan  
- TOC active-section scroll spy (aria-current styling exists; JS highlight not required this pass)  
- Further width/hero polish if preview feedback continues  
- Wiki **ingest** into `wiki/sources/` + `wiki/sites/cae.md` (raw only for this stop)

---

## Takeaway

Public CAE post pages now read as a **dark immersive feature article** (hero → takeaway → story column → related strip), not a light wiki paper under a marketing hero. Brand chrome (GHL MediaNav/Footer) and data/markdown pipeline unchanged.
