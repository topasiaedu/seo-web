# Plan: CAE website ← nm-zwds design theme & color scheme

**Status:** Draft — not started  
**Date:** 2026-07-28  
**Reference:** [`docs/references/nm-zwds-design-theme-color-scheme.md`](../references/nm-zwds-design-theme-color-scheme.md)  
**Domain language:** [`apps/cae/CONTEXT.md`](../../apps/cae/CONTEXT.md)  
**Scope app:** `apps/cae` only (do not change `apps/dr-jasmine`, gateway routing, or shared `@seo/blog` APIs)

---

## Goal

Bring CAE’s public site and Admin closer to the **nm-zwds** (“Purple Star Astrology”) product palette so the website and the client-facing app feel like one personal brand: warm parchment cream, deep indigo night sky, soft purple, gold/coral accents, and the **5-stop brand gradient**.

This is a **token-first rebrand + surface rollout**, not a full IA rewrite and not a rebuild of GHL HTML sections from scratch.

---

## Current state (audit)

| Surface | How it’s styled today | Theme coupling |
|---------|----------------------|----------------|
| Home `/cae/` | GHL lift (`HomeLayout` + `ghl/*` + `ghl-page.css` / `ghl-runtime.css`) | **Hardcoded GHL hex** (`#100022`, `#140625`, `#9461A3`, `#F9F1FF`, …) |
| Media `/cae/media` | Same GHL family (`MediaLayout` + `media-page.css`) | Hardcoded GHL hex |
| Blog index + slug | Native `.blog-page` under GHL chrome | Mostly **`--cae-*` tokens** (`tokens.css`) |
| Native `home/*.css` + `components/home/*` | Present but **mostly unwired** (HomeInsights is the live exception) | Token-aware; good future path |
| Admin `/cae/admin` | `admin-theme.css` + shell/forms | Separate `--admin-*` light/dark (purple-adjacent, **not** nm-zwds cream/gold) |

### Gap vs nm-zwds (high level)

| Aspect | nm-zwds | CAE website today |
|--------|---------|-------------------|
| Mood | Cream parchment + purple night; gold interactive in dark | Dark purple marketing only; little cream/gold language |
| Brand signature | 5-stop gradient `#080657 → #3D0F68 → #8B1167 → #D91744 → #FE8E01` | **Absent** |
| Primary interactive (light) | Brand purple `#6B5B95` | Admin/links use `#4c247a` / `#7a4d9a` family |
| Primary interactive (dark) | Gold `#D4AF7B` / `#D4B896` | Lavender CTAs / white outline buttons; star `#f4b400` only |
| Page shell (dark) | `#2D1B4E` / `#1A0F2E` | `#100022` / `#140625` / `#0a0114` |
| Light shell | Cream `#F6F0E8`, white cards | Rare light strips (`#F9F1FF` press), Admin lavender-tinted light |
| UI font | Inter | Hanken Grotesk |
| Display / titles | Serif for analysis titles; bold uppercase heroes | Archivo Black uppercase heroes |
| Semantic tokens | `theme-*` + light/dark class | `--cae-*` (public) + `--admin-*` (Admin); no shared brand-gradient tokens |

---

## Locked decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Source of truth for hex | nm-zwds reference doc (mirror app `color-scheme.css` roles). Document any intentional CAE deltas in `tokens.css` comments. |
| 2 | Public marketing mode | Stay **dark-first** (night sky). Map public surfaces to nm-zwds **dark** roles, not a cream homepage flip. |
| 3 | Cream usage on public site | Cream / warm surfaces for **light bands only** (press, pillars bar, white testimonial cards, optional blog callouts) — not full-page light marketing. |
| 4 | Brand gradient | Add as first-class CSS tokens + utilities. Use on **footer accents, primary filled CTAs, logo/wordmark clip-text (≤1–2 per viewport)**. Do not paint over photographic heroes. |
| 5 | Typography (v1) | **Keep Hanken Grotesk + Archivo Black** on public marketing/blog (GHL + existing magazine system). Do **not** force Inter site-wide in v1 (would fight GHL font stacks and Archivo hero voice). Optional: Inter on Admin only in a later task if desired. |
| 6 | GHL strategy | **Override / patch**, do not re-capture or rewrite all GHL HTML. Prefer `tokens.css` → `bg-overrides.css` / `host-patch.css` / thin remaps. Native `home/*` stays dormant unless a later wave rewires HomePage. |
| 7 | Admin | Align `--admin-*` to nm-zwds light/dark semantics (cream shell, brand purple / gold interactive, coral danger). Keep Admin theme toggle behavior. |
| 8 | Out of scope | Dr Jasmine app; nm-zwds app code changes; Tailwind theme port; star-field canvas from the app; changing Post/Author/Category domain model. |

### Open decision (resolve before T5 if contested)

| Topic | Options | Default if no reply |
|-------|---------|---------------------|
| How hard to shift dark shell hex | **A)** Soft align (keep near-black `#100022` family, retune accents + gradient) · **B)** Hard align (shell → `#2D1B4E` / `#1A0F2E`) | **B** for tokens + blog/Admin; **A→B hybrid** for GHL (override section BGs where safe, accept residual GHL hex until native home) |

---

## Target token map (public `--cae-*`)

Map existing CAE custom properties onto nm-zwds roles. Exact names may stay `--cae-*` for less churn; values change.

| CAE token (today) | New role / target | nm-zwds hex |
|-------------------|-------------------|-------------|
| `--cae-bg` | Page shell (dark) | `#2D1B4E` (surface-dark) |
| `--cae-bg-deep` | Deeper shell / footer | `#1A0F2E` (surface-darkSecondary) |
| `--cae-bg-elevated` / `--cae-bg-header` | Elevated / nav | `#3D2860` (surface-darkElevated) or keep slightly darker header if contrast needs it |
| `--cae-surface` / soft / panel | Cards / soft fills | `#3D2860` / `#1A0F2E` + purple opacity panels |
| `--cae-text` / bright / soft | Primary cream text | `#F6F0E8` (+ near-white variants sparingly) |
| `--cae-text-muted*` | Secondary | `#C4C4C4` / `#B8AED0` subtle |
| `--cae-purple` / accent / lavender* | Brand purple scale | `#6B5B95` / `#4A3F6B` / `#9B8FB5` |
| `--cae-star` | Gold accent (was chartreuse-gold) | `#D4B896` or `#D4AF7B` |
| `--cae-press-bg` | Light band | `#F6F0E8` (cream) |
| `--cae-press-text` | Text on cream | `#1A1E3F` (navy) |
| New: `--cae-brand-gradient` | 5-stop gradient | stops in reference |
| New: `--cae-coral` | Danger / error | `#C84C5C` / dark `#D97C6E` |
| New: `--cae-gold` / `--cae-gold-dark` | Interactive dark CTAs | `#D4B896` / `#D4AF7B` |
| New: `--cae-cream` / `--cae-navy` | Light-panel text/bg | `#F6F0E8` / `#1A1E3F` |

Admin `--admin-*` should parallel the same semantics (light = cream/white/navy/purple; dark = purple night + gold interactive).

---

## Architecture

```mermaid
flowchart TB
  REF[nm-zwds reference MD]
  TOK[tokens.css --cae-*]
  ADM[admin-theme.css --admin-*]
  BLOG[blog-page.css]
  NATIVE[home/*.css unused + HomeInsights]
  GHL[ghl-runtime + ghl-page + media-page]
  PATCH[bg-overrides + host-patch]

  REF --> TOK
  REF --> ADM
  TOK --> BLOG
  TOK --> NATIVE
  TOK --> PATCH
  PATCH --> GHL
  ADM --> AdminUI[Admin shell/forms/widgets]
```

**Principle:** Change hex at the token layer first; consumers that already use `var(--cae-*)` inherit. GHL and one-off hex get patched in dedicated waves.

---

## Master progress board

Mark a task `[x]` only when its **Definition of done** is fully met.

| Wave | Task | Name | Effort | Status |
|------|------|------|--------|--------|
| 0 | **T1** | Brand token foundation + gradient utilities | M | [ ] |
| 0 | **T2** | Visual QA fixtures + before/after checklist | S | [ ] |
| 1 | **T3** | Blog surfaces consume new tokens | M | [ ] |
| 1 | **T4** | Native home CSS + HomeInsights alignment | S | [ ] |
| 2 | **T5** | GHL home/media overrides (patch path) | L | [ ] |
| 2 | **T6** | Brand gradient on CTAs / footer / selective text | M | [ ] |
| 3 | **T7** | Admin theme alignment (light cream + dark gold) | M | [ ] |
| 3 | **T8** | Docs / CONTEXT note + smoke + plan closeout | S | [ ] |

### Multitask launch order

```text
Wave 0 — start together:
  T1 + T2

Wave 1 — after T1 merged:
  T3 + T4

Wave 2 — after T1 (T3 helpful but not strictly blocking for GHL):
  T5 + T6     ← same owner preferred; T6 may land inside T5 if smaller

Wave 3 — after Wave 1–2:
  T7 then T8  ← T8 last
```

```mermaid
flowchart TB
  subgraph w0 [Wave 0]
    T1[T1 Tokens]
    T2[T2 QA fixtures]
  end
  subgraph w1 [Wave 1]
    T3[T3 Blog]
    T4[T4 Native home CSS]
  end
  subgraph w2 [Wave 2]
    T5[T5 GHL overrides]
    T6[T6 Gradient CTAs]
  end
  subgraph w3 [Wave 3]
    T7[T7 Admin theme]
    T8[T8 Docs smoke]
  end
  T1 --> T3
  T1 --> T4
  T1 --> T5
  T1 --> T6
  T3 --> T8
  T5 --> T8
  T6 --> T8
  T7 --> T8
```

---

## Wave 0 — Foundation

### T1 — Brand token foundation + gradient utilities

| | |
|--|--|
| **Owns** | `apps/cae/src/styles/tokens.css`, optionally thin `apps/cae/src/styles/brand-gradient.css` (imported from `global.css` / layouts that need it) |
| **Depends on** | None (reference MD only) |
| **Must not** | Restyle GHL HTML; change Admin pages; rewrite blog layout structure |

#### Checklist

- [ ] Rewrite `:root` `--cae-*` values to match the **Target token map** (dark-first public).
- [ ] Add `--cae-brand-gradient` (and stop vars if useful) documenting the 5 hex stops.
- [ ] Add `--cae-cream`, `--cae-navy`, `--cae-gold`, `--cae-gold-dark`, `--cae-coral`, `--cae-coral-dark`.
- [ ] Add utility classes (plain CSS, not Tailwind): e.g. `.cae-bg-brand-gradient`, `.cae-text-brand-gradient` (background-clip text) with a comment: use ≤1–2 text targets per viewport.
- [ ] Comment block at top of `tokens.css` citing `docs/references/nm-zwds-design-theme-color-scheme.md` as source of truth.
- [ ] Keep font tokens as Hanken / Archivo for v1 (no Inter swap).
- [ ] Ensure `global.css` still imports tokens; no broken `var()` references.

#### Definition of done

- Token file alone encodes nm-zwds roles; gradient utilities exist and are unused-or-demo-safe.
- `pnpm`/`npm` typecheck + CAE build still succeed with no consumer changes required (consumers may look wrong until later tasks — that is OK if build is green).
- No secrets or app-source files from nm-zwds copied into the repo (hex only from the reference MD).

---

### T2 — Visual QA fixtures + before/after checklist

| | |
|--|--|
| **Owns** | This plan’s QA appendix (update in place) **or** a short note under `apps/cae/README.md` / CONTEXT “Brand theme QA” subsection — pick one place and link it here |
| **Depends on** | None |
| **Must not** | Change production CSS beyond docs |

#### Checklist

- [ ] List QA routes: `/cae/`, `/cae/media`, `/cae/blog`, one real `/cae/blog/[slug]`, `/cae/admin/login`, `/cae/admin` (light + dark).
- [ ] List viewport sizes: 375px and 1280px.
- [ ] Note brand-test: after removing nav, first viewport still reads as CAE / Purple Star (gradient or night + cream accents present).
- [ ] Capture “known GHL residuals” expectations (some GHL hex may remain until native home).

#### Definition of done

- Engineers implementing T3–T7 have a single checklist to mark pass/fail; linked from this plan.

---

## Wave 1 — Token consumers (native)

### T3 — Blog surfaces consume new tokens

| | |
|--|--|
| **Owns** | `apps/cae/src/components/blog/blog-page.css` and any blog component CSS that hardcodes old purple hex; blog layouts only if import needed for gradient utility |
| **Depends on** | T1 |
| **Must not** | Change BlogLayout chrome (MediaNav/Footer); change markdown pipeline; change Admin |

#### Checklist

- [ ] Replace remaining raw `#100022` / `#140625` / `#4c247a` / `#b98bc8`-family fallbacks with `var(--cae-*)` where practical.
- [ ] Retune accents: links/focus → brand purple / gold per dark semantic roles.
- [ ] Light-on-dark reading measure unchanged (~40–42rem body).
- [ ] Index featured tile + slug hero still cinematic; no accidental cream full-page blog.
- [ ] Optional: one restrained brand-gradient accent (e.g. eyebrow rule or CTA fill) — not on hero photo overlays as stickers.

#### Definition of done

- `/cae/blog` and a published slug at 375px + 1280px look intentional under the new palette.
- No regression: TOC sticky offset, FAQ, related cards, JSON-LD untouched functionally.
- CAE build green.

---

### T4 — Native home CSS + HomeInsights alignment

| | |
|--|--|
| **Owns** | `apps/cae/src/styles/home/*.css`, `apps/cae/src/components/home/home-insights.css` (and related HomeInsights markup only if class hooks needed) |
| **Depends on** | T1 |
| **Must not** | Rewire `HomePage.astro` from GHL → native (that is a future project); edit GHL fragment HTML |

#### Checklist

- [ ] Sweep `home/*.css` for hardcoded hex; prefer `var(--cae-*)`.
- [ ] Align HomeInsights band to new tokens so the live Blog strip on the GHL home matches brand (this is the one native band on production home).
- [ ] Press / pillars light strips use cream `#F6F0E8` + navy text when those native sheets are used later.
- [ ] Star/rating accents use gold tokens, not `#f4b400`, in native sheets.

#### Definition of done

- HomeInsights on `/cae/` visually matches the new blog/token language.
- Dormant native home CSS is ready for a future GHL→native cutover without a second rebrand pass.
- Build green.

---

## Wave 2 — GHL public marketing

### T5 — GHL home/media overrides (patch path)

| | |
|--|--|
| **Owns** | `apps/cae/src/styles/ghl/bg-overrides.css`, `host-patch.css`, minimal additions to `ghl-runtime.css` **only if required**; do **not** regenerate full `ghl-page.css` / `media-page.css` unless a surgical search-replace of brand hex is agreed |
| **Depends on** | T1; prefer T4 HomeInsights already aligned |
| **Must not** | Re-run capture scripts as the primary approach; change gateway; break nav hash links |

#### Checklist

- [ ] Override preview-container / section background cascade toward `--cae-bg` / `--cae-bg-elevated` where overrides already hook.
- [ ] Retune lavender/purple accent overrides to brand purple scale.
- [ ] Light bands (press `#F9F1FF` etc.) → cream `#F6F0E8` + navy text via overrides when selectors are stable.
- [ ] Media page ground matches home family after overrides.
- [ ] Smoke: LogoBar, Nav, Hero, Press, Insights, Pillars, Platform, SocialProof, Carousel, Connect, Footer — no broken layout or invisible text.
- [ ] Document any **residual** GHL hex that cannot be overridden without a native rewrite (list in T2 QA notes).

#### Definition of done

- `/cae/` and `/cae/media` read as the same night-sky + cream-accent brand as blog, even if some GHL internals remain.
- Sticky nav, mobile menu, carousel still work.
- Build green; no new console errors on those routes.

---

### T6 — Brand gradient on CTAs / footer / selective text

| | |
|--|--|
| **Owns** | CTA/button override CSS (host-patch or small brand CSS), footer accent areas, optional wordmark/heading clip-text; may touch GHL Connect/Footer wrappers sparingly |
| **Depends on** | T1; usually same PR as T5 or immediately after |
| **Must not** | Apply gradient text on top of already colorful hero banners; rainbow every section |

#### Checklist

- [ ] Primary filled CTAs (home connect / key buttons) use brand gradient or gold-dark fill per dark-mode interactive rules.
- [ ] Footer (or footer top rule / band) uses gradient accent consistent with nm-zwds `bg-footer-light` spirit (adapted for dark site).
- [ ] At most 1–2 gradient-text moments above the fold across home.
- [ ] Hover/focus states remain accessible (contrast checked on cream and on purple night).

#### Definition of done

- Brand signature gradient is visible within the first screenful of home **or** on primary CTA + footer without looking gimmicky.
- Blog optional gradient accent (if any) matches the same token.
- Build green.

---

## Wave 3 — Admin + closeout

### T7 — Admin theme alignment

| | |
|--|--|
| **Owns** | `apps/cae/src/styles/admin-theme.css`, `admin-shell.css` light defaults on `:root`, any hardcoded admin page hex that fights the theme |
| **Depends on** | T1 (shared mental model); can parallel Wave 2 |
| **Must not** | Change auth/RLS; redesign Admin IA; force Inter unless explicitly approved in this task |

#### Checklist

- [ ] Light theme: page bg → cream `#F6F0E8`; elevated → white; text → navy `#1A1E3F`; interactive → `#6B5B95` → deep `#4A3F6B` on hover; borders purple ~32% opacity feel.
- [ ] Dark theme: shell → `#2D1B4E` / cards `#3D2860` / `#1A0F2E`; text cream; interactive → gold dark `#D4AF7B`.
- [ ] Danger → coral light/dark; success banners may use `surface-warm` `#F5E8D4` tint where appropriate.
- [ ] Primary button text: cream on purple (light); dark secondary `#1A0F2E` on gold (dark) — match nm-zwds roles.
- [ ] TipTap / forms / status chips remain readable; focus rings use brand purple / gold.
- [ ] Theme toggle still switches `data-theme` correctly.

#### Definition of done

- Login + post list + post editor + author + categories pass light and dark visual check at 1280px.
- Admin no longer feels like a different purple product from nm-zwds light/dark.
- Build green.

---

### T8 — Docs / CONTEXT note + smoke + plan closeout

| | |
|--|--|
| **Owns** | `apps/cae/CONTEXT.md` or `apps/cae/README.md` (brand theme pointer), this plan status, T2 QA checklist completion |
| **Depends on** | T3–T7 as implemented |
| **Must not** | Rewrite unrelated wiki; invent new product language |

#### Checklist

- [ ] Short “Brand theme” note: source = nm-zwds reference; public dark-first; tokens in `tokens.css`; Admin in `admin-theme.css`.
- [ ] Link this plan + reference MD.
- [ ] Run T2 smoke checklist; mark pass/fail with date.
- [ ] Set this plan **Status** to Implemented (or Partial + residual GHL list).
- [ ] Master progress board tasks marked `[x]` only where DoD met.

#### Definition of done

- Future agents know where brand hex lives and must not reintroduce `#9461A3` / `#100022` as new sources of truth without updating tokens.
- Plan board reflects reality.

---

## Global Definition of Done (program)

The brand alignment program is **done** when all of the following hold:

1. **Tokens** — `tokens.css` (+ Admin theme) encode nm-zwds roles and the 5-stop gradient.
2. **Blog + Admin** — Clearly same family as the app’s dark/light semantics.
3. **Home + Media** — Recognizably aligned via overrides; residuals documented if any.
4. **Brand gradient** — Visible on agreed CTA/footer (and sparing text), not sprayed everywhere.
5. **Typography** — Public still Hanken + Archivo (v1); no accidental Inter regression in GHL font links unless a follow-up task changes it.
6. **QA** — T2 checklist completed at 375px and 1280px for listed routes.
7. **Build** — CAE typecheck/build green; no auth/blog regressions.

---

## Out of scope / follow-ups (do not block v1)

| Item | Why later |
|------|-----------|
| Full GHL → native `HomePage` rewire | Large product project; tokens/native CSS prepared by T4 |
| Inter site-wide or serif analysis titles on blog | Conflicts with Archivo magazine voice; revisit after native home |
| Star-field background from nm-zwds | Atmosphere feature, not required for color alignment |
| Porting Tailwind `theme-*` class names | CAE is plain CSS/Astro, not Tailwind |
| Syncing hex automatically from nm-zwds repo | Manual mirror via reference MD is enough for v1 |
| Dr Jasmine brand changes | Separate brand |

---

## Risk register

| Risk | Mitigation |
|------|------------|
| GHL CSS specificity blocks overrides | Prefer existing `bg-overrides` / `host-patch`; escalate to surgical hex replace in capture CSS only with clear diff |
| Hard shell shift (`#2D1B4E`) makes photos/logo clash | Soften header/hero overlays; keep logo assets; visual QA on hero first |
| Cream press band + navy text reduces “wow” | Keep dark hero dominant; cream only for proof/press strips |
| Admin gold CTAs low contrast | Verify WCAG-ish contrast; adjust gold stop or button text token |
| Dual sources of truth (tokens vs GHL file) | T8 docs + forbid new hardcoded brand hex in native CSS |

---

## Appendix A — Brand gradient (copy reference)

| Stop | Hex |
|------|-----|
| 1 | `#080657` |
| 2 | `#3D0F68` |
| 3 | `#8B1167` |
| 4 | `#D91744` |
| 5 | `#FE8E01` |

---

## Appendix B — Smoke checklist (fill during T2/T8)

| Route | 375 | 1280 | Notes |
|-------|-----|------|-------|
| `/cae/` | [ ] | [ ] | |
| `/cae/media` | [ ] | [ ] | |
| `/cae/blog` | [ ] | [ ] | |
| `/cae/blog/{slug}` | [ ] | [ ] | |
| `/cae/admin/login` | [ ] | [ ] | |
| `/cae/admin` light | [ ] | [ ] | |
| `/cae/admin` dark | [ ] | [ ] | |

**Date completed:** _TBD_  
**Residuals:** _TBD_
