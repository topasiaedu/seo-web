# Session notes: CAE ← nm-zwds brand theme + public theme toggle + logo home fix

**Date:** 2026-07-28  
**Kind:** Chat / implementation notes  
**Branch:** `cae`  
**Related:**  
- Plan: `docs/implementation-plan/cae-nm-zwds-brand-theme-alignment.md`  
- Reference: `docs/references/nm-zwds-design-theme-color-scheme.md`  
- `apps/cae/src/styles/tokens.css`  
- `apps/cae/src/styles/brand-gradient.css`  
- `apps/cae/src/styles/admin-theme.css` / `admin-shell.css`  
- `apps/cae/src/styles/ghl/host-patch.css` / `ghl-runtime.css` / `carousel-widget.css`  
- `apps/cae/src/components/blog/blog-page.css`  
- `apps/cae/src/styles/home/*.css` + `components/home/home-insights.css`  
- `apps/cae/src/lib/public-theme.ts`  
- `apps/cae/src/components/site/PublicThemeBoot.astro` / `PublicThemeToggle.astro`  
- `apps/cae/src/components/ghl/Nav.astro` / `media/MediaNav.astro`  
- `apps/cae/src/components/ghl/remapHtml.ts`  
- `apps/cae/src/components/ghl/fragments/nav.html` / `connect.html`  
- `apps/cae/CONTEXT.md` (Brand theme section)  
**Topic:** Align CAE website colors with the nm-zwds client app palette; add public Light/Dark topbar toggle; fix homepage logo linking to the old GHL funnel URL.

---

## Problem

1. **Brand split** — nm-zwds (Purple Star Astrology app used with CAE clients) has a documented cream / purple-night / gold / 5-stop brand gradient system. The CAE site still spoke GHL lavender / near-black (`#100022`, `#9461A3`, `#F9F1FF`, …) — website and app did not feel like one personal brand.
2. **Admin had theme toggle; public did not** — after token alignment, there was no way to switch public pages between dark-first marketing and nm-zwds light (cream) roles.
3. **Logo href** — homepage GHL nav logo still pointed at capture URL `https://caegoh.com/home-page-4444` instead of this app’s base (`/cae/`). Media nav already used `__GHL_BASE__`; home remapper only rewrote Blog/Media.

---

## Locked decisions (from plan)

| # | Choice |
|---|--------|
| Public mode | Stay **dark-first**; cream for light bands / light theme shell |
| Typography v1 | Keep Hanken Grotesk + Archivo Black (no Inter site-wide) |
| GHL | Override / patch (`host-patch`, `bg-overrides`); do not re-capture as primary |
| Gradient | CTAs / footer accents / ≤1–2 clip-text moments per viewport |
| Shell hex | Decision **B** for tokens: `#2D1B4E` / `#1A0F2E` family |
| Admin | Align `--admin-*` to same nm-zwds light/dark semantics |

---

## What shipped

### Brand theme alignment (plan T1–T8)

Executed via parallel agents on `cae`; plan status: **Implemented (T1–T8 code/docs)** — human visual QA (375/1280) still open in plan Appendix B.

| Task | Outcome |
|------|---------|
| T1 | `tokens.css` nm-zwds roles + `brand-gradient.css` utilities; imported from `global.css` / `ghl-runtime.css` |
| T2 | Appendix B Brand theme QA checklist in the plan |
| T3 | `blog-page.css` consumes `--cae-*`; restrained gradient eyebrow accent |
| T4 | Native `home/*.css` + live `HomeInsights` token sweep (GHL home still primary) |
| T5+T6 | GHL remaps + Connect CTA gradient + footer/logo-bar hairlines + Connect heading clip-text |
| T7 | Admin cream/navy/purple light + night/gold dark; coral danger |
| T8 | CONTEXT/README + wiki one-liner; typecheck/build green noted |

**Brand gradient stops:** `#080657` → `#3D0F68` → `#8B1167` → `#D91744` → `#FE8E01`

**Residuals:** GHL capture CSS may still contain literal legacy hex; runtime remaps via `--cae-*` where patched. Full parity waits on native home rewrite.

### Public Light/Dark topbar toggle (follow-up)

| Piece | Role |
|-------|------|
| `lib/public-theme.ts` | Persist `cae-public-theme` (separate from Admin `cae-admin-theme`); default **dark** |
| `PublicThemeBoot.astro` | Inline FOUC script in Home / Media / Blog layouts |
| `PublicThemeToggle.astro` | Mounts Light/Dark buttons into GHL desktop + mobile nav lists |
| `tokens.css` | `html[data-theme="light"]` / `dark` semantic overrides |
| `host-patch.css` | Nav link/hamburger colors track `--cae-text` |

Wired from `Nav.astro` + `MediaNav.astro` (covers home, media, blog chrome).

### Logo / home CTA URL fix

| Before | After |
|--------|--------|
| `https://caegoh.com/home-page-4444` on home logo + Connect CTAs | `__GHL_INTERNAL_HOME__` → `import.meta.env.BASE_URL` (e.g. `/cae/`) |
| `aria-label` was the raw funnel URL | `aria-label="CAE home"` |

`remapHtml.ts` also keeps a regex fallback for the old funnel URL if it reappears in fragments. Instagram/Facebook `caegoh` social URLs intentionally unchanged.

---

## Verification

- `pnpm --filter @seo/cae typecheck` — pass (theme toggle work)
- `pnpm --filter @seo/cae build` — pass (theme toggle work)
- Earlier T1–T8 waves also reported typecheck/build green

---

## Open / human next

- [ ] Plan Appendix B visual smoke at 375px + 1280px (home, media, blog, slug, Admin light+dark)
- [ ] Brand-test: first viewport without nav still reads as CAE / Purple Star
- [ ] Accept GHL light-mode residuals until native `HomePage` cutover
- [ ] Commit/push theme-toggle + logo fix on `cae` if not yet committed

---

## Source of truth for agents

- Hex / roles: `docs/references/nm-zwds-design-theme-color-scheme.md`
- Implementation checklist / residuals: `docs/implementation-plan/cae-nm-zwds-brand-theme-alignment.md`
- Domain + Brand theme pointer: `apps/cae/CONTEXT.md`
- **Do not** reintroduce `#9461A3` / `#100022` as new brand sources — change `tokens.css` / `admin-theme.css`; patch GHL via host-patch.
