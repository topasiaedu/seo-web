# Future enhancement: Featured Posts

**Status:** Deferred — not in CAE Admin v1  
**Date:** 2026-07-23  
**Reference site:** CAE public blog (`/cae/blog`) and Admin (`/cae/admin`)

---

## Why

Editors often want to pin important Posts above the chronological list (or surface them on the homepage). v1 ships **without** a `featured` flag so Admin and the blog index stay simple: newest published first.

Featured is a good-to-have once there is a clear placement (blog pin, homepage module, or both).

---

## Current v1 behavior

- No `featured` column on `posts`
- `/cae/blog` lists published Posts by `published_at` descending
- Admin has no Featured checkbox

---

## Proposed future model

1. Add `posts.featured boolean not null default false` (site-scoped via existing `site_id`).
2. Admin: Featured toggle on the Post editor.
3. Public placement (choose when building):
   - **A:** Featured Posts sort first on `/cae/blog`, then by date
   - **B:** Homepage “Featured from the journal” module only
   - **C:** Both A and B
4. Optional: limit how many Featured Posts can be active at once (e.g. max 3) to avoid a fully pinned index.

---

## Out of scope for this enhancement alone

- Editorial calendars / “feature until date”
- Cross-brand featured rails (each brand Admin stays independent)

---

## Acceptance (when built)

- [ ] Admin can mark/unmark Featured on a Post
- [ ] Chosen public placement(s) show Featured Posts as designed
- [ ] Non-featured listing order remains correct
- [ ] `apps/cae/CONTEXT.md` and wiki updated for Featured
