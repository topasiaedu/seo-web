# Session notes: CAE blog post polish + bulk import `seo_title` fix

**Date:** 2026-07-27  
**Kind:** Chat / implementation notes  
**Related:**  
- `apps/cae/src/pages/blog/[slug].astro`  
- `apps/cae/src/components/blog/blog-page.css`  
- `apps/cae/src/components/blog/RelatedPosts.astro`  
- `apps/cae/src/components/admin/BulkImportForm.tsx`  
- `apps/cae/src/components/admin/PostForm.tsx`  
- `packages/blog/src/posts-admin.ts` (`createPost` / `updatePost` insert mapping)  
- Prior raw: `raw/inbox/2026-07-27-cae-admin-bulk-import.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-admin-postform-simplifications.md`  
- Prior raw: `raw/inbox/2026-07-24-cae-public-blog-redesign.md`  
**Topic:** Fix bulk Post import failing on `seo_title` NOT NULL; polish public post hero (back + category) and “Continue reading” to a full-width 3-up grid.

---

## 1. Bulk import failure — `seo_title` NOT NULL

### Symptom

Admin **Bulk import** preview showed 9 posts ready, then every row failed:

```text
@seo/blog createPost: null value in column "seo_title" of relation "posts" violates not-null constraint
```

### Cause

- DB columns (migration `20260723160000_blog_authors_categories_posts.sql`):  
  `seo_title text not null default ''`,  
  `seo_description text not null default ''`  
  (same pattern for hero/og/alt/key_takeaway).
- Postgres **defaults apply only when the column is omitted**. Explicit `NULL` still violates `NOT NULL`.
- `BulkImportForm.buildCreatePostInput` (and `PostForm` editorial payload) sent `seoTitle: null` / `seoDescription: null` meaning “no separate SEO copy; public pages fall back to title/summary.”
- `@seo/blog` `toPostInsert` / `toPostUpdate` wrote those nulls through unchanged.

### Fix

1. **`packages/blog/src/posts-admin.ts`** — `notNullText(value)` coerces `null` → `""` for NOT NULL text columns on create/update:  
   `seo_title`, `seo_description`, `hero_image_url`, `hero_image_alt`, `og_image_url`, `key_takeaway`.
2. **Callers** — BulkImportForm + PostForm send `seoTitle: ""` / `seoDescription: ""` instead of `null`.

Public SEO helpers already treat empty/blank `seoTitle` as fall back to post title (`resolvePostSeoTitle`).

### Takeaway

Domain “unset” for these columns is **empty string**, not SQL null. Package-level coercion protects all Admin/create callers.

---

## 2. Public post hero — back link + category

**Route:** `/cae/blog/[slug]`

### Before

- Plain text `← All articles` link.
- Category as shouting uppercase eyebrow (`.blog-post-hero__eyebrow`).

### After

- Nav row (`.blog-post-hero__nav`) above the title:
  - **Back:** frosted bordered **button** (chevron SVG + “All articles”), hover nudge + brighter fill.
  - **Category:** soft frosted label (same visual family); links to blog index filtered by category slug when present (`buildBlogIndexHref`).

Files: `[slug].astro` markup + `blog-page.css` (replaces `.blog-post-hero__eyebrow` usage on the slug hero).

---

## 3. “Continue reading” — 3-up full width

### Before

- Related cards lived inside `blog-article__main` (TOC sidebar column).
- Grid was `repeat(2, …)` from 640px → two columns + sticky “On this page” beside the section looked uneven (2 + leftover 1).

### After

- `RelatedPosts` moved **outside** `.blog-article` / TOC grid, still inside `.blog-article-paper` (full reading-paper width).
- Grid: 1 col mobile → 2 from 640px → **3 from 900px**.
- Cap remains 3 related posts (`resolve-related.ts`).

---

## Files touched

| Path | Change |
|------|--------|
| `packages/blog/src/posts-admin.ts` | `notNullText` on NOT NULL text fields |
| `apps/cae/src/components/admin/BulkImportForm.tsx` | `seoTitle` / `seoDescription` → `""` |
| `apps/cae/src/components/admin/PostForm.tsx` | same |
| `apps/cae/src/pages/blog/[slug].astro` | hero nav; RelatedPosts placement; category href |
| `apps/cae/src/components/blog/blog-page.css` | back button, category chip, related 3-col |

---

## Open / follow-ups

- Optional: omit SEO fields from create payloads entirely (rely on DB default) once callers stop sending them — coercion already safe either way.
- Sticky TOC still only scopes to article body column; related section no longer sits under it (intentional).
