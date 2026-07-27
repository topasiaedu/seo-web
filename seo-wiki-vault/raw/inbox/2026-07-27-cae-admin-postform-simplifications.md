# Session notes: CAE Admin PostForm authoring simplifications

**Date:** 2026-07-27  
**Kind:** Chat / implementation notes  
**Related:**  
- `apps/cae/src/components/admin/PostForm.tsx`  
- `apps/cae/src/components/admin/PostForm.module.css`  
- `apps/cae/src/components/admin/TagsInput.tsx`  
- `apps/cae/src/components/admin/admin-widgets.css`  
- `apps/cae/src/components/blog/resolve-related.ts`  
- `apps/cae/src/pages/blog/[slug].astro`  
- `apps/cae/src/pages/admin/posts/new.astro`  
- `apps/cae/src/pages/admin/posts/[id]/edit.astro`  
- Prior raw: `raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md`  
- Prior raw: `raw/inbox/2026-07-24-cae-admin-ui-ux.md`  
**Topic:** Reduce Admin Post create/edit friction — fewer duplicate fields, preview-only derived values, auto related posts, tag typeahead, and an explicit Scheduled status in the publish UI.

---

## Context

CAE Admin PostForm already supported full editorial CRUD (TipTap body, FAQ, sources, tags, related picker, SEO overrides, hero + OG images, reading-time override, slug edit until first publish). Editors asked to remove redundant typing and clarify publish vs schedule.

Scheduling storage model is unchanged: DB `PostStatus` remains `draft | published | archived`. Public live = `published` + `published_at <= now()`. Admin “Scheduled” stays a computed concept (not a fourth DB status). See prior ingest `cae-blog-scheduled-publishing`.

---

## Locked Admin UX changes

### Preview-only (no typing)

| Field | Behavior |
|-------|----------|
| **Slug** | Auto from Title while unlocked; read-only preview; locks after first publish/schedule |
| **Reading time** | Auto from Body (~200 wpm); read-only preview; manual override checkbox removed |

### Label / copy

| Old label | New label |
|-----------|-----------|
| Excerpt | **Summary** (still stored as `excerpt`) |
| Hero image alt | **Hero image description** (still `hero_image_alt`) |

### Removed as separate Admin inputs

| Removed UI | What happens instead |
|------------|----------------------|
| OG image URL / upload | Save copies hero URL into `og_image_url`; public already fell back hero ← OG |
| SEO title / SEO description section | Cleared to `null` on save; public resolves Title / Summary |
| Related posts picker (`RelatedPostsPicker.tsx` deleted) | Public “Continue reading” auto-picks up to **3** other **live** posts in the **same category** (newest first) |
| Manual reading-time override | Always auto |

### Tags typeahead

- Draft field is a combobox: type to search existing site tags (from all Posts via `listPosts` → `collectUniqueTags`).
- Ranking: prefix matches first, then contains (e.g. `Zi` → `Zi Wei Dou Shu`).
- Picking a suggestion reuses the canonical spelling (case-insensitive dedupe).
- Still free to create a new tag if nothing matches.
- Arrow keys / Enter / click; Escape dismisses.

### Publish status select (UI intent)

Admin select values (UI-only for Scheduled):

| Intent | Meaning | Stored |
|--------|---------|--------|
| **Draft** | Not public | `status = draft` |
| **Published** | Go live **now** | `status = published`; `published_at` = now (keep existing if already past/live) |
| **Scheduled** | Pick go-live time | `status = published`; `published_at` = future datetime (required; must be future) |
| **Archived** | Hidden | `status = archived` |

- **Publish at** datetime picker shows **only** when intent is Scheduled.
- Published shows hint “Goes live immediately” (no picker).
- Validation for Published/Scheduled still requires site Author + non-empty Body.

---

## Public related posts

`resolveRelatedPublishedPosts(current, published, limit?)` now:

1. Requires `current.categoryId`
2. Filters other live posts (`isPostLive`) with the same category
3. Sorts by `publishedAt` desc
4. Caps at 3 by default

No Admin curation of `related_post_ids`; saves clear that array to `[]`.

---

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/components/admin/PostForm.tsx` | Form: publish intent, previews, save mapping |
| `apps/cae/src/components/admin/TagsInput.tsx` | Tag chips + typeahead catalog |
| `apps/cae/src/components/blog/resolve-related.ts` | Same-category related resolution |
| `apps/cae/src/pages/blog/[slug].astro` | Calls new related resolver |
| `apps/cae/src/pages/admin/posts/new.astro` · `[id]/edit.astro` | Pass `existingTags`; no related picker props |

Deleted: `apps/cae/src/components/admin/RelatedPostsPicker.tsx`

---

## Does not change

- DB `PostStatus` enum / migrations
- Lazy public time-gate / RLS (`published_at <= now()`)
- Admin list Scheduled filter / dashboard Scheduled card (already shipped)
- TipTap body, FAQ, sources, category, hero upload, Author profile
- Homepage Insights bento / marketing GHL lift

---

## Open / follow-ups

1. Whether to drop unused `seo_title` / `seo_description` / `related_post_ids` / `og_image_url` columns later (still written/cleared for compatibility)
2. Tag catalog could move to a dedicated query if Post volume grows (today: flatten `listPosts` tags)
3. Related limit (3) may need tuning once category inventory is larger
4. Smoke: create post → Scheduled future → list Scheduled tab → wait/advance → public live; tag typeahead reuse spelling
