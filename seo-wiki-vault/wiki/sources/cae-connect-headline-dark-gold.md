# Source: CAE Connect “CONNECT WITH ME” dark-mode gold

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-30-cae-connect-headline-dark-gold.md](../../raw/inbox/2026-07-30-cae-connect-headline-dark-gold.md) |
| Ingested | 2026-07-30 |
| Kind | Session notes (UI contrast fix) |
| Commit | `4d47da1` |
| Related site | [CAE](../sites/cae.md) |
| Related prior | [cae-nm-zwds-brand-theme-and-public-theme-toggle](cae-nm-zwds-brand-theme-and-public-theme-toggle.md) (Connect clip-text); [cae-native-zwds-public-redesign](cae-native-zwds-public-redesign.md) (native Connect) |

## Takeaways

- Dark-mode **“CONNECT WITH ME”** used brand-gradient clip-text; purple gradient stops vanished on the elevated purple Connect band.
- Fix: solid `--cae-gold` (`#d4b896`) in dark (default); keep brand-gradient clip-text in light only.
- Dropped `.cae-text-brand-gradient` from `ConnectCta.astro` so the global utility cannot override section CSS.
- Scope: **this headline only** — social icons and other gradient CTAs unchanged.

## Key code paths

| Path | Role |
|------|------|
| `apps/cae/src/styles/home/connect-cta.css` | Dark gold / light gradient headline rules |
| `apps/cae/src/components/home/ConnectCta.astro` | Connect section markup |
| `apps/cae/src/styles/tokens.css` | `--cae-gold` |
| `apps/cae/src/styles/brand-gradient.css` | Shared clip-text utility (no longer on this H2) |

## Affects

- [sites/cae.md](../sites/cae.md) — Connect headline contrast note
- [cae-nm-zwds-brand-theme-and-public-theme-toggle](cae-nm-zwds-brand-theme-and-public-theme-toggle.md) — Connect clip-text dark override
- [cae-native-zwds-public-redesign](cae-native-zwds-public-redesign.md) — Connect color policy follow-up

## Open (from raw)

1. Visual QA dark + light after deploy
2. Optional later: audit other purple-on-purple clip-text if contrast complaints recur
