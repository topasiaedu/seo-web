# Session notes: CAE Admin blog posting accepted as working

**Date:** 2026-07-23  
**Kind:** Chat / acceptance notes after implementation  
**Related:** `apps/cae/CONTEXT.md`, `docs/cae-admin-blog-agent-tasks.md`, `docs/future-enhancements/scheduled-publishing.md`, `docs/future-enhancements/featured-posts.md`  
**Topic:** CAE in-app Admin blog authoring + public `/cae/blog` — human confirmation that posting performs well; capture what shipped and what stays deferred.

---

## Acceptance

Human feedback (2026-07-23 evening): **blog posting feature is performing good.** Treat CAE Admin → draft/publish → public blog as the working v1 path for CAE content, not a scaffold.

This is **Admin** under `/cae/admin`, not the future shared **CMS** platform (`apps/cms` still deferred).

---

## What shipped (v1)

### Auth & runtime

- CAE Astro app is **server mode** (`@astrojs/node` + `@astrojs/react`).
- Marketing home/media stay prerendered; Admin + blog are SSR.
- Login / logout only (no public signup). Users created in Supabase Auth dashboard.
- Env: `PUBLIC_SUPABASE_URL` must be the **project root** (`https://<ref>.supabase.co`) — **not** `/rest/v1/` (that broke login until fixed).

### Data

- Migration `20260723160000_blog_authors_categories_posts.sql` applied on remote SEO-Website project.
- Seed: CAE site, Author **Cae Goh**, seven Categories (Zi Wei Dou Shu, Life Strategy, Relationships, Career & Business, Consultations, Academy, Speaking & Media).
- Storage bucket `media` with paths `cae/blog/covers|body|authors`.
- Shared packages: `@seo/db` (browser/server clients), `@seo/blog` (types + CRUD).

### Admin (`/cae/admin`)

| Surface | Role |
|---------|------|
| Login / logout | Supabase email/password |
| Dashboard | Status counts + recent drafts |
| Posts list / new / edit | Full editorial fields minus featured |
| Author | One site-scoped profile |
| Categories | List / add / rename |

Post lifecycle: `draft` | `published` | `archived`; hard delete with confirm; `published_at` is display date only (no scheduler).

Body editor: TipTap **Visual** mode + **Markdown** mode pill — paste raw MD in Markdown, switch to Visual to see formatting; stored as `body_md`.

Slug: editable while draft; **locked after first publish**.

Reading time: auto from body (~200 wpm) with manual override.

Images: upload to Supabase Storage (primary) + paste URL fallback.

### Public blog

- `/cae/blog` — published list
- `/cae/blog/[slug]` — detail: hero, author byline, key takeaway, markdown body, H2 TOC, FAQ, sources, related posts, SEO/OG
- Drafts and archived never public

### First content tooling

- Blog draft markdown lives under `docs/blog/cae/blog-post/` (e.g. intro-to-zi-wei-dou-shu) for paste into Markdown mode.

---

## Explicitly deferred (do not confuse with “missing bugs”)

- Shared **CMS** app (`apps/cms`)
- **Scheduled publishing** — `docs/future-enhancements/scheduled-publishing.md`
- **Featured posts** — `docs/future-enhancements/featured-posts.md`
- Full Media Library browser UI
- Slug history / 301 after publish
- Public blog visual polish to match sample journals (functional render is enough for v1)
- Production deploy off static-only `vercel.json` (needs Node/SSR host)

---

## Smoke path (accepted)

1. Apply migrations + seed (done on linked Supabase project).
2. Create Auth user in Supabase dashboard.
3. `pnpm --filter @seo/cae dev` (or root `pnpm dev` via gateway).
4. `/cae/admin/login` → Author profile → New post → Markdown paste or Visual edit → Publish.
5. Confirm `/cae/blog` and `/cae/blog/[slug]`.

Wiki checklist also on `wiki/sites/cae.md` (smoke section) after T12 sync.

---

## Domain reminders

- **Admin** = per-brand authoring inside the brand app.
- **CMS** = future shared platform — not this surface.
- **Author** = one byline profile per brand (CAE ≠ Dr Jasmine).
- **Category** = site-scoped taxonomy; brands do not share categories.

---

## Open / follow-ups (optional)

- Ingest this raw into `wiki/sources/` if not already covered by T12 sync pages.
- Confirm first real post (intro Zi Wei Dou Shu) published and indexed when ready.
- Choose production SSR host when leaving static Vercel build assumptions.
