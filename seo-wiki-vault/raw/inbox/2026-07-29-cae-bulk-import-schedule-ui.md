# Session notes: CAE bulk import schedule UI (Admin section 4)

**Date:** 2026-07-29  
**Kind:** Chat / implementation notes  
**Related:**  
- Plan: `docs/implementation-plan/cae-bulk-import-schedule-ui.md`  
- Follow-up plan (not implemented this session): `docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-admin-bulk-import.md`  
- Prior raw: `raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md`  
- `apps/cae/src/lib/bulk-import-schedule.ts` (new)  
- `apps/cae/src/lib/bulk-import-template.ts`  
- `apps/cae/src/lib/bulk-import.ts`  
- `apps/cae/src/components/admin/BulkImportForm.tsx`  
- `apps/cae/src/components/admin/BulkImportForm.module.css`  
- `apps/cae/src/pages/admin/index.astro` (Bulk import beside New post)  
- `apps/dr-jasmine/src/pages/admin/index.astro` (same dashboard button only)  
**Topic:** Move bulk-import go-live times out of Markdown `publishAt` into CAE Admin Bulk Import section 4 (Malaysia Time + per-batch cadence helper). Preset cadence buttons removed after UX review.

---

## Problem

Writers / LLMs were filling staggered `publishAt` ISO strings in the bulk Markdown template. That was error-prone for large batches (e.g. 100 posts) and mixed scheduling into content authoring. Scheduling already exists as a **lazy time-gate** (`published` + future `published_at`; **no cron**) — see scheduled-publishing notes. Bulk import needed an Admin UI to set those times after paste, not frontmatter.

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Where scheduling lives | Admin Bulk Import UI only — not in the LLM/writer Markdown template |
| 2 | Timezone | Fixed **Malaysia Time** (`Asia/Kuala_Lumpur`, UTC+8; no DST) |
| 3 | Cadence helper | Per **current paste/upload batch** only (React state; not persisted) |
| 4 | Cadence math | Post 1 = start date + time; post *k* = start + `(k-1) * N` days at the same clock time |
| 5 | Leftover `publishAt` in MD | **Ignore** — Admin schedule UI always wins; soft note if present |
| 6 | Cadence presets | **Removed** — no “Every day 8:00 AM” / “Every 3 days 9:00 PM”; writers use Start date + Time + Every N days + Apply |
| 7 | Scope this session | **CAE implemented**; DJ schedule UI deferred to follow-up plan |

Promotion to public remains **lazy** (query / RLS `published_at <= now()`). Import still stores `status=published` + future `published_at` UTC for scheduled rows. **No cron / worker.**

---

## Admin UI (`/cae/admin/posts/import`)

| Section | Purpose |
|---------|---------|
| **1. Writer template** | Copy template; no `publishAt` in field guide |
| **2. Add your content** | Paste / upload Markdown |
| **3. Hero images** | Per-post cover uploads (unchanged) |
| **4. Publish schedule** | **New** — MYT cadence helper + per-post date/time editors |
| **5. Preview & import** | Was section 4; Publish at column reads UI MYT state |

### Cadence helper (section 4)

- Start date (post 1)
- Time of day (MYT)
- Every N days (≥ 1)
- **Apply to all posts** — fills every parsed post in document order for this batch only

Per-post MYT date/time can be tweaked or cleared after Apply.

### Import merge

- `publishedAt` sent to `createPost` = UI MYT → UTC via `buildMytIso` (`+08:00`)
- Never use frontmatter `publishAt`
- Future UI go-live → effective **Scheduled** (including when MD said `draft`)
- `archived` keeps archived; ignore schedule times
- MD `status: scheduled` without UI time → blocked until section 4 is filled

### Dashboard shortcut

CAE (and DJ) Admin dashboard header: **Bulk import** button beside **New post** (posts list already had the link).

---

## Template + parser contract (CAE)

### `bulk-import-template.ts`

- Removed `publishAt` examples and AI “stagger publishAt” instructions
- Status in template: `draft | published | archived` only
- Points writers to Admin section 4 for go-live times (MYT)

### `bulk-import.ts`

- Frontmatter `publishAt` / `publishedAt` → soft note, ignored
- Parsed `publishAtIso` always `null`; form supplies times from section 4

### `bulk-import-schedule.ts` (new)

- `buildMytIso`, `applyCadenceSchedule`, `formatMytPreview`, date/time validators
- Fixed `+08:00` (no DST library needed)

Acceptance examples:

- Start `2026-08-05`, `08:00`, every 1 day × 3 → Aug 5/6/7 08:00 MYT → UTC `00:00Z`
- Every 3 days `21:00` → Aug 5/8/11 21:00 MYT → UTC `13:00Z`

---

## Dr Jasmine (deferred)

Implementation plan written for another agent: `docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md`.

- Surgical port from CAE; **do not** wholesale-replace DJ form/parser
- Keep DJ `uploadBulkImportCoverImage` / `dr-jasmine/blog/covers` / in-file slug helpers / Wellness template branding
- No cadence preset buttons
- This session only added the dashboard **Bulk import** button on DJ; schedule UI not ported yet

---

## Docs

- `docs/implementation-plan/cae-bulk-import-schedule-ui.md` — CAE plan (implemented)
- `docs/implementation-plan/dr-jasmine-bulk-import-schedule-ui.md` — DJ port plan (ready)

---

## Open / next

1. Port schedule UI to Dr Jasmine per DJ plan after CAE acceptance.
2. Optional: strip leftover `publishAt` from draft series under `docs/blog/*/blog-draft/` (not required for Admin feature).
3. Optional later: extract shared bulk-import package (currently per-app duplication).

---

## Does not change

- Lazy schedule model / RLS / `@seo/blog` visibility helpers  
- Single PostForm browser-local datetime (bulk uses fixed MYT; PostForm unchanged)  
- Cron (still none)  
