# Session notes: Dr Jasmine Admin brand theme + light blog readability

**Date:** 2026-07-28  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Prior raw:**  
- `raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md`  
- `raw/inbox/2026-07-28-dr-jasmine-home-ia-and-polish.md`  
**Related code:**  
- `apps/dr-jasmine/src/styles/admin-theme.css`  
- `apps/dr-jasmine/src/styles/admin-shell.css`  
- `apps/dr-jasmine/src/styles/tokens.css`  
- `apps/dr-jasmine/src/styles/blog-tokens.css`  
- `apps/dr-jasmine/src/components/blog/blog-page.css`  
- `apps/dr-jasmine/src/components/blog/BlogLayout.astro`  
- `apps/dr-jasmine/src/pages/blog/[slug].astro`  
- `apps/dr-jasmine/src/lib/markdown.ts`  
- `apps/dr-jasmine/src/components/blog/AuthorByline.astro`  
- `apps/dr-jasmine/src/components/blog/AuthorCard.astro`  
- `apps/dr-jasmine/src/components/blog/FaqSection.astro`  
- `apps/dr-jasmine/src/components/admin/BodyEditor.tsx`  
- `apps/dr-jasmine/src/site-config.ts` (`projectId` / `social`)

---

## Summary

Aligned Dr Jasmine **Admin** chrome to the public Forest/Ivory brand palette (was leftover CAE purple). Converted public **blog index + slug** from dark navy/purple immersive surfaces to **light ivory** readability. Improved slug article UX (promise-first lead, body breathing patterns, list/FAQ polish) without narrowing the reading column. Confirmed Admin/blog features share `@seo/blog` behavior with CAE but are **scoped by `site_id`** (DJ `…0002` vs CAE `…0001`).

---

## Locked product / architecture facts

| Topic | Fact |
|-------|------|
| Shared DB | Same Supabase `posts` / authors / categories tables as CAE |
| Isolation | Every query/write filters by brand `sites.id` (`projectId`) |
| DJ `projectId` | `00000000-0000-4000-8000-000000000002` |
| CAE `projectId` | `00000000-0000-4000-8000-000000000001` |
| Feature parity | Draft / Published / Scheduled (label) / Archived, TipTap body, FAQ, sources, tags, categories, Author, bulk import, live `published_at` gate — same package, separate UI apps |
| Cross-post | A DJ Admin post **does not** appear on CAE blog/admin |

---

## What shipped (2026-07-28)

### Admin color scheme

- Remapped `--admin-*` light + dark tokens from purple to **warm ivory + forest green + soft gold** (match `tokens-public.css`).
- Updated `:root` fallbacks in `admin-shell.css`, scaffold `tokens.css`.
- Admin + login load `public-fonts.css` (Plus Jakarta Sans).
- Draft status badges use gold tint; published stays forest.

### Blog light readability

- `blog-tokens.css` → ivory bg `#faf8f5`, forest accent `#2d5e4c`, stone text; fonts DM Serif Display + Plus Jakarta Sans.
- `blog-page.css` remapped off dark purple/navy; BlogLayout main bg ivory.
- **H1** (hero title + index title) → solid brand green `#2d5e4c`; **H2/H3** stay dark stone (size hierarchy only for H2/H3).

### Slug content design (width unchanged)

Promise-first lead:

1. Hero (title + date/reading; category solid forest chip)  
2. Key takeaway (larger)  
3. Excerpt as full-width dek (same width as takeaway)  
4. Compact byline (no bio) + **Instagram / LinkedIn** pills from `site-config.social`  
5. Body  
6. End matter: tags → FAQ → sources → author card (socials also on author card)

Section beats: each body `##` gets top rule + extra spacing.

Markdown breathing conventions (`lib/markdown.ts` + CSS):

| Markdown | Renders as |
|----------|------------|
| `> quote` | Pull quote |
| `> In clinic: …` / `Tip:` | Clinic callout |
| `**1.2 points** — meaning` | Key number / stat |
| Ordered lists | Numbered step cards |
| Unordered lists | Green `→` markers (no row chrome / no circle bg) |

Admin BodyEditor gained a **Quote** toolbar button (start with `In clinic:` for callout). Bulk import template documents these conventions.

FAQ accordion: green chevron on summary; rotates when open.

### Explicit non-goals this pass

- Did **not** narrow reading measure (column stays ~56rem / TOC ~70rem).
- Did not change CAE blog/admin UI.
- Did not change Supabase schema or `@seo/blog` API contracts beyond DJ markdown renderer conventions.

---

## Key paths

| Path | Role |
|------|------|
| `styles/admin-theme.css` / `admin-shell.css` | Admin light/dark brand tokens |
| `styles/blog-tokens.css` | Public blog light tokens |
| `components/blog/blog-page.css` | Index + slug magazine CSS |
| `pages/blog/[slug].astro` | Promise-first lead + end matter order |
| `lib/markdown.ts` | TOC + pull quote / callout / stat rendering |
| `components/blog/AuthorByline.astro` | Lead byline + social pills |
| `components/blog/FaqSection.astro` | FAQ chevron |

---

## Open / follow-ups

1. Optional: star marker instead of arrow for `ul` if preferred.  
2. Optional: TipTap toolbar helpers for “In clinic” / key-number snippets.  
3. Human visual QA: long posts with many lists/FAQs on Opera GX (SVG `data:` icons were unreliable; Unicode arrow used instead).  
4. Keep wiki `sites/dr-jasmine.md` in sync with home IA collapse (separate raw `2026-07-28-dr-jasmine-home-ia-and-polish.md` if not yet ingested).

---

## Does not change

- Site-scoped data model (`site_id`)  
- Gateway ports / Astro `base`  
- GHL archive under `components/ghl/`  
- CAE Immersive Story (dark) blog — DJ diverged to light readability on purpose  
