# Source: Dr Jasmine blog TOC scroll-spy + section eyebrows

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-30-dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md](../../raw/inbox/2026-07-30-dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md) |
| Ingested | 2026-07-30 |
| Kind | Session notes (implementation) |
| Commit | `c60d701` |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [cae-blog-immersive-story-redesign](cae-blog-immersive-story-redesign.md) (CAE TOC spy); [dr-jasmine-admin-theme-and-blog-readability](dr-jasmine-admin-theme-and-blog-readability.md) |

## Takeaways

- After CAE vs DJ blog `[slug]` gap analysis, surgically ported **only** TOC scroll-spy and section eyebrows to Dr Jasmine.
- Left CAE-only hero chrome / dark theme toggle / favicon / OG logo fallback out of scope.
- Eyebrow copy is clinic-toned: FAQ `Common questions`, Sources `References`, Related `Keep reading`.
- Eyebrow CSS matches existing DJ tokens — does **not** import CAE `.cae-eyebrow`.
- Active TOC uses separate `[aria-current="true"]` (bold); no CAE dark/light theme forks.

## Key code paths

| Path | Role |
|------|------|
| `apps/dr-jasmine/src/components/blog/TableOfContents.astro` | TOC + scroll-spy (`data-blog-toc`) |
| `apps/dr-jasmine/src/components/blog/FaqSection.astro` | `Common questions` eyebrow |
| `apps/dr-jasmine/src/components/blog/SourcesSection.astro` | `References` eyebrow |
| `apps/dr-jasmine/src/components/blog/RelatedPosts.astro` | `Keep reading` eyebrow |
| `apps/dr-jasmine/src/components/blog/blog-page.css` | Active TOC + eyebrow styles |

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — blog slug UX note
- [dr-jasmine-admin-theme-and-blog-readability](dr-jasmine-admin-theme-and-blog-readability.md) — follow-up polish

## Open (from raw)

1. Optional later: favicon + logo OG fallback; stronger TOC active border if design wants more contrast
