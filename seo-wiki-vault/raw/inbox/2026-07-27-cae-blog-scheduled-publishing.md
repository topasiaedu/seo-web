# Session notes: CAE blog scheduled publishing (lazy time-gate)

**Date:** 2026-07-27  
**Kind:** Chat / implementation notes  
**Related:**  
- `docs/implementation-plan/cae-blog-scheduling.md`  
- `docs/future-enhancements/scheduled-publishing.md`  
- `packages/blog/src/visibility.ts`  
- `packages/blog/src/posts-public.ts`  
- `packages/blog/src/posts-admin.ts`  
- `supabase/migrations/20260727033138_posts_public_read_published_at_gate.sql`  
- `apps/cae/src/components/admin/PostForm.tsx`  
- `apps/cae/src/components/admin/admin-post-list.ts`  
- `apps/cae/src/pages/admin/posts/index.astro`  
- `apps/cae/src/pages/admin/index.astro`  
- `apps/cae/src/components/blog/resolve-related.ts`  
- `apps/cae/CONTEXT.md`  
- Prior deferred: `docs/future-enhancements/scheduled-publishing.md`  
**Topic:** Implement scheduled publishing for CAE Admin Posts — `published_at` is the go-live time; no fourth DB status; no cron.

---

## Context

v1 Admin had a datetime picker wired to `published_at`, but copy said it was **display only** (not a schedule). Public queries and RLS only checked `status = 'published'`, so a future-dated published Post was immediately public.

Goal: editors set **Publish at** to a future local datetime; the Post stays off `/cae/blog` (and home Insights) until that moment, without a worker.

---

## Locked model

| Stored `status` | `published_at` | Public blog | Admin label |
|-----------------|----------------|-------------|-------------|
| `draft` | any | Hidden | Draft |
| `published` | `null` | Server stamps `now()` on save | — |
| `published` | `> now()` | Hidden until due | **Scheduled** (computed) |
| `published` | `<= now()` | Visible | Published |
| `archived` | any | Hidden | Archived |

- **`status = published`** = approved to go live at `published_at` (not “visible immediately”).
- **Scheduled** is an Admin UI label only — not a `PostStatus` / CHECK value.
- **Lazy promotion:** next public request after `published_at` shows the Post. No cron / Edge Function / Vercel Cron.
- Picker = browser local time → store UTC.

### Design decisions (locked)

1. Null `publishedAt` on published save → **stamp `now()`** (do not reject).
2. Admin **Published** filter tab = **live-only**; future posts only under **Scheduled**.
3. Dashboard gets a dedicated **Scheduled** count card.
4. `PostStatusCounts` includes `scheduled: number`.
5. Anon RLS policy targets **`anon` only** (authenticated editors keep full SELECT via `"Editors manage posts"`).

---

## Implementation (multitask A–F)

Plan: `docs/implementation-plan/cae-blog-scheduling.md`. Wave 1 = A + B + F; Wave 2 = C + D + E after A.

| Task | Deliverable |
|------|-------------|
| **A** | `@seo/blog`: `isPostLive` / `isPostScheduled`; public queries gated (count + data in `listPublishedPostsPage`); stamp on create/update |
| **B** | Migration: anon SELECT RLS time-gate + index `(site_id, status, published_at DESC NULLS LAST)` |
| **C** | PostForm: label **Publish at**, schedule hint, validation, scheduled vs published success copy |
| **D** | Admin list/dashboard: Scheduled tab, live-only Published, badges, counts |
| **E** | `resolve-related.ts` uses `isPostLive` (defensive) |
| **F** | CONTEXT.md + deferred doc → Implemented + wiki language sync |

### Migration applied

- File: `supabase/migrations/20260727033138_posts_public_read_published_at_gate.sql`
- Pushed to linked remote `uxwzgycgmtailguvmmsv` via `supabase db push --linked` (2026-07-27).
- Verified: policy `Public read published posts` for `anon` with `published_at <= now()`; `"Editors manage posts"` untouched; index present.

---

## Key code paths

| Path | Role |
|------|------|
| `packages/blog/src/visibility.ts` | `isPostLive` / `isPostScheduled` |
| `packages/blog/src/posts-public.ts` | Three-clause public filter on all list/get/count |
| `packages/blog/src/posts-admin.ts` | Decision 1 stamp when `status=published` and date missing |
| `…/20260727033138_posts_public_read_published_at_gate.sql` | Anon RLS + index |
| `apps/cae/.../PostForm.tsx` | Publish-at UX |
| `apps/cae/.../admin-post-list.ts` | Filters, counts, display labels |
| `apps/cae/.../admin/posts/index.astro` | Scheduled tab + badges |
| `apps/cae/.../admin/index.astro` | Scheduled dashboard card |
| `apps/cae/.../resolve-related.ts` | Related posts live gate |

---

## How to verify (manual)

1. Admin: publish with **Publish at** ~10–15 min future → success “Scheduled for …”.
2. Dashboard **Scheduled** count / Posts **Scheduled** tab show it; **Published** tab does not.
3. Public `/cae/blog` and `/cae/blog/{slug}` hide it (404 on slug).
4. After due time (or edit Publish at to past/now) → appears on public + Admin Published tab.
5. Unpublish / archive still hide from public.

---

## Out of scope (still deferred)

- Fourth DB status `scheduled` / eager cron flip
- Recurring calendars, per-author timezones
- CMS-wide scheduling
- Featured Posts pin

---

## Open questions

1. Whether other brand Admins should clone this model immediately when scaffolded (plan says prove on CAE first).
2. Optional: backfill any legacy `status=published` rows with null `published_at` (server stamp covers new writes).
