# Session notes: CAE GHL 1:1 design via native Astro (not HTML dump)

**Date:** 2026-07-23  
**Kind:** Chat / implementation session (plan + multitask + follow-up section ports)  
**Related:**
- Live reference: https://caegoh.com/
- Capture archive (immutable): `seo-wiki-vault/raw/research/cae-ghl-capture/`
- Runtime app: `apps/cae/` (`base: "/cae/"`)
- Prior session: `raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md`  
**Topic:** Bring the native Astro homepage into visual parity with the GHL funnel by extracting design specs from capture CSS/custom-code — without restoring dumped HTML as runtime.

---

## Decisions from session

1. **No manageable “source markdown” for the GHL page.** The vault has HTML/CSS dump + custom-code widgets + screenshots. Editable copy stays in `apps/cae/src/data/home/*.ts`; markup stays in native Astro components.
2. **Do not ship GHL dump as runtime.** Never reintroduce `captured.html` / mega-CSS / `#preview-container` into the live app. Capture is a **design spec** only.
3. **Visual bar upgraded:** CSS-spec-driven **1:1 section parity** (tokens, type sizes, spacing, structure) from `ghl-page.css` + custom-code files. Maintainable native CSS — not pixel-diff automation.
4. **Supersedes prior decision #6** from the independent-app session (“pixel-perfect GHL parity not required”) for the homepage marketing funnel: aim to match live/caegoh.com section recipes while keeping native code.
5. **Method per section:** inspect capture HTML structure + CSS rules for that section’s GHL IDs → rewrite corresponding `apps/cae/src/components/home/*.astro` + `styles/home/*.css` with the same measurements.
6. **CTA funnel URLs unchanged** (anchors, caegoh.com, predictabledestiny.com, socials).

---

## What shipped (code)

### Foundation / assets

- Corrected misnamed/miswired assets under `apps/cae/src/assets/` (slogan pill, offering photos, collage, platform app/icons, testimonial portraits, press AP SVG).
- Rewrote `apps/cae/src/data/home/images.ts` key → file map.
- Extended `apps/cae/src/styles/tokens.css` with GHL brand values (`#140625`, `#CAB7DA`, `#F9F1FF`, `#8893A8`, button padding/tracking, press/pillars tokens).
- Added section BGs: `offerings-bg.jpeg`, `pillars-bg.jpeg`, `connect-panel-bg.jpeg` (from GHL CDN).

### Sections ported to GHL CSS recipes

| Section | GHL IDs / sources | Native files |
|---------|-------------------|--------------|
| Header | `.custom-header` | `SiteHeader.astro`, `header.css` |
| Hero | `section-GdS5u8Huz`, `cbutton-h2gy3SX8Kg0` + `button-flat-line` | `Hero.astro`, `hero.css` |
| Featured On | `section-JP6zPvfGtS`, `custom-code-tUL6q1clw3`, dividers | `PressMarquee.astro`, `press.css`, `press.ts` |
| Offerings | `section-gZkeGFtHWF`, card cols `radius20` / `#4C247A` | `Offerings.astro`, `offerings.css` |
| Pillars + Wisdom | `section-m2EB8Ft6xN2`, row `wdyPZU4xMb` (−80px bar) | `Pillars.astro`, `pillars.css`, `pillars.ts` |
| Platform / Testimonials / Connect | lower funnel recipes | `Platform.*`, `Testimonials.*`, `ConnectCta.*` |

### Hero specifics (from capture)

- Two-column row: left copy, right empty desktop spacer; portrait lives in BG image.
- BG: absolute, `background-size: 100% auto` (GHL `bgCover100`), no purple wash overlay.
- LEARN MORE: ghost pill — `button-flat-line` forces `transparent !important` over lavender fill in capture CSS; live site matches ghost.
- Type: slogan 40px; H1 72px / 40px mobile Archivo Black; body 20px / 16px with `#38134838` shadow.

### Featured On specifics

- Section `#F9F1FF`, heading Archivo Black 42px / 26px weight 200.
- Single lavender divider `#9461A3` — 10% desktop / 30% mobile (not dual rules).
- Marquee: 70s scroll, gap 4rem, logos 50px / 40px — from `custom-code-tUL6q1clw3`.

### Offerings + pillars specifics

- Offerings: centered 56px headline; 2×2 bordered stacks (image → title → `#CAB7DA` body); bottom clearance for overlap.
- Pillars bar: `#F9F1FF`, border `#4C247A`, shadow `0 20px 100px #04031c52`, `margin-top: -80px`; **no icons** (GHL has none).
- Ancient Wisdom: white 56px headline; lavender uppercase subhead with `letter-spacing: 2px`; collage image.

---

## Multitask wave (earlier same day)

Parallel agents (A foundation, B hero/press, C offerings, D pillars, E lower, F QA) landed first-pass restyle; follow-up sessions tightened hero/press/offerings/pillars against capture CSS after screenshot comparison (ours vs live GHL).

---

## Known leftovers / next polish

1. Lower sections (platform / testimonials / connect) were restyled earlier; may still need the same “inspect GHL ID → apply exact CSS” pass if superior finds drift.
2. Pillar bar icons were incorrectly mapped to platform neon icons at one point — **removed**; do not reintroduce without dedicated GHL assets (none exist).
3. Deploy: `vercel.json` may still build `@seo/website` only — CAE gateway/deploy wiring remains a documented gap from the prior session.
4. This raw note is **not ingested** into the wiki yet (per session request).

---

## How to preview

```bash
pnpm install
pnpm dev
# → http://127.0.0.1:4321/cae
```

Compare side-by-side with https://caegoh.com/ and `raw/research/cae-ghl-capture/ghl-clone-archive/screenshots/`.
