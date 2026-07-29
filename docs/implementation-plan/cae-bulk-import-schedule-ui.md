# Implementation plan: CAE bulk import schedule UI

**Status:** Implementation complete (2026-07-29) — CAE Admin manual UI smoke recommended
**Date:** 2026-07-29
**Feature:** Move bulk-import go-live times out of Markdown `publishAt` into Admin section 4 (Malaysia Time + per-batch cadence helper)

---

## Locked product decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Where scheduling lives | Admin Bulk Import UI only — not in the LLM/writer Markdown template |
| 2 | Timezone | Fixed **Malaysia Time** (`Asia/Kuala_Lumpur`, UTC+8; no DST) |
| 3 | Cadence helper | Per **current paste/upload batch** only (React state; not persisted) |
| 4 | Cadence math | Post 1 = chosen start date + time; post *k* = start + `(k-1) * N` days at the same clock time |
| 5 | Leftover `publishAt` in MD | **Ignore** — Admin schedule UI always wins; strip from template/parser contract |
| 6 | Scope | **CAE first**; duplicate to Dr Jasmine after sign-off |

Existing lazy publish model stays unchanged: import stores `status=published` + future `published_at` UTC; public visibility uses the existing time-gate (no cron). See [`cae-blog-scheduling.md`](./cae-blog-scheduling.md).

```mermaid
flowchart LR
  A[1 Writer template] --> B[2 Paste MD]
  B --> C[3 Hero images]
  C --> D[4 Publish schedule]
  D --> E[5 Preview and import]
  D --> Cadence[Cadence helper MYT]
  Cadence -->|"Apply to batch"| PerPost[Per-post MYT datetimes]
  PerPost --> E
  E --> DB["createPost published + published_at UTC"]
```

---

## UI shape (CAE Bulk Import)

Renumber sections in `apps/cae/src/components/admin/BulkImportForm.tsx`:

1. Writer template
2. Markdown paste/upload
3. Hero images
4. **Publish schedule** (new)
5. Preview & import (was 4)

### Section 4 — Publish schedule

Shown once Markdown has parsed posts (`rows.length > 0`).

**Cadence helper (batch tools):**

- **Start date** — calendar day for post 1
- **Time of day** — e.g. `08:00` / `21:00`, labeled Malaysia Time (UTC+8)
- **Every N days** — integer ≥ 1
- **Apply to all posts** — writes schedule slots for the current batch in document order

**Per-post editors:** date + time (MYT) per post; editable after Apply; clearable.

Hint: “Times are Malaysia Time (UTC+8). Cadence applies only to this import batch.”

---

## Template + parser contract

### `apps/cae/src/lib/bulk-import-template.ts`

- Remove `publishAt` guidance and AI stagger instructions
- Optional `status`: `draft | published | archived` only
- Point writers to Admin section 4 for go-live times

### `apps/cae/src/lib/bulk-import.ts`

- Ignore frontmatter `publishAt` / `publishedAt` (soft note if present)
- Do not require `publishAt` for `status: scheduled`
- Form overrides go-live from UI schedule state

### Import merge rule

- `publishedAt` → UI MYT → UTC ISO
- Never use frontmatter `publishAt`
- `draft` / `archived` from MD: keep; schedule optional/ignored for drafts
- Scheduled rows: `published` + future `published_at`
- Ready check: scheduled/published intents need a valid future MYT time in section 4 when scheduling

---

## MYT helpers

`apps/cae/src/lib/bulk-import-schedule.ts`:

- `buildMytIso(dateYmd, timeHm)` → UTC ISO via fixed `+08:00`
- `applyCadenceSchedule({ startDate, timeOfDay, intervalDays, postCount })` → ordered MYT slots
- Do not reuse PostForm browser-local `datetime-local` helpers

---

## File ownership

| Area | Files |
|------|-------|
| Plan / docs | `docs/implementation-plan/cae-bulk-import-schedule-ui.md` |
| Schedule helpers | `apps/cae/src/lib/bulk-import-schedule.ts` |
| Template | `apps/cae/src/lib/bulk-import-template.ts` |
| Parser | `apps/cae/src/lib/bulk-import.ts` |
| UI + CSS | `apps/cae/src/components/admin/BulkImportForm.tsx`, `BulkImportForm.module.css` |

**Out of scope:** Dr Jasmine duplicate, persisted cadence presets, cron, `@seo/blog` visibility changes.

---

## Acceptance criteria

- Writer template contains no `publishAt` / staggered-schedule AI instructions
- MD with leftover `publishAt` still imports; times come only from section 4
- Cadence Apply start `2026-08-05`, `08:00`, every `1` day × 3 posts → Aug 5/6/7 08:00 MYT
- Every 3 days `21:00` → Aug 5/8/11 21:00 MYT
- Stored UTC: `00:00Z` for 08:00 MYT, `13:00Z` for 21:00 MYT
- Re-pasting a new document resets schedule UI state for the new batch
- Dr Jasmine files untouched in this phase
