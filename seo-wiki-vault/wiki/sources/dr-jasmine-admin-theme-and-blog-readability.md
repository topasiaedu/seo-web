# Source: Dr Jasmine Admin brand theme + light blog readability

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-28-dr-jasmine-admin-theme-and-blog-readability.md](../../raw/inbox/2026-07-28-dr-jasmine-admin-theme-and-blog-readability.md) |
| Ingested | 2026-07-28 |
| Kind | Session notes (implementation) |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [home IA polish](dr-jasmine-home-ia-and-polish.md); CAE immersive story is **not** DJ’s surface |
| Follow-on | [dr-jasmine-blog-toc-scroll-spy-and-eyebrows](dr-jasmine-blog-toc-scroll-spy-and-eyebrows.md) (TOC spy + section eyebrows) |

## Takeaways

- Admin chrome remapped from CAE purple to **ivory + forest + gold** (`admin-theme.css` / `admin-shell.css`); Plus Jakarta Sans on Admin.
- Public blog index + slug switched to **light ivory** readability (`blog-tokens.css` + `blog-page.css`); not dark Immersive Story.
- **H1** titles use brand green `#2d5e4c`; H2/H3 remain stone.
- Slug **promise-first** lead: takeaway → full-width dek → byline with Instagram/LinkedIn → body; tags/FAQ/sources/author below.
- Reading column width **unchanged** (~56rem / TOC ~70rem).
- Body breathing via markdown: pull quotes, `In clinic:` callouts, `**stat** — label`, step `ol`, green `→` `ul` markers; FAQ chevron.
- Data isolation unchanged: DJ posts use `site_id` `…0002`; do not appear on CAE.

## Key code paths

| Path | Role |
|------|------|
| `apps/dr-jasmine/src/styles/admin-theme.css` | Admin tokens |
| `apps/dr-jasmine/src/styles/blog-tokens.css` | Blog light tokens |
| `apps/dr-jasmine/src/components/blog/blog-page.css` | Blog UI |
| `apps/dr-jasmine/src/pages/blog/[slug].astro` | Lead / end-matter order |
| `apps/dr-jasmine/src/lib/markdown.ts` | Breathing render conventions |

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — Admin theme + blog surface notes
- [overview.md](../overview.md) — DJ blog light-readability note
- [packages/blog.md](../packages/blog.md) — no API change; site-scope reminder only

## Open questions / deferred

1. Star vs arrow for `ul` if brand prefers
2. Richer TipTap snippets for callout/stat
3. Human QA on Opera GX / long posts

## Does not change

- `@seo/blog` CRUD contracts / schema
- CAE dark Immersive Story slug UI
- Gateway / Astro `base`
