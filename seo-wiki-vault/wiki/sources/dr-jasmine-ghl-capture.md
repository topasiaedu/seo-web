# Source: Dr Jasmine GHL capture (register / join)

Summary of immutable vault research for the Dr Jasmine workshop funnel lift.

| Field | Value |
|-------|--------|
| Raw | [`raw/research/dr-jasmine-ghl-capture/`](../../raw/research/dr-jasmine-ghl-capture/) |
| Captured | 2026-07-27 |
| Start URL | https://doctorjasmine.com/register |
| Resolved URL | https://doctorjasmine.com/join-v2-6756 |
| Method | `apps/dr-jasmine/scripts/capture-ghl-page.mjs` (HTTP fetch, follow redirects) |

## What it is

Scrape archive of the live register → join page (HTML, CSS, section ids, asset URLs). **Runtime does not read this folder.** Sanitized lift lives under `apps/dr-jasmine/src/components/ghl/` and `src/styles/ghl/`.

## How the app uses it

1. Lift scripts (`scripts/lift-ghl-sections.mjs`, `sanitize-ghl-css.mjs`, `download-ghl-assets.mjs`) produce fragments + scoped CSS + local images.
2. Landing composition (`HomePage` / `HomeLayout`) mounts sections; remapper substitutes `__GHL_REGISTER_URL__` from `drJasmineSiteConfig.registerUrl`.
3. Public CTAs keep the live GHL funnel (no first-party lead DB in v1).

Site page: [dr-jasmine](../sites/dr-jasmine.md). Capture README: `raw/research/dr-jasmine-ghl-capture/README.md`.
