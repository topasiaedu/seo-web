# Source: CAE GHL capture archive (homepage)

| Field | Value |
|-------|--------|
| Raw path | [`raw/research/cae-ghl-capture/`](../../raw/research/cae-ghl-capture/) |
| Ingested | 2026-07-23 |
| Kind | Relocated capture artifacts (immutable) |
| Related site | [CAE](../sites/cae.md) |
| Related session | [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md) |

## Summary

GoHighLevel funnel scrape for **https://caegoh.com/**. Vault archive is immutable. **Runtime** is a sanitized **section lift** under `apps/cae` (`components/ghl/*` + `styles/ghl/ghl-page.css`) — not a Vite import of this folder, and not the parked native BEM tree.

## Current runtime (app)

| Path | Role |
|------|------|
| `apps/cae/src/components/HomePage.astro` | Homepage composition |
| `apps/cae/src/components/ghl/*` | Lifted GHL sections + fragments |
| `apps/cae/src/styles/ghl/*` | Sanitized capture CSS + host/widget patches |
| `apps/cae/src/layouts/HomeLayout.astro` | Preview wrapper + CSS imports |
| `apps/cae/src/assets/` | Local images |
| `apps/cae/src/components/home/*` | Parked native rewrite (unwired) |

## Archive only (raw)

| Subfolder | Contents |
|-----------|----------|
| `_ghl-extract/` | `raw.html`, body slices, extracted CSS, font URL list |
| `ghl-clone-archive/` | Earlier `captured.*`, `host-patch.css`, custom-code HTML/JS |
| `ghl-clone-archive/screenshots/` | Reference / clone PNGs |

## Provenance note

- `ghl-clone-archive/*` — moved from `website/cae/ghl-clone/` on 2026-07-23.
- `_ghl-extract/*` — re-captured from https://caegoh.com/ on 2026-07-23.
- Later 2026-07-23: CAE migrated to `apps/cae`; native BEM attempted; then **GHL section lift** restored as runtime (sanitized copies in-app).

## Affects

- [sites/cae.md](../sites/cae.md) — homepage layout
- Sibling media archive: [cae-ghl-capture-media](cae-ghl-capture-media.md)
- Do not Vite-import vault `_ghl-extract/`; copy/sanitize into `apps/cae/src/styles/ghl/` for runtime
