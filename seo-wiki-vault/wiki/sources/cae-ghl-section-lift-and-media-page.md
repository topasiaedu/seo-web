# Source: CAE GHL section lift + Media & Press page

| Field | Value |
|-------|--------|
| Raw path | [`raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md`](../../raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md) |
| Ingested | 2026-07-23 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Related captures | [cae-ghl-capture](cae-ghl-capture.md) · [cae-ghl-capture-media](cae-ghl-capture-media.md) |

## Summary

CAE marketing pages switched from a **native BEM rewrite** to a **GHL section lift**: sanitized capture HTML (original GHL `id`/`class`) + sanitized capture CSS under `.hl_page-preview--content`, with CDN images remapped to local assets. Homepage runtime is `apps/cae/src/components/ghl/*`. **Media & Press** ships at `/cae/media/` from a new capture of https://caegoh.com/media. Native `components/home/*` remains parked/unwired.

## Affects

- [sites/cae.md](../sites/cae.md) — routes, homepage/media runtime paths
- [sources/cae-ghl-capture.md](cae-ghl-capture.md) — archive still immutable; runtime is lift copies in `apps/cae`
- [sources/cae-ghl-capture-media.md](cae-ghl-capture-media.md) — new media archive
- [sources/cae-independent-app-and-native-landing.md](cae-independent-app-and-native-landing.md) — multi-app/gateway still valid; homepage visual approach superseded
- [architecture/monorepo.md](../architecture/monorepo.md) — clarify vault archive vs app runtime CSS copies
- [overview.md](../overview.md) — current focus + context map

## Supersedes (visual approach only)

- `raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md` — native CSS-spec parity (uningested; leave raw immutable)
- Homepage claims in `cae-independent-app-and-native-landing` that live page is **only** `components/home/*` with no GHL markup

Multi-app layout (`apps/cae` + gateway) is **not** superseded.

## Open questions

- When to delete parked `components/home/*` + `styles/home/*`
- Whether to gradually re-native sections after superior accepts the lift
