# Dr Jasmine GHL lift scripts



Pipeline for capturing and lifting the live workshop registration page into `@seo/dr-jasmine`.



**Runtime note (post–Option A):** The public home and marketing pages are **native Astro** — they do **not** mount `components/ghl/*` or import `styles/ghl/*`. These scripts produce **archive/reference** outputs for copy parity and future re-lifts. Immutable vault capture is never overwritten by scripts 2–4.



## Source



| Field | Value |

|-------|--------|

| Start URL | https://doctorjasmine.com/register |

| Resolved URL | https://doctorjasmine.com/join-v2-6756 |

| Vault capture | `seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/` (immutable) |



## Regenerate (from repo root)



```bash

# 1) Capture (refuses to overwrite existing vault dump — use a new dated folder if re-scraping)

node apps/dr-jasmine/scripts/capture-ghl-page.mjs



# 2) Download CDN images → src/assets/ghl/

node apps/dr-jasmine/scripts/download-ghl-assets.mjs



# 3) Split HTML → src/components/ghl/fragments/*.html

node apps/dr-jasmine/scripts/lift-ghl-sections.mjs



# 4) Sanitize CSS → src/styles/ghl/ghl-page.css

node apps/dr-jasmine/scripts/sanitize-ghl-css.mjs

```



Scripts 2–4 are safe to re-run; they overwrite **app** outputs only, never vault `raw/`.



## Script index



| Script | Writes |

|--------|--------|

| `capture-ghl-page.mjs` | Vault `_ghl-extract/*` + capture `README.md` |

| `download-ghl-assets.mjs` | `src/assets/ghl/*` + `manifest.json` |

| `lift-ghl-sections.mjs` | `src/components/ghl/fragments/*` |

| `sanitize-ghl-css.mjs` | `src/styles/ghl/ghl-page.css` |



## Remap tokens



Used by deprecated GHL fragment runtime (`GhlFragment` / `remapHtml.ts`). Native pages use `site-config` and `RegisterCta` instead.



| Token | Resolves to |

|-------|-------------|

| `__GHL_ASSET_danHenryPortrait__` | `src/assets/ghl/dan-henry-portrait.jpg` |

| `__GHL_ASSET_drJasminePortrait__` | `src/assets/ghl/dr-jasmine-portrait.jpg` |

| `__GHL_ASSET_disclaimerBg__` | `src/assets/ghl/disclaimer-bg.jpeg` (also `bg-overrides.css`) |

| `__GHL_REGISTER_URL__` | `https://doctorjasmine.com/register` (via `remapHtml.ts`) |

| `__GHL_INTERNAL_BLOG__` | `{BASE_URL}blog/` (`/dr-jasmine/blog/`) |



See `fragments/SECTIONS_INVENTORY.md` for section ↔ plan inventory mapping.



## Live conversion funnel



| Step | URL / config |

|------|----------------|

| Native conversion page | `/dr-jasmine/workshop/` |

| GHL seat registration | `drJasmineSiteConfig.registerUrl` → `https://doctorjasmine.com/register` |



Primary nav CTA label: **Join free workshop** → `/workshop`. Workshop page handoff: **Secure my seat** → `registerUrl`.


