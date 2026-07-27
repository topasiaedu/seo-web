# Session notes: CAE Admin bulk Post import

**Date:** 2026-07-27  
**Kind:** Chat / implementation notes  
**Related:**  
- `apps/cae/src/pages/admin/posts/import.astro`  
- `apps/cae/src/pages/admin/posts/index.astro` (Bulk import button)  
- `apps/cae/src/components/admin/BulkImportForm.tsx`  
- `apps/cae/src/components/admin/BulkImportForm.module.css`  
- `apps/cae/src/lib/bulk-import.ts`  
- `apps/cae/src/lib/bulk-import-template.ts`  
- `apps/cae/src/lib/post-slug.ts` (`slugifyTitle` shared with PostForm)  
- `apps/cae/package.json` (`js-yaml`, `@types/js-yaml`)  
- Prior raw: `raw/inbox/2026-07-27-cae-admin-postform-simplifications.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md`  
**Topic:** Bulk-create many CAE Posts from one Markdown document (writer/LLM-friendly), with per-post hero uploads and schedule-aware frontmatter — without copy-pasting the single PostForm 10–100 times.

---

## Context

Editors need to land batches of Posts (often drafted by a hired writer or an LLM) without filling the Admin create form field-by-field. The existing stack already exposes `createPost` / `createCategory` in `@seo/blog`; Admin UI was the bottleneck, not the database.

Product choices locked in session:

1. **Admin UI bulk import** (not a terminal-only script first).
2. **One Markdown file can hold many posts**, separated by `===NEW POST===`.
3. Frontmatter **status / publishAt are respected** (writers instructed to use **scheduled** + future times).
4. **Hero images are per-post uploads** in Admin after Markdown is parsed (not bulk multi-file matching by filename).
5. Writer template is **copy-first** (compact section; no huge always-visible template block).

Scheduling storage model is unchanged: DB `PostStatus` remains `draft | published | archived`. Admin “Scheduled” = `published` + future `published_at`. See `cae-blog-scheduled-publishing`.

---

## Writer document format

Each Post chunk:

1. YAML frontmatter between `---` lines  
2. Markdown body after the closing `---`  
3. Next Post starts after a line containing only `===NEW POST===`

### Frontmatter fields

| Field | Required | Notes |
|-------|----------|--------|
| `title` | **Yes** | Only hard-required field |
| `excerpt` | No | Summary / listing teaser |
| `slug` | No | Auto from title if omitted (`slugifyTitle`) |
| `category` | No | Matched by name (case-insensitive); **created** if missing |
| `tags` | No | YAML string list |
| `keyTakeaway` | No | On-page callout |
| `heroImageUrl` | No | Optional already-hosted `http(s)` URL |
| `heroImageAlt` | No | Alt / description |
| `heroImage` | No | **Ignored** if present — upload in Admin section 3 instead (note shown) |
| `status` | No | `draft` \| `published` \| `scheduled` \| `archived` (default `draft`) |
| `publishAt` / `publishedAt` | For scheduled | ISO datetime; **required + future** when `status: scheduled` |
| `faq` | No | List of `{ question, answer }` |
| `sources` | No | List of `{ label, url? }` |

HTML comment blocks (writer/LLM instructions) and YAML `#` comments are stripped / ignored on import.

Canonical annotated template: `apps/cae/src/lib/bulk-import-template.ts` (`BULK_IMPORT_WRITER_TEMPLATE`).

---

## Admin UI (`/cae/admin/posts/import`)

Linked from Posts list as **Bulk import**.

| Section | Purpose |
|---------|---------|
| **1. Writer template** | Copy template button + short hint + collapsible quick field guide (template body not shown full-screen) |
| **2. Add your content** | Upload `.md` file(s) and/or paste document; shows detected post count |
| **3. Hero images** | One upload slot **per parsed post** (optional; URL in markdown still works; file overrides URL on import) |
| **4. Preview & import** | Table of rows + create-ready / blocked + import button |

### Preview / safety

- Blocks rows with parse errors, **duplicate slug in batch**, or **slug already on site** (skip — does not overwrite).
- Ready rows call `createPost` (and `createCategory` when needed) as the signed-in Admin (browser Supabase session; no service-role).
- Scheduled → stored `status = published` + `publishedAt` from frontmatter.
- Progress per row: Creating / Created (edit link) / Failed.

---

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/lib/bulk-import.ts` | Split / parse / validate / resolve categories & slug conflicts |
| `apps/cae/src/lib/bulk-import-template.ts` | Copyable writer + LLM template |
| `apps/cae/src/components/admin/BulkImportForm.tsx` | React island UI |
| `apps/cae/src/pages/admin/posts/import.astro` | SSR page; loads author, categories, existing slugs |
| `apps/cae/src/lib/post-slug.ts` | Shared `slugifyTitle` / `SLUG_FORMAT_PATTERN` |

Dependency: `js-yaml` in `@seo/cae` (browser-bundled with the island).

---

## Does not change

- Single-post PostForm create/edit flow  
- DB schema / `PostStatus` / lazy public time-gate / RLS  
- Service-role CLI importer (not built; UI uses editor session)  
- Shared CMS (`apps/cms`)  

---

## Open / follow-ups

1. Whether hero images should become **required** before import (today optional)  
2. Upsert-by-slug (update existing) vs current skip-on-conflict  
3. Terminal script reusing `bulk-import.ts` for ops without browser  
4. Smoke: copy template → LLM fills N posts → paste → attach covers → Scheduled rows appear under Admin Scheduled tab  
