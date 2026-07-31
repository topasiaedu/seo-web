# Source: CAE bulk import schedule UI (Admin section 4)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-29-cae-bulk-import-schedule-ui.md](../../raw/inbox/2026-07-29-cae-bulk-import-schedule-ui.md) |
| Ingested | 2026-07-29 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related prior | [cae-admin-bulk-import](cae-admin-bulk-import.md) · [cae-blog-scheduled-publishing](cae-blog-scheduled-publishing.md) |
| Plan | [cae-bulk-import-schedule-ui.md](../../../docs/implementation-plan/cae-bulk-import-schedule-ui.md) |
| DJ follow-up | Implemented 2026-07-30 — [dr-jasmine-bulk-import-schedule-ui](dr-jasmine-bulk-import-schedule-ui.md) · [plan](../../../docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md) |

## Takeaways

- Bulk-import **go-live times moved out of Markdown** into Admin **section 4** (after Hero images). Preview is now section 5.
- Timezone is fixed **Malaysia Time (UTC+8)** — not browser-local (unlike single PostForm).
- **Cadence helper** (per batch only): start date + time of day + every N days → **Apply to all posts**. No preset buttons.
- Leftover frontmatter `publishAt` / `publishedAt` is **ignored** (soft note); LLM template no longer asks for staggered `publishAt`.
- Future UI times → stored `published` + future `published_at` UTC; public still uses **lazy time-gate** (**no cron**).
- Dashboard: **Bulk import** button beside **New post** on CAE (and DJ).
- Dr Jasmine schedule UI **ported** 2026-07-30 (surgical; DJ upload/slug/branding kept) — see [dr-jasmine-bulk-import-schedule-ui](dr-jasmine-bulk-import-schedule-ui.md).

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/lib/bulk-import-schedule.ts` | MYT convert + cadence applicator |
| `apps/cae/src/lib/bulk-import-template.ts` | Writer/LLM template (no publishAt) |
| `apps/cae/src/lib/bulk-import.ts` | Parse; ignore MD publishAt |
| `apps/cae/src/components/admin/BulkImportForm.tsx` | Sections 1–5; schedule merge |
| `apps/cae/src/pages/admin/index.astro` | Dashboard Bulk import button |
| `docs/implementation-plan/cae-bulk-import-schedule-ui.md` | Locked decisions + acceptance |

## Affects

- [sites/cae.md](../sites/cae.md) — bulk import schedule UX + smoke
- [cae-admin-bulk-import](cae-admin-bulk-import.md) — schedule-in-frontmatter claims superseded for go-live times
- [glossary.md](../glossary.md) — Bulk import term
- [overview.md](../overview.md) — related sources list

## Open questions / deferred

1. ~~Port same schedule UI to Dr Jasmine~~ — done; see [dr-jasmine-bulk-import-schedule-ui](dr-jasmine-bulk-import-schedule-ui.md).  
2. Optional cleanup of draft MD series that still contain `publishAt`.  
3. Optional shared package for duplicated bulk-import UI across brands.

## Does not change

- Lazy schedule / RLS / `@seo/blog` visibility  
- Single PostForm datetime model  
- Cron (none)  
