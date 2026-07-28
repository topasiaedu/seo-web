# Source: Dr Jasmine homepage Health Insights band (Option B)

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-28-dr-jasmine-homepage-blog-band.md](../../raw/inbox/2026-07-28-dr-jasmine-homepage-blog-band.md) |
| Ingested | 2026-07-28 |
| Kind | Session notes (implementation) |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [home IA polish](dr-jasmine-home-ia-and-polish.md) (no-blog-band rule **superseded** for this teaser only); CAE analog [homepage blog bento](cae-homepage-blog-bento.md) |

## Takeaways

- Homepage surfaces the **newest 3 published Posts** in a **Health Insights** band after Proof / before Workshop CTA.
- Locked UI: **Option B** — equal image-led tiles via existing `PostCard` (not text cards, not CAE soft bento).
- Copy aligned with `/blog`: eyebrow `Blog`, heading `Health Insights`, index lede, `View all` → `/blog`.
- Empty published set **hides** the section entirely.
- `PostCard` supports optional `titleTag` (`h2` on index, `h3` on home).
- CSS bridge: `--blog-*` vars on `.dj-home-blog` so tiles render without a `.blog-page` wrapper.
- Featured DB pin remains deferred; order is chronological newest-first only.
- Revises the 2026-07-28 home IA decision that omitted homepage blog bands; GHL workshop copy bands stay unchanged.

## Key code paths

| Path | Role |
|------|------|
| `apps/dr-jasmine/src/pages/index.astro` | SSR home; fetches 3 published Posts; mounts `HomeBlog` when non-empty |
| `apps/dr-jasmine/src/components/home/HomeBlog.astro` | Health Insights header + `blog-grid` of `PostCard`s |
| `apps/dr-jasmine/src/components/home/home.css` | Blog-tile CSS var bridge; header chrome |
| `apps/dr-jasmine/src/components/blog/PostCard.astro` | Image tile; optional `titleTag` |
| `packages/blog` | `listPublishedPostsPage` |

## Homepage order (locked)

```text
Hero → Discover → Meet Doctor → Proof → Health Insights (HomeBlog)
→ Workshop CTA → FAQ
```

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — home stack + Insights band
- [overview.md](../overview.md) — DJ home pulls live Posts
- [architecture/overview.md](../architecture/overview.md) — DJ home Insights note
- [packages/blog.md](../packages/blog.md) — DJ home consumer of public list helper

## Open questions / deferred (from raw)

1. Featured DB flag for homepage pin (`docs/future-enhancements/featured-posts.md`)
2. Whether to later adopt a featured+side or soft-bento layout
3. Align any future home tile chrome changes with `/blog` index only when intentional

## Does not change

- Public `/dr-jasmine/blog` + slug magazine layout (beyond reusable `PostCard` prop)
- Admin authoring model
- GHL workshop CTA copy / `registerUrl` targets
- Removal of `/about` `/faq` `/programs` `/workshop` pages
