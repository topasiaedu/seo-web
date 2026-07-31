# Session notes: Dr Jasmine bulk import schedule UI (Admin section 4)

**Date:** 2026-07-30  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Related:**  
- Plan: `docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md`  
- CAE source of truth (already shipped): `docs/implementation-plan/cae-bulk-import-schedule-ui.md`  
- Prior raw (CAE; DJ deferred): `raw/inbox/2026-07-29-cae-bulk-import-schedule-ui.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-admin-bulk-import.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md`  
- Commit: `24e7c68` on `main` (pushed) — CAE + DJ schedule UI together  
**Code touched (DJ):**  
- `apps/dr-jasmine/src/lib/bulk-import-schedule.ts` (**CREATE**)  
- `apps/dr-jasmine/src/lib/bulk-import-template.ts`  
- `apps/dr-jasmine/src/lib/bulk-import.ts`  
- `apps/dr-jasmine/src/components/admin/BulkImportForm.tsx`  
- `apps/dr-jasmine/src/components/admin/BulkImportForm.module.css`  
- `apps/dr-jasmine/src/pages/admin/index.astro` (Bulk import beside New post — already present from CAE session)  
**Topic:** Surgical port of CAE Admin bulk-import **Publish schedule** (MYT + per-batch cadence) to Dr Jasmine Admin. Markdown `publishAt` no longer drives go-live times.

---

## Problem

CAE Admin already set bulk go-live times in section 4 (Malaysia Time + cadence). Dr Jasmine still required writers/LLMs to put staggered `publishAt` ISO strings in the Markdown template, and the parser validated those times. That mismatched CAE and stayed error-prone for multi-post batches. DJ needed the same Admin schedule UX while keeping DJ-specific cover upload, slug helpers, and Wellness branding.

---

## Locked product decisions (match CAE)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Where scheduling lives | Admin Bulk Import UI only — not in the LLM/writer Markdown template |
| 2 | Timezone | Fixed **Malaysia Time** (`Asia/Kuala_Lumpur`, UTC+8; no DST) |
| 3 | Cadence helper | Per **current paste/upload batch** only (React state; not persisted) |
| 4 | Cadence math | Post 1 = start date + time; post *k* = start + `(k-1) * N` days at the same clock time |
| 5 | Leftover `publishAt` in MD | **Ignore** — Admin schedule UI always wins; soft note if present |
| 6 | Cadence presets | **None** — Start date + Time + Every N days + Apply only |
| 7 | Scope | **Dr Jasmine only** for the port; CAE left as behavioral source of truth (shipped in same commit) |

Promotion to public remains **lazy** (`published` + future `published_at`; **no cron**). Same model as CAE scheduling.

---

## What was ported

### Admin UI (`/dr-jasmine/admin/posts/import`)

| Section | Purpose |
|---------|---------|
| **1. Writer template** | Copy template; no `publishAt` in field guide |
| **2. Add your content** | Paste / upload Markdown |
| **3. Hero images** | Per-post covers via `uploadBulkImportCoverImage` (unchanged) |
| **4. Publish schedule** | **New** — MYT cadence helper + per-post date/time editors |
| **5. Preview & import** | Was section 4; Publish at column = `formatMytPreview` from UI |

### Template + parser

- Writer template: drop `publishAt` docs/examples; status `draft | published | archived`; keep **DR JASMINE BLOG** / Wellness / body breathing patterns; default `status: "draft"`
- Parser: leftover `publishAt` / `publishedAt` → soft note; `publishAtIso` always `null`; removed `coercePublishAtIso` and “required when scheduled” MD errors
- Keep accepting `status: scheduled` as intent — form requires section 4 times

### DJ-specific wiring preserved

| Concern | Kept on DJ |
|---------|------------|
| Cover upload | `uploadBulkImportCoverImage` from `bulk-import.ts` (not CAE `uploadBlogCoverImage` / `storage`) |
| Storage prefix | `dr-jasmine/blog/covers` |
| Slug helpers | `slugifyTitle` / `SLUG_FORMAT_PATTERN` inside DJ `bulk-import.ts` |
| Branding | DR JASMINE BLOG, Wellness examples, clinic body conventions |
| Site id | `drJasmineSiteConfig.projectId` |

Port was surgical — did **not** wholesale-replace DJ form/parser with CAE copies.

### Schedule helpers

Copied CAE `bulk-import-schedule.ts` → DJ with fileoverview renamed. Logic unchanged: `buildMytIso`, `applyCadenceSchedule`, `formatMytPreview`, validators.

Acceptance math (verified on DJ):

- Start `2026-08-05`, `08:00`, every 1 day × 3 → Aug 5/6/7 08:00 MYT → UTC `00:00Z`
- Every 3 days `21:00` → Aug 5/8/11 21:00 MYT → UTC `13:00Z`

`npx tsc --noEmit` in `apps/dr-jasmine` passed.

---

## Import merge (same as CAE)

- `publishedAt` on `createPost` = UI MYT → UTC via `buildMytIso`
- Never use frontmatter `publishAt`
- Future UI go-live → effective **Scheduled** (including when MD said `draft`)
- `archived` stays archived; ignore schedule times
- MD `status: scheduled` without UI time → not ready until section 4

---

## Out of scope (unchanged)

- Shared `@seo/blog` bulk-import package (per-app duplication remains)
- Refactor DJ cover upload into `storage.ts` / slug into `post-slug.ts`
- Cron / eager status flip
- Persisted cadence presets
- Required cleanup of draft MD under `docs/blog/dr-jasmine/blog-draft/` (optional)

---

## Open / next

1. Manual Admin smoke on `/dr-jasmine/admin/posts/import` (cadence → Scheduled tab → public hide until due).
2. Optional: strip leftover `publishAt` from draft series Markdown.
3. Optional later: extract shared bulk-import package across brands.
