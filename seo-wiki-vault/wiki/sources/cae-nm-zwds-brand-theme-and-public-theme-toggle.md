# Source: CAE ← nm-zwds brand theme + public theme toggle

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md](../../raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md) |
| Ingested | 2026-07-28 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Follow-on | [cae-native-zwds-public-redesign](cae-native-zwds-public-redesign.md) (native home/media/blog chrome cutover); [cae-connect-headline-dark-gold](cae-connect-headline-dark-gold.md) (Connect H2 dark gold override) |

## Takeaways

- Aligned CAE public + Admin colors to **nm-zwds** (Purple Star Astrology) roles: cream light shell, purple night dark shell, gold interactive, 5-stop brand gradient.
- Plan T1–T8 marked implemented in code/docs; human Appendix B visual QA still open.
- Public Light/Dark toggle: `lib/public-theme.ts` + `PublicThemeBoot` / `PublicThemeToggle`; storage key `cae-public-theme` (separate from Admin); default **dark**.
- Logo / home CTAs remapped off funnel `home-page-4444` to app `BASE_URL` (`/cae/`).
- At ingest time of the raw, GHL was still the live home stack with token patches — **later superseded** for live chrome by the native cutover source above.
- Connect “CONNECT WITH ME” clip-text in dark mode was later overridden to solid gold — see [cae-connect-headline-dark-gold](cae-connect-headline-dark-gold.md).

## Brand gradient stops

`#080657` → `#3D0F68` → `#8B1167` → `#D91744` → `#FE8E01`

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/styles/tokens.css` | `--cae-*` nm-zwds roles + `data-theme` light/dark |
| `apps/cae/src/styles/brand-gradient.css` | Gradient utilities |
| `apps/cae/src/styles/admin-theme.css` | Admin cream/navy/gold alignment |
| `apps/cae/src/lib/public-theme.ts` | Public theme persistence |
| `apps/cae/src/components/site/PublicThemeBoot.astro` | FOUC boot |
| `apps/cae/src/components/site/PublicThemeToggle.astro` | Topbar Light/Dark control |
| `docs/references/nm-zwds-design-theme-color-scheme.md` | Hex source of truth |
| `docs/implementation-plan/cae-nm-zwds-brand-theme-alignment.md` | Checklist + residuals |

## Affects

- [sites/cae.md](../sites/cae.md)
- [overview.md](../overview.md)
- [glossary.md](../glossary.md) — nm-zwds / brand theme terms
- [cae-native-zwds-public-redesign](cae-native-zwds-public-redesign.md)

## Open (from raw; partial)

1. Appendix B visual smoke 375/1280 — still recommended
2. “Accept GHL until native cutover” — **closed** by native redesign ingest
3. Commit/push if not yet on remote

## Does not change

- `@seo/blog` / Supabase schema
- Gateway routing
- Intentional Instagram/Facebook funnel social URLs
