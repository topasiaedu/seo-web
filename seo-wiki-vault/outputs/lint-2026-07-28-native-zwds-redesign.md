# Lint report — 2026-07-28 (post native ZWDS public redesign ingest)

Vault health after ingesting:

- `raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md`
- `raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md`

Also backfilled index entry for `cae-blog-immersive-story-redesign` (source existed; was missing from catalog).

## Checks

| Check | Result |
|-------|--------|
| Broken wiki-relative links | **0** |
| Wiki pages missing from `index.md` (excl. index/log) | **0** |
| Code spot-check `HomePage.astro` | Native `components/home/*` composition |
| Code spot-check `BlogLayout.astro` | `SiteHeader` + `SiteFooter` |
| Code spot-check media route | Native header / `MediaArticles` / footer |
| Stale “GHL is live home chrome” claims | Updated in `sites/cae`, `overview`, `architecture/overview`, glossary, GHL section-lift source |

## Ingested this session

| Raw | Source page |
|-----|-------------|
| `2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md` | `wiki/sources/cae-nm-zwds-brand-theme-and-public-theme-toggle.md` |
| `2026-07-28-cae-native-zwds-public-redesign.md` | `wiki/sources/cae-native-zwds-public-redesign.md` |

## Uningested inbox (deferred; not blocking)

| File | Notes |
|------|-------|
| `2026-07-23-git-init-github-remote.md` | Unrelated ops |
| `2026-07-23-cae-admin-blog-posting-accepted.md` | Historical acceptance |
| `2026-07-23-cae-first-blog-post-intro-zi-wei-dou-shu.md` | Content/editorial |
| `2026-07-24-cae-admin-ui-ux.md` | Incremental Admin UX |
| `2026-07-24-cae-public-blog-redesign.md` | Historical; article surface superseded by Immersive Story |
| `2026-07-24-cae-blog-reading-paper-and-index-scale.md` | **Superseded** for article surface |
| `2026-07-27-cae-blog-post-polish-and-bulk-seo-fix.md` | Incremental polish; worth optional later ingest |
| `2026-07-27-cae-zi-wei-dou-shu-9-post-series.md` | Content series plan |

## Follow-ups

1. Optional ingest of Jul 24 public-blog-redesign / reading-paper as historical/superseded stubs.
2. Optional ingest of Jul 27 post-polish.
3. Human Appendix B visual smoke on native surfaces (375/1280, light+dark).
4. Decide fate of unwired `components/ghl/*`.
