# Source: CAE GHL section lift + Media & Press page

| Field | Value |
|-------|--------|
| Raw path | [`raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md`](../../raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md) |
| Ingested | 2026-07-23 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related captures | [cae-ghl-capture](cae-ghl-capture.md) · [cae-ghl-capture-media](cae-ghl-capture-media.md) |

## Summary

CAE marketing pages switched from a **native BEM rewrite** to a **GHL section lift**: sanitized capture HTML (original GHL `id`/`class`) + sanitized capture CSS under `.hl_page-preview--content`, with CDN images remapped to local assets. Homepage runtime **was** `apps/cae/src/components/ghl/*`. **Media & Press** shipped at `/cae/media/` from a capture of https://caegoh.com/media. UI-safe SEO layered on top — see [cae-seo-improvements](cae-seo-improvements.md).

**Status (2026-07-28):** Live public home/media/blog chrome cut back to the **Native ZWDS public stack** — see [cae-native-zwds-public-redesign](cae-native-zwds-public-redesign.md). GHL components remain as unwired archive; this source stays historical.

## Affects

- [sites/cae.md](../sites/cae.md) — routes, homepage/media runtime paths, SEO
- [sources/cae-ghl-capture.md](cae-ghl-capture.md) — archive still immutable; runtime was lift copies in `apps/cae`
- [sources/cae-ghl-capture-media.md](cae-ghl-capture-media.md) — media archive
- [sources/cae-seo-improvements.md](cae-seo-improvements.md) — head / sitemap / remapper SEO on the lift
- [sources/cae-independent-app-and-native-landing.md](cae-independent-app-and-native-landing.md) — multi-app/gateway still valid
- [cae-native-zwds-public-redesign](cae-native-zwds-public-redesign.md) — **supersedes live chrome**
- [architecture/monorepo.md](../architecture/monorepo.md) — vault archive vs app runtime CSS copies
- [overview.md](../overview.md) — current focus + context map

## Supersedes (visual approach only)

- `raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md` — native CSS-spec parity (uningested; leave raw immutable)
- Earlier “native only, no GHL markup” claims in `cae-independent-app-and-native-landing` (temporarily true again after Jul 28 cutover)

Multi-app layout (`apps/cae` + gateway) is **not** superseded.

## Open questions

- When to delete unwired `components/ghl/*` after acceptance of native cutover
- Formal Appendix B visual smoke on native surfaces
