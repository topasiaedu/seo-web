# Session notes: Dr Jasmine home IA collapse + polish

**Date:** 2026-07-28  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Prior raw:** `raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md`  
**Related code:**  
- `apps/dr-jasmine/CONTEXT.md`  
- `apps/dr-jasmine/src/pages/index.astro`  
- `apps/dr-jasmine/src/components/home/*`  
- `apps/dr-jasmine/src/components/faq/FaqAccordion.astro`  
- `apps/dr-jasmine/src/components/site/SiteNav.astro`  
- `apps/dr-jasmine/src/components/site/SiteFooter.astro`  
- `apps/dr-jasmine/src/styles/tokens-public.css`  
- `apps/dr-jasmine/src/site-config.ts`

---

## Summary

Collapsed the Option A multi-page marketing IA into a **GHL-sourced single home** (plus blog + admin). Removed native `/about`, `/faq`, `/programs`, and `/workshop` routes. Home visible copy is taken from the GHL registration LDP only. All workshop CTAs open `registerUrl` (GHL). Polish pass: brand tokens/fonts aligned to patient portal, hero split layout, testimonials marquee, FAQ accordion on home, Meet section socials.

---

## Locked product decisions (2026-07-28)

| Decision | Choice |
|----------|--------|
| Home copy source | GHL registration LDP only — no invented audience / pillars / blog bands on home |
| Conversion | Every `RegisterCta` → `drJasmineSiteConfig.registerUrl` (`https://doctorjasmine.com/register`) |
| Native `/workshop` | **Removed** — do not recreate without updating CONTEXT + site-config |
| Native `/programs` | **Removed** |
| Native `/about` | **Removed** — nav/footer “About” → `/#dj-home-meet` (section, not heading) |
| Native `/faq` | **Removed** — FAQs live on home accordion; footer “FAQ & disclaimer” → `/#dj-home-faq-heading` |
| Contact chrome | Still no phone/email; Instagram + LinkedIn only |
| Dan Henry | Not shown on native public site |
| GHL fragments | Archive/reference under `src/components/ghl/` — not mounted on public routes |

### CTA labels

| Surface | Label | Target |
|---------|-------|--------|
| Nav (default) | Join free workshop | `registerUrl` |
| Home (GHL wording) | Secure My Seat | `registerUrl` |

### Social (config + Meet section)

- Instagram: https://www.instagram.com/drjasminechiew/
- LinkedIn: https://www.linkedin.com/in/jasmine-chiew-glider2626?originalSubdomain=my  
- Also rendered as buttons inside **Meet Dr. Jasmine** (`HomeMeetDoctor.astro`), same URLs as footer.

---

## Public IA (after collapse)

```text
/                  Home (GHL LDP bands + FAQ accordion)
/blog              Public blog (SSR)
/blog/[slug]       Post detail
/admin/**          Brand Admin (unchanged model)
```

Under gateway base: `/dr-jasmine/…`.

### Home stack (top → bottom)

1. **Hero** — split copy left + portrait panel right (not full-bleed washed photo)
2. **Discover** — GHL workshop agenda / discover copy; 2×2 grid; CTA
3. **Meet Dr. Jasmine** — `id="dj-home-meet"`; credentials; Instagram + LinkedIn
4. **Testimonials** — all 7 GHL quotes; infinite CSS marquee; fixed-height cards with quote icon, 5 stars, initial avatar
5. **Closing CTA** — “YOU CAN TAKE CONTROL AGAIN”; cream button + forest label on teal band
6. **FAQ** — ruled accordion (reuse `FaqAccordion`); first open; full answers; FAQPage JSON-LD on home

Shared chrome: `PublicLayout` + `SiteNav` + `SiteFooter` + `RegisterCta`.

---

## Brand tokens / fonts (reconciled this session)

Aligned with patient portal look:

| Role | Value |
|------|--------|
| Forest / primary | `#2D5E4C` |
| Forest deep | `#244D3F` |
| Cream bg | `#FAF8F5` |
| Gold accent | `#B8860B` |
| Display | **DM Serif Display** |
| Body | **Plus Jakarta Sans** |

Files: `tokens-public.css`, `public-fonts.css`.

### CTA contrast fix

On teal bands, inverted CTAs (cream fill + forest text) must beat `.dj-public a.dj-register-cta--primary { color: #fff }`. Use higher-specificity selectors under `.dj-home-workshop` (and similar).

---

## What shipped in code

- Home-only marketing IA; deleted `/about`, `/faq` pages and about-only components
- Nav About → `#dj-home-meet`; FAQ footer → `#dj-home-faq-heading`; scroll-margin for sticky nav
- Testimonials marquee (`HomeProof.astro` + `home.css`)
- FAQ ruled accordion on home; sitemap segments no longer include `about` / `faq`
- Meet section social buttons
- `apps/dr-jasmine/CONTEXT.md` + root `CONTEXT.md` updated for IA

---

## Open questions / follow-ups

1. Optional **301/client redirect** stubs for old `/about` and `/faq` URLs (currently 404).
2. Wiki compile: update `wiki/sites/dr-jasmine.md`, `wiki/overview.md`, `wiki/index.md`, append `wiki/log.md` from this raw note.
3. Human visual QA — desktop/mobile on home bands (hero, marquee, accordion, inverted CTA).
4. Confirm whether stale dist artifacts under `apps/dr-jasmine/dist/**/faq/` / `about/` should be cleaned via rebuild only.

---

## Related plans / docs

- `docs/implementation-plan/dr-jasmine-true-website.md` — Option A multi-page plan (superseded in practice by this home-collapse for public marketing IA)
- `docs/implementation-plan/dr-jasmine-landing-and-admin.md` — Admin + scaffold
- App CONTEXT: `apps/dr-jasmine/CONTEXT.md`
