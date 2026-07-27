# Scheduled publishing for Posts

**Status:** Implemented — lazy time-gate + computed Admin "Scheduled" label  
**Date:** 2026-07-23 (spec); implemented 2026-07-27  
**Reference site:** CAE Admin (`/cae/admin`) — prove on CAE, then clone for other brand Admins  
**Implementation plan:** [cae-blog-scheduling.md](../implementation-plan/cae-blog-scheduling.md)

---

## Why

Editors often want to set a Post live at a future date/time (e.g. Monday 09:00) without being online to flip status. Early Admin used **immediate publishing**: `status = published` meant visible right away; `published_at` was only the date shown on the article.

Scheduled publishing closes that gap with a go-live gate on `published_at`, without a fourth DB status or a background worker.

---

## Implemented model

| Stored `status` | `published_at` | Public blog | Admin label |
|-----------------|----------------|-------------|-------------|
| `draft` | any | Hidden | Draft |
| `published` | `null` | Server stamps `now()` on save | — |
| `published` | `> now()` | Hidden until due | **Scheduled** |
| `published` | `<= now()` | Visible | Published |
| `archived` | any | Hidden | Archived |

- **`status = published`** means approved to go live at `published_at`, not "visible immediately."
- Public visibility: `status = published` **and** `published_at <= now()`.
- **Scheduled** is a computed Admin label only (not a DB status).
- **Unpublish** = set status back to `draft`. **Archive** = `archived`.
- Promotion is **lazy**: public queries and anon RLS use the time gate. **No cron, no worker, no eager status flip.**
- Picker uses browser local time; store UTC in `published_at`.

---

## Out of scope (still deferred)

- Recurring publish calendars
- Multi-timezone per-author preferences beyond one brand default
- CMS platform scheduling (brands keep independent Admins unless CMS later absorbs this)
- Fourth DB status `scheduled` / eager cron promotion

---

## Acceptance

- [x] Editor can set a future `published_at` and the Post is not on `/cae/blog` before that time
- [x] After that time, the Post appears without a manual status click (lazy gate; no worker)
- [x] Unpublish / archive behavior remains clear in Admin
- [x] Wiki + `apps/cae/CONTEXT.md` Post language updated for "scheduled"
