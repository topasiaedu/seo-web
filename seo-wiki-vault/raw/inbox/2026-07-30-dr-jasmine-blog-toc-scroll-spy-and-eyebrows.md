# Session notes: Dr Jasmine blog TOC scroll-spy + section eyebrows

**Date:** 2026-07-30  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Related:**  
- Prior CAE immersive blog: `raw/inbox/2026-07-27-cae-blog-immersive-story-redesign.md`  
- Prior DJ blog readability: `raw/inbox/2026-07-28-dr-jasmine-admin-theme-and-blog-readability.md`  
- Commit: `c60d701` on `main` (pushed) — DJ only  
**Code touched (DJ):**  
- `apps/dr-jasmine/src/components/blog/TableOfContents.astro`  
- `apps/dr-jasmine/src/components/blog/FaqSection.astro`  
- `apps/dr-jasmine/src/components/blog/SourcesSection.astro`  
- `apps/dr-jasmine/src/components/blog/RelatedPosts.astro`  
- `apps/dr-jasmine/src/components/blog/blog-page.css`  
**Topic:** After comparing CAE vs DJ public blog `[slug]` pages, surgically ported only **TOC scroll-spy** and **section eyebrows** to Dr Jasmine. Left CAE-only hero chrome / theme / favicon / OG gaps out of scope.

---

## Context — CAE vs DJ blog slug gap analysis

Shared already (both sites): immersive hero shell, TOC rail + mobile details, key takeaway, byline, tags, FAQ, sources, author card, related posts, `BlogPosting` JSON-LD, core OG/Twitter meta, shared `@seo/blog` model.

**CAE-only items identified (not all ported):**

| Feature | Ported to DJ? |
|---------|---------------|
| TOC scroll-spy (`aria-current` on scroll) | **Yes** |
| Section eyebrows (FAQ / Sources / Related) | **Yes** |
| AuthorCard “Written by” eyebrow | Already present on DJ — no change |
| Hero starfield / scrim / brand eyebrow / takeaway-in-hero | No |
| Dark theme boot + public theme toggle + display fonts | No |
| Favicon + logo OG fallback | No |

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Scope | **TOC scroll-spy + section eyebrows only** |
| 2 | Eyebrow tone | Clinic-toned labels (not CAE’s “Clarity”) |
| 3 | FAQ eyebrow | `Common questions` |
| 4 | Sources eyebrow | `References` |
| 5 | Related eyebrow | `Keep reading` |
| 6 | AuthorCard | Leave unchanged (`Written by` already styled) |
| 7 | Eyebrow CSS | Match DJ tokens (`.blog-author-card__eyebrow` / `.blog-index-intro__eyebrow`) — **do not** import CAE `.cae-eyebrow` |
| 8 | Active TOC style | Separate `[aria-current="true"]` from hover; `font-weight: 700` — no CAE dark/light theme forks |

---

## What shipped

### 1. TOC scroll-spy

Port of CAE script into DJ `TableOfContents.astro`:

- `data-blog-toc` on desktop `<nav>` and mobile `<details>`
- Reads `--blog-nav-offset` from `.blog-page` (+ 12px)
- rAF-throttled scroll/resize; sets `aria-current="true"` on the active section link
- Re-inits on `astro:page-load`
- Cleanup on re-init to avoid duplicate listeners

`blog-page.css`: hover and `aria-current` no longer share one rule; active link is bold.

### 2. Section eyebrows

| Component | Markup | Copy |
|-----------|--------|------|
| `FaqSection.astro` | `.blog-section__eyebrow` | Common questions |
| `SourcesSection.astro` | `.blog-section__eyebrow` | References |
| `RelatedPosts.astro` | `.blog-related-strip__eyebrow` | Keep reading |

CSS: uppercase, teal (`--cae-lavender-bright` / `#2d5e4c`), `letter-spacing: 0.12em`, same weight as existing DJ eyebrows.

---

## Out of scope (unchanged)

- Hero starfield, scrim, brand eyebrow, takeaway placement in hero
- `PublicThemeBoot` / light-dark toggle / Google Fonts on blog layout
- Favicon / default OG logo fallback in `SeoHead`
- CAE Facebook social wiring; DJ keeps Instagram + LinkedIn
- Article comments, share buttons, breadcrumbs (neither site has these)
- Content order (DJ lead/endmatter vs CAE byline-above-body) — left as-is

---

## Verify

On a published DJ `/blog/[slug]` with headings + FAQ/sources/related:

1. Scroll — TOC rail highlights the current H2 (`aria-current`)
2. FAQ / Sources / Related show uppercase eyebrows above titles
3. Author card still shows “Written by” only (no duplicate change)

---

## Open / follow-ups

- Optional later ports: favicon + logo OG fallback; stronger TOC rail active border (CAE gold/left-bar style) if design wants more contrast
- Wiki ingest still needed: `wiki/sources/…` + `sites/dr-jasmine.md` + `index.md` / `log.md` after this raw lands
