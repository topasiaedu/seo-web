# Dr Jasmine GHL capture (register / join)

Immutable research dump of the live workshop registration funnel.

| Field | Value |
|-------|--------|
| Start URL | https://doctorjasmine.com/register |
| Resolved URL | https://doctorjasmine.com/join-v2-6756 |
| Captured at | 2026-07-27T09:04:29.522Z |
| Method | `node apps/dr-jasmine/scripts/capture-ghl-page.mjs` (HTTP fetch, follow redirects) |

**Live site does not read this folder.** Runtime lift lives under `apps/dr-jasmine/src/components/ghl/` + `apps/dr-jasmine/src/styles/ghl/`.

## Layout

| Path | Notes |
|------|--------|
| `_ghl-extract/raw.html` | Full HTTP response body |
| `_ghl-extract/preview-cleaned.html` | `#preview-container` slice |
| `_ghl-extract/styles.css` / `ghl-page.css` | Inline `<style>` blocks + linked sheets (fonts skipped) |
| `_ghl-extract/stylesheets.html` | External stylesheet link tags |
| `_ghl-extract/section-ids.json` | GHL `section-*` ids in DOM order |
| `_ghl-extract/asset-urls.json` | CDN image / media URLs discovered in HTML+CSS |
| `_ghl-extract/capture-meta.json` | Provenance metadata |

## Section inventory (capture order)

1. `section-GLe69CVwOE`
2. `section--f-kMZ9azH`
3. `section-JznNLwNnfV`
4. `section-0Po5h7CrMv`
5. `section-agbqSXhonD`
6. `section-jPa9qaoewV`
7. `section-4vgQdH__sU`
8. `section-bNQ2yZ6r2DO`
9. `section-IPYkI1fQ26g`

## Immutability

Do **not** edit files under this folder after the first write. Re-capture goes to a new dated sibling folder if needed.

## Regenerate lift (runtime copies)

From repo root, after a capture exists:

```bash
node apps/dr-jasmine/scripts/download-ghl-assets.mjs
node apps/dr-jasmine/scripts/lift-ghl-sections.mjs
node apps/dr-jasmine/scripts/sanitize-ghl-css.mjs
```

See `apps/dr-jasmine/scripts/README.md`.

