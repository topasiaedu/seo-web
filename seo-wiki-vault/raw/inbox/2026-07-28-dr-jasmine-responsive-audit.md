# Session notes: Dr Jasmine responsive audit — no code changes

**Date:** 2026-07-28  
**Kind:** Chat / audit notes (human-directed vault intake)  
**App:** `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Plan:** `docs/implementation-plan/dr-jasmine-responsive-audit.md`  
**Decision:** Public site is mobile-responsive and mobile-friendly — **no implementation / polish PR**. Optional polish tasks deferred indefinitely unless UX complaints appear.

---

## Summary

Audited live Dr Jasmine public routes for responsiveness. CSS/structure review plus Playwright checks at 320 / 375 / 390 / 768 / 1024 / 1440. **Verdict: responsive.** Document-level horizontal overflow was **0px** on `/`, `/blog`, and a sample `/blog/[slug]`. Mobile hamburger ↔ desktop nav switches correctly at `768px`. Stakeholder chose **no code changes**.

---

## Scope checked

| Surface | Live? | Result |
|---------|-------|--------|
| Home `/` | Yes | Mobile-first; portrait-first hero under 900px; discover / meet grids; FAQ; workshop band |
| Blog index `/blog` | Yes | Card grid 1 → 2 → 3; no page overflow |
| Blog post `/blog/[slug]` | Yes | Mobile TOC; desktop aside ≥1100px; hero media clipped |
| `/about`, `/faq`, `/programs`, `/workshop` | No (404) | Out of scope (already removed from IA) |
| GHL `components/ghl/` | Archive only | Not served on public home |
| Admin `/admin/**` | Yes | Viewport meta present; chrome usable but not polished for phones |

---

## Foundations already in code (no change needed)

- Viewport: `width=device-width, initial-scale=1` (`PublicLayout`, `AdminLayout`, login)
- `.dj-public-container` fluid max-width + gutters
- `.dj-public img { max-width: 100% }`
- Nav: toggle + panel `<768px`; desktop nav ≥768px; 44×44 toggle target
- Home breakpoints ~768 / 860 / 900 with `minmax(0, …)` grids
- Blog breakpoints 640 / 720 / 900 / 960 / 1024 / 1100
- Page `overflow-x: clip`; proof marquee parent `overflow: hidden`
- Reduced-motion: marquee falls back to horizontal scroll strip

---

## Playwright snapshot (2026-07-28)

| Check | Result |
|-------|--------|
| Page horizontal overflow (all tested widths) | **0px** |
| Nav toggle @320–390 | Visible |
| Desktop nav @768+ | Visible |
| Hero CTA @320 (`Secure My Seat`) | Fits |
| Hero headline @320 | Wraps (~7 lines @24px) — dense GHL copy, not broken |
| Proof marquee wider than viewport | Intentional; parent clips |
| Blog post hero `scale(1.02)` Ken Burns | Slight edge bleed; parent `overflow: hidden` |

---

## Decision log

| Item | Choice |
|------|--------|
| Public responsive baseline | **Pass — ship as-is** |
| Optional polish (T1–T3: hero density, tablet discover cols, CTA wrap) | **Not doing** |
| Admin mobile chrome polish (T4) | **Not doing** unless authors edit on phones |
| Dead CSS cleanup in `home.css` (T5) | Optional hygiene only; not required for responsive |

Plan file remains documentation of the audit; status: **closed — no code changes**.

---

## Does not change

- Public IA (single home + blog + admin)
- `registerUrl` funnel / CTA labels
- Brand tokens / fonts
- Admin auth or `@seo/blog` APIs
- GHL archive under `raw/research/dr-jasmine-ghl-capture/`
