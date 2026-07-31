# Session notes: CAE Connect “CONNECT WITH ME” dark-mode gold

**Date:** 2026-07-30  
**Kind:** Chat / UI contrast fix  
**Branch:** `main`  
**Related:**  
- Prior raw: `raw/inbox/2026-07-28-cae-nm-zwds-brand-theme-and-public-theme-toggle.md` (Connect clip-text via brand gradient)  
- Prior raw: `raw/inbox/2026-07-28-cae-native-zwds-public-redesign.md` (native Connect section)  
- `apps/cae/src/components/home/ConnectCta.astro`  
- `apps/cae/src/styles/home/connect-cta.css`  
- `apps/cae/src/styles/brand-gradient.css` (`.cae-text-brand-gradient`)  
- `apps/cae/src/styles/tokens.css` (`--cae-gold` `#d4b896`)  
**Topic:** Dark-mode readability of the Connect social headline on the purple elevated band.

---

## Symptom

On the native CAE homepage Connect section (Instagram / Facebook), the heading **“CONNECT WITH ME”** was hard to read in **dark mode**:

- Section background: elevated purple (`--cae-bg-elevated` / purple night shell)
- Headline used `.cae-text-brand-gradient` (5-stop indigo → purple → magenta → red → orange clip-text)
- Left/mid gradient stops are dark purple — nearly the same as the section fill → low contrast

Light mode was acceptable (gradient still readable on lighter band).

---

## Fix (shipped)

Commit: **`4d47da1`** on `main` — `fix(cae): use gold Connect headline in dark mode.`

| Change | Detail |
|--------|--------|
| Dark (default) | `.cae-connect__headline` → solid `--cae-gold` (`#d4b896`); no clip-text fill |
| Light | Keep brand-gradient clip-text under `html[data-theme="light"]` |
| Fallback | `@supports not (background-clip: text)` cream/bright text for light only |
| Markup | Dropped `cae-text-brand-gradient` from `ConnectCta.astro` so global utility cannot override section CSS |

Scope: **this headline only** — social icons and other gradient CTAs unchanged.

### Checks

- `pnpm --filter @seo/cae typecheck` — pass  
- `pnpm --filter @seo/cae build` — pass  
- No repo `lint` script (typecheck used as gate)

---

## Why not keep gradient in dark

Brand-gradient clip-text remains the right signature on cream/light surfaces and filled CTAs. On a purple elevated band, purple stops of the same gradient fight the background; gold is already the nm-zwds dark accent role (`--cae-gold` / `--cae-star`).

---

## Affects (for wiki ingest)

- New `wiki/sources/cae-connect-headline-dark-gold.md` (this note)
- `wiki/sites/cae.md` — optional one-liner under native home Connect / theme notes
- Prior source `cae-nm-zwds-brand-theme-and-public-theme-toggle` — Connect clip-text claim now dark-overridden for this heading
- Prior source `cae-native-zwds-public-redesign` — Connect surface still native; headline color policy updated

---

## Open questions

1. None — visual QA on live/preview dark + light after deploy.
2. Optional later: other purple-on-purple clip-text moments (if any) — audit only if contrast complaints recur.
