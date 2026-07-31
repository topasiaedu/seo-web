# Source: Vercel dual-site hosting + SSR adapter switch

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-30-vercel-dual-site-hosting-and-ssr.md](../../raw/inbox/2026-07-30-vercel-dual-site-hosting-and-ssr.md) |
| Ingested | 2026-07-30 |
| Kind | Session notes (deploy topology + adapter) |
| Related | [routing-vercel](../architecture/routing-vercel.md) · [CAE](../sites/cae.md) · [Dr Jasmine](../sites/dr-jasmine.md) |
| Follow-ons | [vercel-output-directory-off-deploy-success](vercel-output-directory-off-deploy-success.md) · [vercel-base-root-unstyled-ui](vercel-base-root-unstyled-ui.md) |

## Takeaways

- Host **two Vercel projects** from one monorepo (`seo-web-cae` / `seo-web-dr-jasmine`); local gateway stays preview-only.
- Static `dist` publish + `@astrojs/node` standalone caused Success deploys with platform **404 NOT_FOUND** on SSR routes.
- Shipped `@astrojs/vercel` (Astro 5 peer) + per-app `vercel.json` (no `outputDirectory`); Root Directory = `apps/<slug>`; Include-files-outside-root **On**.
- Git author gate: commits from `KWen-22` blocked until author is on the Vercel team (or gate disabled / Redeploy by member).
- Raw still said open `/cae/` after deploy and keep path `base` on Vercel — **superseded** by later Output Directory Off success note and env-conditional `base: "/"` (`538a722`).

## Key facts (still valid)

| Item | Detail |
|------|--------|
| Topology | One GitHub repo → two Vercel projects → two hosts |
| Production branch | `main` (pre-prod `staging`) |
| Install/build | `cd ../.. && pnpm install` / `pnpm --filter @seo/<slug> build` |
| Output Directory | Must be **Off** (empty) so Build Output API (`.vercel/output`) is detected |
| Do not | Mix Root Directory of one brand with build filter of another |

## Related wiki

- [Routing / Vercel](../architecture/routing-vercel.md)
- Follow-up: Output Directory Off → [vercel-output-directory-off-deploy-success](vercel-output-directory-off-deploy-success.md)
- Follow-up: unstyled UI / `base: "/"` → [vercel-base-root-unstyled-ui](vercel-base-root-unstyled-ui.md)

## Open (from raw; partial)

1. Output Directory Off — **closed** by follow-up success note
2. Invite / gate for `KWen-22` — still open
3. Custom domains on each project — still open (apex `/` already matches Vercel `base: "/"`)
