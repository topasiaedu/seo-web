# Source: CAE Media & Press GHL capture archive

| Field | Value |
|-------|--------|
| Raw path | [`raw/research/cae-ghl-capture-media/`](../../raw/research/cae-ghl-capture-media/) |
| Ingested | 2026-07-23 |
| Kind | Research capture artifacts (immutable) |
| Related site | [CAE](../sites/cae.md) |
| Related session | [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md) |

## Summary

HTTP capture of **https://caegoh.com/media** (2026-07-23). Vault archive only — live page is the Astro lift under `apps/cae/src/pages/media/` + `components/ghl/media/` + `styles/ghl/media-page.css`.

## Archive layout

| Path | Notes |
|------|--------|
| `_ghl-extract/raw.html` | Full response |
| `_ghl-extract/preview-cleaned.html` | `#preview-container` slice |
| `_ghl-extract/styles.css` / `ghl-page.css` | Inline `<style>` dump |
| `README.md` | Archive index |

## Sections (GHL IDs)

| ID | Content |
|----|---------|
| `section-TX7QG09A69` | Nav |
| `section-D3OvNABS8F` | “Media & Press” + article cards |
| `section-R2YzY26o5TE` | Footer |

## Affects

- [sites/cae.md](../sites/cae.md) — `/cae/media/` route
- Do not treat this folder as a Vite import path; copy/sanitize into `apps/cae` for runtime
