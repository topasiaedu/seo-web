# Source: CAE blog scheduled publishing (lazy time-gate)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md](../../raw/inbox/2026-07-27-cae-blog-scheduled-publishing.md) |
| Ingested | 2026-07-27 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related package | [@seo/blog](../packages/blog.md) |
| Plan | [cae-blog-scheduling.md](../../../docs/implementation-plan/cae-blog-scheduling.md) |
| Spec | [scheduled-publishing.md](../../../docs/future-enhancements/scheduled-publishing.md) (Implemented) |

## Takeaways

- **Publish at** (`published_at`) is the go-live time, not display-only.
- `status = published` means **approved**; public visibility requires `published_at <= now()` (and non-null).
- Admin **Scheduled** is a **computed label** (`published` + future `published_at`) — not a DB status / CHECK value.
- Promotion is **lazy** (query + anon RLS time-gate). **No cron / worker.**
- Null `publishedAt` on published save → server stamps `now()`.
- Admin **Published** tab = live-only; **Scheduled** tab + dashboard card for future posts.
- Migration `20260727033138_posts_public_read_published_at_gate.sql` applied to linked remote (anon SELECT gate + index).

## Key code paths

| Path | Role |
|------|------|
| `packages/blog/src/visibility.ts` | `isPostLive` / `isPostScheduled` |
| `packages/blog/src/posts-public.ts` | Public list/get/count time-gate |
| `packages/blog/src/posts-admin.ts` | Stamp `published_at` when publishing without date |
| `supabase/migrations/20260727033138_posts_public_read_published_at_gate.sql` | Anon RLS + index |
| `apps/cae/src/components/admin/PostForm.tsx` | Publish-at UX |
| `apps/cae/src/components/admin/admin-post-list.ts` | Filters / counts / badges |
| `apps/cae/src/pages/admin/posts/index.astro` | Scheduled tab |
| `apps/cae/src/pages/admin/index.astro` | Scheduled dashboard card |
| `apps/cae/src/components/blog/resolve-related.ts` | Related posts use `isPostLive` |

## Affects

- [sites/cae.md](../sites/cae.md) — smoke + Admin Scheduled semantics
- [packages/blog.md](../packages/blog.md) — live helpers + public gate
- [architecture/supabase.md](../architecture/supabase.md) — migration + RLS
- [overview.md](../overview.md) — remove from Deferred; source link
- [glossary.md](../glossary.md) — Published / Scheduled terms

## Open questions / deferred (from raw)

1. Clone the same model for future brand Admins (prove on CAE first).
2. Optional backfill of legacy `published` rows with null `published_at`.
3. Still deferred: featured pin, recurring schedules, CMS-wide scheduling, eager cron.

## Does not change

- `PostStatus` union (`draft` \| `published` \| `archived`)
- GHL marketing funnels / Media page
- Featured Posts design (`docs/future-enhancements/featured-posts.md`)
