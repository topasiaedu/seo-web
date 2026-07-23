# Session notes: CAE GHL section lift + Media & Press page

**Date:** 2026-07-23  
**Kind:** Chat / implementation session  
**Related:**
- Live homepage: https://caegoh.com/
- Live media: https://caegoh.com/media
- Capture archives: `seo-wiki-vault/raw/research/cae-ghl-capture/`, `cae-ghl-capture-media/`
- Runtime app: `apps/cae/` (`base: "/cae/"`)
- Prior sessions (superseded for homepage visual approach):
  - `raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md`
  - `raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md`
**Topic:** Stop hand-porting GHL into BEM CSS. Lift cleaned GHL HTML sections + capture CSS into Astro for 1:1 design, then clone Media & Press into `/cae/media/`.

---

## Decisions from session

1. **Visual fidelity first.** Matching caegoh.com matters more than a maintainable native rewrite. Rewriting markup + CSS in parallel was why the native BEM port drifted.
2. **Ship GHL section lift as homepage runtime** (overrides prior “do not ship dump as runtime” / “native BEM only” notes for the marketing funnel). Capture remains the immutable archive; **sanitized copies** live under `apps/cae/src/styles/ghl/` and `apps/cae/src/components/ghl/`.
3. **Method:** split `preview-cleaned.html` by GHL section ID → Astro components that keep original `id`/`class`; mount CSS under `.hl_page-preview--content`; remap CDN images to local `src/assets/`.
4. **Native `components/home/*` + `styles/home/*` stay in tree but unwired** until superior accepts visual parity (parked, not deleted).
5. **Media & Press** is in-app at `/cae/media/` (same lift method). Homepage nav no longer points at `https://caegoh.com/media`.
6. **CTA funnel URLs** for book-a-call / predictable destiny / socials stay external. Internal nav only: home ↔ media, success-stories hash on home.

---

## What shipped (code)

### Homepage GHL lift

| Path | Role |
|------|------|
| `apps/cae/src/layouts/HomeLayout.astro` | Fonts + `ghl-page.css` + runtime/host/bg CSS; wraps slot in `#preview-container.hl_page-preview--content` |
| `apps/cae/src/components/HomePage.astro` | Composes `components/ghl/*` sections |
| `apps/cae/src/components/ghl/*.astro` | One component per GHL section ID |
| `apps/cae/src/components/ghl/fragments/*.html` | Sanitized HTML slices |
| `apps/cae/src/styles/ghl/ghl-page.css` | Sanitized homepage capture CSS (PostCSS-safe) |
| `apps/cae/src/styles/ghl/{ghl-runtime,host-patch,bg-overrides,press-widget,carousel-widget}.css` | Host chrome + local BGs + widgets |
| `apps/cae/src/scripts/ghl-testimonial-carousel.ts` | Port of custom-code carousel JS |
| `apps/cae/scripts/lift-ghl-sections.mjs` | Regenerates fragments from vault capture |
| `apps/cae/scripts/sanitize-ghl-css.mjs` / `trim-ghl-css.mjs` | CSS sanitize helpers |

### Media & Press page

| Path | Role |
|------|------|
| `apps/cae/src/pages/media/index.astro` | Route `/cae/media/` |
| `apps/cae/src/layouts/MediaLayout.astro` | Media capture CSS + preview wrapper |
| `apps/cae/src/components/ghl/media/*` | Nav / articles / footer lift |
| `apps/cae/src/assets/media/` | Downloaded article + logo assets |
| `apps/cae/src/styles/ghl/media-page.css` | Sanitized media capture CSS |
| `apps/cae/scripts/capture-ghl-media.mjs` | Fetches live `/media` into vault |
| `apps/cae/scripts/lift-ghl-media.mjs` | Fragments + asset download |

### Nav retargets

- Homepage `MEDIA & PRESS` → `/cae/media/`
- Media page logo / SUCCESS STORIES → `/cae/` (+ `#section-3vDFXLsKtI3`)

### Capture archives (immutable vault)

| Archive | Source URL |
|---------|------------|
| `raw/research/cae-ghl-capture/` | https://caegoh.com/ |
| `raw/research/cae-ghl-capture-media/` | https://caegoh.com/media |

---

## Supersedes

| Prior claim | New claim |
|-------------|-----------|
| Homepage = native BEM `components/home/*` | Homepage = GHL section lift `components/ghl/*` |
| Capture = design spec only; never ship dump | Capture = design archive; **sanitized lift is runtime** |
| Media & Press stays on caegoh.com | Media & Press at `/cae/media/` |
| Pixel-perfect via hand-ported CSS recipes | Pixel match via original class/ID + original CSS |

The earlier inbox note `2026-07-23-cae-ghl-1to1-native-parity.md` (native rewrite for 1:1) is **superseded** by this lift approach. Leave the raw file immutable; wiki sources should point agents here for current runtime.

---

## How to preview

```bash
pnpm install
pnpm dev
# → http://127.0.0.1:4321/cae
# → http://127.0.0.1:4321/cae/media/

pnpm --filter @seo/cae dev
# → http://127.0.0.1:4322/cae/
# → http://127.0.0.1:4322/cae/media/
```

Compare with https://caegoh.com/ and https://caegoh.com/media.

---

## Known leftovers / next

1. Parked native `components/home/*` — delete after superior accepts lift.
2. Blog still scaffold.
3. CMS Media Library / Supabase Storage still deferred (local assets for now).
4. Funnel forms/popups still external where original GHL pointed off-site.
