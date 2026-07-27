# Source: CAE independent app + native landing

| Field | Value |
|-------|--------|
| Raw path | [`raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md`](../../raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md) |
| Ingested | 2026-07-23 |
| Kind | Session notes (implementation) |
| Related site | [CAE](../sites/cae.md) |
| Deferred | [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md) |

## Summary

Session locked **one Astro app per brand** for CAE (`apps/cae`), with a **path gateway** (`apps/gateway`) serving `/cae` on port 4321 → CAE on 4322. Env is per-app. Dr Jasmine and CMS apps wait for superior acceptance of the CAE preview.

**Visual approach (partially superseded):** this session shipped a **native BEM** homepage under `components/home/*`. Later the same day, marketing pages moved to a **GHL section lift** (`components/ghl/*`) — see [cae-ghl-section-lift-and-media-page](cae-ghl-section-lift-and-media-page.md). Multi-app layout and gateway are **still current**.

## Affects

- [sites/cae.md](../sites/cae.md) — source of truth `apps/cae`
- [architecture/monorepo.md](../architecture/monorepo.md) — `apps/*` layout
- [architecture/routing-vercel.md](../architecture/routing-vercel.md) — gateway + deploy gap
- [decisions/0003-astro-single-app-per-site-folders.md](../decisions/0003-astro-single-app-per-site-folders.md) — superseded toward multi-app + gateway
- [sources/cae-ghl-capture.md](cae-ghl-capture.md) — vault archive only; runtime is sanitized lift in-app

## Open questions (from raw)

- ~~When to wire Vercel to build/serve `@seo/cae`~~ — **resolved:** root `vercel.json` builds `@seo/cae` → `apps/cae/dist` (host-based multi-brand routing still deferred; see [routing-vercel](../architecture/routing-vercel.md))
- Whether parked native `components/home/*` get deleted after superior accepts the lift
