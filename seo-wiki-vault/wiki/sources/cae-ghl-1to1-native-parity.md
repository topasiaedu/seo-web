# Source: CAE GHL 1:1 native parity (superseded)

| Field | Value |
|-------|--------|
| Raw path | [`raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md`](../../raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md) |
| Ingested | 2026-07-23 |
| Kind | Session notes (implementation) — **superseded** |
| Related site | [CAE](../sites/cae.md) |
| Superseded by | [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md) |

## Summary

Attempted **native BEM 1:1** parity with caegoh.com by treating the vault capture as a design spec only (“do not ship GHL dump as runtime”). That approach was abandoned the same day in favor of a **GHL section lift** (sanitized HTML/CSS copies under `apps/cae/src/components/ghl/` + `styles/ghl/`).

Keep this page so agents do not re-apply the “never ship capture CSS” rule to marketing funnels without reading the lift source.

## Affects (historical)

- Parked code still in tree: `apps/cae/src/components/home/*`, `styles/home/*`
- Current runtime: [sites/cae.md](../sites/cae.md)
