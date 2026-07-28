# nm-zwds — Design Theme & Color Scheme

Authoritative tokens live in `src/styles/color-scheme.css`.  
Tailwind maps them in `tailwind.config.js`; TypeScript helpers are in `src/styles/colorTokens.ts`.  
Docs: `docs/color-scheme/COLORS.md`, `docs/color-scheme/COLOR_SCHEME.md`.

---

## Design theme

**Mood:** Mystical / premium “Purple Star Astrology” — warm parchment cream, deep indigo night sky, soft purple, gold and coral accents.

| Aspect | Detail |
|--------|--------|
| Typography (UI) | Inter / InterVariable |
| Typography (analysis titles) | Serif (`font-serif`) for card/panel titles |
| Heroes | Bold uppercase, tight tracking |
| Brand signature | 5-stop gradient (indigo → purple → magenta → red → orange) |
| Surfaces | Cream page shell, white elevated cards, soft purple borders |
| Dark mode | Class strategy (`dark` on `<html>`); gold becomes primary interactive accent |
| Atmosphere | Star field background adapts to light/dark |

Prefer semantic Tailwind classes (`bg-theme-surface-card`, `text-theme-fg`, `bg-theme-btn-primary`) so light/dark stay in sync.

---

## Brand gradient

| Stop | Hex |
|------|-----|
| 1 | `#080657` |
| 2 | `#3D0F68` |
| 3 | `#8B1167` |
| 4 | `#D91744` |
| 5 | `#FE8E01` |

**Uses:** Clip-text branding (`brandGradientTextClass` in `src/styles/typographyUi.ts`), filled CTAs, footers (`bg-footer-light` / `bg-gradient-accent-light`).

**Secondary body emphasis:** `#D91744` → `#FE8E01`.

---

## Core palette

| Role | Hex | Typical use |
|------|-----|-------------|
| Navy | `#1A1E3F` | Light-mode primary text |
| Cream | `#F6F0E8` | Light page background / dark-mode text |
| Brand purple | `#6B5B95` | Light CTAs, links, focus rings |
| Purple light | `#9B8FB5` | Soft accents, hover |
| Purple deep | `#4A3F6B` | Hover, strong borders |
| Gold | `#D4B896` | Borders, secondary accent |
| Gold dark | `#D4AF7B` | Dark-mode CTAs |
| Coral | `#C84C5C` | Errors / danger (light) |
| Coral dark | `#D97C6E` | Errors / danger (dark) |
| Chart orange | `#E08B5C` | Charts / data visualization |
| Muted | `#5C5C5C` | Secondary text (light) |
| Muted dark | `#C4C4C4` | Secondary text (dark) |
| Muted subtle light | `#7A6B96` | Subtle/metadata text (light) |
| Muted subtle | `#A89BC4` | Subtle text (palette) / `#B8AED0` on dark |

---

## Surfaces

| Token | Hex | Typical use |
|-------|-----|-------------|
| `surface-cream` | `#F6F0E8` | App shell (light) |
| `surface-warm` | `#F5E8D4` | Subtle fills, success banners |
| `surface-elevated` | `#FFFFFF` | Cards, navbar (light) |
| `surface-dark` | `#2D1B4E` | App shell (dark) |
| `surface-darkSecondary` | `#1A0F2E` | Cards / auth (dark) |
| `surface-darkElevated` | `#3D2860` | Elevated cards on dark shell |

---

## Light vs dark (semantic roles)

| Role | Light mode | Dark mode |
|------|------------|-----------|
| Page background | Cream `#F6F0E8` | Purple night `#2D1B4E` |
| Primary text | Navy `#1A1E3F` | Cream `#F6F0E8` |
| Secondary text | Muted `#5C5C5C` | Muted dark `#C4C4C4` |
| Interactive (buttons, links) | Brand purple → deep on hover | Gold dark → gold on hover |
| Cards | White `#FFFFFF` | `#3D2860` / `#1A0F2E` |
| Borders | Purple ~32% opacity | White ~10% / gold |
| Error / danger | Coral `#C84C5C` | Coral dark `#D97C6E` |
| Primary button text | Cream | Dark secondary `#1A0F2E` |

---

## Tailwind primary scale

| Step | Hex |
|------|-----|
| 50 | `#F3F0F7` |
| 100 | `#E8E4EF` |
| 200 | `#D1C9DF` |
| 300 | `#B5A8C9` |
| 400 | `#9B8FB5` |
| 500 | `#6B5B95` |
| 600 | `#5A4D7D` |
| 700 | `#6B5B95` |
| 800 | `#4A3F6B` |
| 900 | `#1A1E3F` |

---

## Gradient backgrounds (Tailwind)

| Utility | Value |
|---------|--------|
| `bg-footer-light` / `bg-gradient-accent-light` | `#080657` → `#3D0F68` → `#8B1167` → `#D91744` → `#FE8E01` |
| `bg-footer-dark` | `#1A0F2E` → `#E8A989` |
| `bg-gradient-brand-purple` | `#6B5B95` → `#4A3F6B` |

---

## Usage notes

- **Source of truth:** `src/styles/color-scheme.css` (`:root` + `.dark`).
- **Semantic classes:** `theme-*` tokens switch automatically with dark mode.
- **Light panels in dark mode:** `.dark .light-panel` restores light-theme text/border tokens for cream/white panels.
- **Brand gradient text:** Use sparingly (~1–2 targets per viewport); avoid on already-colored hero banners.
- **UI modules:** Prefer `dashboardUi.ts`, `authUi.ts`, `typographyUi.ts` shared class strings over one-off hex.
