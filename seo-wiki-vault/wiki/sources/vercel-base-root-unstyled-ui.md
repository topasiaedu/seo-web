# Source: Vercel base `/` — unstyled UI on dedicated brand hosts

**Raw:** [`raw/inbox/2026-07-30-vercel-base-root-unstyled-ui.md`](../../raw/inbox/2026-07-30-vercel-base-root-unstyled-ui.md)  
**Date:** 2026-07-30  
**Kind:** Deploy diagnosis / session notes  
**Commit:** `538a722`

## Summary

After dual-site Vercel SSR was serving HTML, CAE preview looked unstyled with broken images. Root cause: fixed Astro `base: "/cae/"` (and `/dr-jasmine/`) made HTML request `/cae/_astro/*` while `@astrojs/vercel` on a dedicated brand project serves assets at `/_astro/*`. Fix: same `VERCEL=1` flag as the adapter → `base: "/"` on Vercel; keep path prefixes for local gateway only.

## Key facts

| Item | Detail |
|------|--------|
| Symptom | 200 HTML + 404 CSS/images under `/cae/_astro/…` |
| Working assets | `/_astro/…` at host root; inline `data:` SVGs; Google Fonts |
| Broken paths | `/cae/`, `/cae/_astro/…` (404 on dedicated host) |
| Fix | `useVercelAdapter ? "/" : "/cae/"` (DJ: `/dr-jasmine/`) |
| Apps | `apps/cae/astro.config.mjs`, `apps/dr-jasmine/astro.config.mjs` |
| Extra | DJ `buildSitemapCustomPages` default → `import.meta.env.BASE_URL` |
| Preview | Open `https://seo-web-cae.vercel.app/` (not `/cae/`) |

## Related wiki

- [Routing / Vercel](../architecture/routing-vercel.md)
- [CAE](../sites/cae.md) · [Dr Jasmine](../sites/dr-jasmine.md)
- Prior (Output Directory Off only): [vercel-output-directory-off-deploy-success](vercel-output-directory-off-deploy-success.md)

## Open (from raw)

1. Custom domains cutover (`caegoh.com` / `doctorjasmine.com`)
2. Git author access for `KWen-22`
3. Optional redirects from old `/cae/*` / `/dr-jasmine/*` preview bookmarks
