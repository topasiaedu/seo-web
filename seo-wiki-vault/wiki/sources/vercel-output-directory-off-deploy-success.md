# Source: Vercel Output Directory off → dual-site deploy success

**Raw:** [`raw/inbox/2026-07-30-vercel-output-directory-off-deploy-success.md`](../../raw/inbox/2026-07-30-vercel-output-directory-off-deploy-success.md)  
**Date:** 2026-07-30  
**Kind:** Deploy verification / session notes

## Summary

Both `seo-web-cae` and `seo-web-dr-jasmine` now deploy and serve after the Vercel dashboard **Output Directory override was turned off**. Root Directory, include-files-outside-root, and monorepo install/build commands were already correct; leaving Output Directory = `dist` was the remaining cause of “Success” deploys with platform `404 NOT_FOUND` on all paths (including prerendered `/cae/media/`).

Working entries (after Output Directory Off): SSR HTML on each project host. **Follow-up:** with fixed `base: "/cae/"` (or `/dr-jasmine/`), HTML at `/` linked assets under `/cae/_astro/…` while files lived at `/_astro/…` → unstyled UI. Fixed by env-conditional `base` (`/` on Vercel). See [routing-vercel](../architecture/routing-vercel.md).

## Key facts

| Item | Detail |
|------|--------|
| Fix | Output Directory **Off** (empty) — use `@astrojs/vercel` `.vercel/output` |
| Do not use | Output Directory = `dist` with SSR adapter |
| Adapter | `VERCEL=1` → `@astrojs/vercel`; else `@astrojs/node` |
| Base | `VERCEL=1` → `base: "/"`; local gateway → `/cae/` or `/dr-jasmine/` |
| Docs note | Vercel docs may still show `@astrojs/vercel/serverless`; repo uses unified `@astrojs/vercel` |

## Related wiki

- [Routing / Vercel](../architecture/routing-vercel.md)
- [CAE](../sites/cae.md) · [Dr Jasmine](../sites/dr-jasmine.md)
- Prior: [dual-site hosting + SSR](../../raw/inbox/2026-07-30-vercel-dual-site-hosting-and-ssr.md) (settings discovery; Output Directory left open until this note)

## Open (from raw)

1. Custom domains cutover (`caegoh.com` / `doctorjasmine.com`)
2. Git author access for `KWen-22`
