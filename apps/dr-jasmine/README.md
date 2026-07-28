# @seo/dr-jasmine



Independent Astro app for the **Dr Jasmine** brand site (Option A marketing site + blog + Admin).



| Field | Value |

|-------|--------|

| Package | `@seo/dr-jasmine` |

| Slug | `dr-jasmine` |

| Project id | `00000000-0000-4000-8000-000000000002` |

| Astro `base` | `/dr-jasmine/` |

| Dev port | `4323` |

| Domains (config) | `dr-jasmine.localhost`, `doctorjasmine.com` |



## Implementation plans



- [`docs/implementation-plan/dr-jasmine-landing-and-admin.md`](../../docs/implementation-plan/dr-jasmine-landing-and-admin.md) — Admin/blog waves

- [`docs/implementation-plan/dr-jasmine-true-website.md`](../../docs/implementation-plan/dr-jasmine-true-website.md) — Option A public site (T5+)



See [`CONTEXT.md`](./CONTEXT.md) for IA, CTA labels, social links, and `/workshop` vs `registerUrl`.



## Scripts



```bash

pnpm --filter @seo/dr-jasmine dev

pnpm --filter @seo/dr-jasmine build

pnpm --filter @seo/dr-jasmine preview

pnpm --filter @seo/dr-jasmine typecheck

```



Gateway proxies `http://localhost:4321/dr-jasmine` → this app on port 4323.



## Env



Copy `.env.example` to `.env.local` and fill Supabase keys. Brand secrets live **only** under this app (not at the repo root).



## Layout



- `src/pages/` — `/` (native home), `/blog`, `/admin`

- `src/layouts/PublicLayout.astro` — public marketing + blog chrome (nav/footer)

- `src/components/site/` — SiteNav, SiteFooter, RegisterCta

- `src/components/home/`, `faq/` — native sections (Meet Dr. Jasmine + FAQ accordion on home)

- `src/components/ghl/` — **deprecated** GHL lift archive (see `components/ghl/README.md`)

- `src/components/admin/`, `src/components/blog/` — Admin + blog

- `src/data/site/` — shared marketing copy modules

- `src/lib/` — auth, storage, helpers

- `src/scripts/` — site-nav, workshop-countdown, faq-public-accordion

- `src/styles/` — public tokens/fonts; `styles/ghl/` is lift archive CSS only

- `src/assets/ghl/` — localized images (used by native pages)

- `src/site-config.ts` — brand identity (`drJasmineSiteConfig`)



## GHL lift regenerate



See [`scripts/README.md`](./scripts/README.md). Vault capture is immutable under `seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/`.


