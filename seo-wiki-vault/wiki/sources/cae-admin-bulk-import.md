# Source: CAE Admin bulk Post import

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-27-cae-admin-bulk-import.md](../../raw/inbox/2026-07-27-cae-admin-bulk-import.md) |
| Ingested | 2026-07-27 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related prior | [cae-admin-postform-simplifications](cae-admin-postform-simplifications.md) · [cae-blog-scheduled-publishing](cae-blog-scheduled-publishing.md) |

## Takeaways

- New Admin route **`/cae/admin/posts/import`** (Posts list / Dashboard → **Bulk import**) creates many Posts from one Markdown document.
- Posts in one file are separated by `===NEW POST===`; each chunk is YAML frontmatter + Markdown body.
- Only **`title`** is required in frontmatter; slug auto-generates; categories match by name or are created; FAQ/sources/tags supported.
- **Go-live times (2026-07-29):** set in Admin **section 4** (Malaysia Time + cadence helper) — **not** Markdown `publishAt`. See [cae-bulk-import-schedule-ui](cae-bulk-import-schedule-ui.md). Leftover `publishAt` in MD is ignored.
- **Hero images:** optional `heroImageUrl` in Markdown, or **one file upload slot per parsed post** in UI section 3 (filename-in-frontmatter approach removed).
- Writer template is **copy/download** via `buildBulkImportWriterTemplate` (live categories + tags + AI output / 5–15 min rules). See [bulk-import-llm-template-and-logout-csrf](bulk-import-llm-template-and-logout-csrf.md). Page layout keeps section 1 compact.
- Import uses the **signed-in Admin** session and `@seo/blog` `createPost` / `createCategory`. Duplicate/existing slugs are skipped (no overwrite).

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/lib/bulk-import.ts` | Parse / validate / resolve |
| `apps/cae/src/lib/bulk-import-template.ts` | Writer/LLM template (`buildBulkImportWriterTemplate`) |
| `apps/cae/src/lib/bulk-import-schedule.ts` | MYT + cadence (see schedule-ui source) |
| `apps/cae/src/components/admin/BulkImportForm.tsx` | UI island |
| `apps/cae/src/pages/admin/posts/import.astro` | Route |

## Affects

- [sites/cae.md](../sites/cae.md) — Bulk import Admin route + smoke note
- [packages/blog.md](../packages/blog.md) — same CRUD helpers; UI is the new caller
- [overview.md](../overview.md) — Admin bulk authoring
- [glossary.md](../glossary.md) — Bulk import term

## Open questions / deferred (from raw)

1. Require hero images before import?  
2. Upsert-by-slug vs skip-on-conflict  
3. Optional CLI script reusing the same parser  

## Does not change

- Single PostForm, DB status enum, lazy schedule time-gate / RLS  
- Shared CMS  
