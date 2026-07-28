# Plan: Dr Jasmine — responsive audit + polish

**Status:** Closed — audit pass; **no code changes** (stakeholder 2026-07-28)  
**Date:** 2026-07-28  
**Scope:** `apps/dr-jasmine` live public routes + Admin chrome  
**Method:** CSS/structure review + Playwright overflow checks at 320 / 375 / 390 / 768 / 1024 / 1440  
**Wiki:** [raw inbox](../../seo-wiki-vault/raw/inbox/2026-07-28-dr-jasmine-responsive-audit.md) · [source summary](../../seo-wiki-vault/wiki/sources/dr-jasmine-responsive-audit.md)

---

## Verdict

**Yes — the live Dr Jasmine website is responsive.**

Document-level `scrollWidth === clientWidth` on `/`, `/blog`, and a sample `/blog/[slug]` across phone → desktop. Mobile hamburger ↔ desktop nav switches correctly at `768px`. Layouts use fluid containers, `clamp()` type, and stacked → multi-column grids.

**Decision:** Ship as-is. Optional polish tasks below are **not queued** unless UX complaints appear.

---

## What was checked

| Surface | Live? | Responsive baseline |
|---------|-------|---------------------|
| Home `/` | Yes | Mobile-first hero stack, discover 1→2 cols, meet 1→2 cols, FAQ, workshop band |
| Blog index `/blog` | Yes | Card grid 1 → 2 → 3; no page overflow |
| Blog post `/blog/[slug]` | Yes | Mobile TOC; desktop aside ≥1100px; hero media clipped |
| About `/about`, FAQ `/faq` | No (404; pages not in tree) | Out of scope for this audit |
| GHL fragments under `components/ghl/` | Archive only | Not served as home |
| Admin `/admin/*` | Yes | Viewport meta; limited mobile chrome |

### Foundations already in place

- Viewport: `width=device-width, initial-scale=1` (`PublicLayout`, `AdminLayout`, login)
- Shared shell: `.dj-public-container` = `min(100% - 2×gutter, 72rem)`
- Images: `.dj-public img { max-width: 100% }`
- Nav: toggle + panel `<768px`; desktop links + CTA `≥768px`; toggle hit area 44×44
- Home breakpoints: ~768 / 860 / 900 with `minmax(0, …)` grids
- Blog breakpoints: 640 / 720 / 900 / 960 / 1024 / 1100
- Overflow safety: page `overflow-x: clip`; proof marquee parent `overflow: hidden`
- Reduced motion: marquee falls back to horizontal scroll

### Playwright snapshot (2026-07-28)

| Check | Result |
|-------|--------|
| Page horizontal overflow (all tested viewports) | **0px** |
| Nav toggle visible @320–390 | Yes (`display: flex`) |
| Desktop nav visible @768+ | Yes (`display: flex`) |
| Hero CTA @320 (`Secure My Seat`) | Fits; no overflow |
| Hero headline @320 | Wraps (≈7 lines @24px) — dense, not broken |
| Proof marquee track wider than viewport | Intentional; parent clips |
| Blog post hero `scale(1.02)` | Slightly past edges; parent `overflow: hidden` |

---

## Gaps (priority)

### P1 — UX polish (public)

| ID | Issue | Why it matters | Likely fix |
|----|--------|----------------|------------|
| R1 | GHL hero headline is very long on narrow phones (~7 lines @320) | Reads as wall-of-text; first viewport feels cramped | Optional mobile type tweak (`clamp` floor / slightly tighter line-height) **or** accept GHL copy as locked and rely on portrait-first stack |
| R2 | Discover / pillars-style 2-col at `768px` with long titles | Tablet columns can feel tight | Consider 2-col only ≥900 (align with hero split) |
| R3 | CTA `white-space: nowrap` on `.dj-register-cta` | Safe today for short labels; long future labels could spill | Allow wrap below ~360px, or keep `block` + wrap |

### P2 — Admin (secondary)

| ID | Issue | Why it matters | Likely fix |
|----|--------|----------------|------------|
| R4 | Admin header nav is a wrapping row; only a light `@media (max-width: 40rem)` tweak | Usable but awkward on phones | Compact nav (hamburger or scroll-snap chips) for authenticated chrome only |
| R5 | Post editor / bulk import tables rely on `overflow-x: auto` | OK, but worth a phone smoke pass | Confirm scroll affordance; no layout rewrite unless sticky toolbar fails |

### P3 — Hygiene / QA (non-blocking)

| ID | Issue | Likely fix |
|----|--------|------------|
| R6 | `home.css` still contains unused audience / pillars / blog-band rules | Delete dead CSS when convenient |
| R7 | No shared breakpoint tokens (`--dj-bp-md` etc.) | Optional tokenize 768 / 900 / 1100 for consistency |
| R8 | Residual **human** brand-test on real devices (Opera GX DevTools + one physical phone) | Checklist below |

---

## Out of scope

- Rebuilding GHL registration funnel (`registerUrl` external)
- Restoring `/about` or `/faq` routes (not live; FAQ lives on home)
- Changing Admin data model or blog APIs
- Pixel-matching archived GHL LDP CSS

---

## Implementation tasks (only if polishing)

Mark `[x]` only when DoD is met.

| Task | Name | Effort | Status |
|------|------|--------|--------|
| **T0** | Confirm audit verdict with stakeholder (ship as-is vs polish) | S | [x] ship as-is |
| **T1** | R1 — Mobile hero typography / density pass | S | [ ] deferred / not doing |
| **T2** | R2 — Discover (and any 768 multi-col) tablet spacing | S | [ ] deferred / not doing |
| **T3** | R3 — CTA wrap safeguard under ~360px | S | [ ] deferred / not doing |
| **T4** | R4 — Admin mobile chrome | M | [ ] deferred / not doing |
| **T5** | R6 — Dead home CSS cleanup | S | [ ] deferred / not doing |
| **T6** | Wiki raw + ingest closeout | S | [x] |

---

## Definition of done (polish wave)

1. No new horizontal page overflow at 320 / 375 / 768 / 1024 / 1440 on `/`, `/blog`, one published slug.
2. Nav still switches correctly at 768; mobile menu opens/closes and traps focus as today.
3. Home first viewport: brand + headline + CTA + portrait readable without sideways scroll.
4. Admin login + post list usable at 375 without clipped primary actions.
5. Short note under `apps/dr-jasmine/CONTEXT.md` (Responsive) pointing here.

---

## Manual QA checklist

- [ ] Home @375: portrait above copy, CTA tappable, no sideways scroll
- [ ] Home @768: desktop nav + CTA; discover columns not cramped
- [ ] Home @1440: hero split + marquee clipped (no page scroll-x)
- [ ] Blog index @375 / 1024: cards stack / multi-col
- [ ] Blog slug @375: TOC mobile; body readable; images not escaping page
- [ ] Sticky nav does not cover `#dj-home-meet` / FAQ anchors (`scroll-margin-top`)
- [ ] `prefers-reduced-motion`: marquee becomes scrollable strip
- [ ] Admin login @375; Admin posts list @375

---

## Recommendation

**Closed.** Public responsive behavior ships as-is. Optional polish (T1–T5) is **not queued**. Re-open only if real-device UX complaints appear.
