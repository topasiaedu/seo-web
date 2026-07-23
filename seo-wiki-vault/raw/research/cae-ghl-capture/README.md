# CAE GHL capture archive (raw)

Immutable research dump of GoHighLevel (GHL) capture artifacts formerly kept under `website/cae/`.

**Live site does not read this folder.** Runtime homepage uses the normal CAE site tree:

- `website/cae/pages/index.astro`
- `website/cae/components/HomePage.astro`
- `website/cae/content/home/markup.html`
- `website/cae/content/home/meta.ts`
- `website/cae/scripts/testimonial-carousel.js`
- `website/cae/styles/home.css`
- `website/cae/styles/home-host-patch.css`
- `website/cae/layouts/HomeLayout.astro`

## Layout

| Path | Origin | Notes |
|------|--------|--------|
| `_ghl-extract/` | Intermediate scrape (HTML/CSS slices) | Re-fetched from https://caegoh.com/ on 2026-07-23 when relocating out of the app tree |
| `ghl-clone-archive/` | Unused siblings of the old `ghl-clone/` | Moved as-is from `website/cae/ghl-clone/` on 2026-07-23 |
| `ghl-clone-archive/screenshots/` | Visual QA PNGs | Reference / clone comparison shots |

## When to open this

- Re-learning how the CAE homepage was captured from GHL
- Diffing a new capture against older extract intermediates
- Recovering custom-code snippets or screenshot references

Wiki summary: `wiki/sources/cae-ghl-capture.md`
