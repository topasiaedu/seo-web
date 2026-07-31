# Source: Dr Jasmine bulk import schedule UI (Admin section 4)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-30-dr-jasmine-bulk-import-schedule-ui.md](../../raw/inbox/2026-07-30-dr-jasmine-bulk-import-schedule-ui.md) |
| Ingested | 2026-07-30 |
| Kind | Session notes (implementation) |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [cae-bulk-import-schedule-ui](cae-bulk-import-schedule-ui.md) · [cae-admin-bulk-import](cae-admin-bulk-import.md) · [cae-blog-scheduled-publishing](cae-blog-scheduled-publishing.md) |
| Plan | [dr-jasmine-bulk-import-schedule-ui.md](../../../docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md) |
| Ship | Commit `24e7c68` on `main` (with CAE schedule UI) |

## Takeaways

- Surgical **port of CAE Admin section 4** (Malaysia Time + per-batch cadence) to Dr Jasmine Bulk Import. Preview is section 5.
- Writer template no longer documents `publishAt`; leftover MD `publishAt` / `publishedAt` ignored (soft note).
- DJ-specific wiring kept: `uploadBulkImportCoverImage`, `dr-jasmine/blog/covers`, in-file slug helpers, Wellness / DR JASMINE branding.
- No cadence preset buttons. Future UI times → `published` + future `published_at` UTC; public **lazy time-gate** (**no cron**).
- CAE was the behavioral source of truth; same commit also contains CAE schedule UI.

## Key code paths

| Path | Role |
|------|------|
| `apps/dr-jasmine/src/lib/bulk-import-schedule.ts` | MYT convert + cadence applicator |
| `apps/dr-jasmine/src/lib/bulk-import-template.ts` | Writer/LLM template (no publishAt; DJ branding) |
| `apps/dr-jasmine/src/lib/bulk-import.ts` | Parse; ignore MD publishAt; keep DJ upload/slug |
| `apps/dr-jasmine/src/components/admin/BulkImportForm.tsx` | Sections 1–5; schedule merge |
| `apps/dr-jasmine/src/pages/admin/index.astro` | Dashboard Bulk import button |
| `docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md` | Locked decisions + acceptance |

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — import route + schedule UX
- [cae-bulk-import-schedule-ui](cae-bulk-import-schedule-ui.md) — DJ port no longer deferred
- [glossary.md](../glossary.md) — Bulk import covers both brands
- [overview.md](../overview.md) — related sources list

## Open questions / deferred

1. Manual smoke on DJ Admin import → Scheduled → public hide until due.  
2. Optional cleanup of draft MD series that still contain `publishAt`.  
3. Optional shared package for duplicated bulk-import UI across brands.

## Does not change

- Lazy schedule / RLS / `@seo/blog` visibility  
- Single PostForm datetime model  
- Cron (none)  
- DJ cover storage / slug layout inside `bulk-import.ts`  
