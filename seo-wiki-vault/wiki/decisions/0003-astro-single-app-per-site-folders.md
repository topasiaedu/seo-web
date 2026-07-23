# ADR 0003 — One Astro app per brand + path gateway

## Status

**Accepted** (supersedes the 2026-07-22 “single Astro app with per-site folders” decision for brand ownership)

## Context

Brand sites originally lived as folders under one Astro package (`website/<slug>/`) with a site-pages integration. That kept a single deploy unit but coupled brands. CAE needed an independent preview app with its own Astro `base` and port, fronted by a local path gateway.

## Decision

1. **One Astro app per brand** under `apps/<slug>` (package `@seo/<slug>`), each with its own `base: "/<slug>/"` and dev port.
2. **Path gateway** (`apps/gateway` / `@seo/gateway`) listens on **4321** and proxies brand prefixes to upstreams (e.g. `/cae` → `127.0.0.1:4322`).
3. **CAE migrated:** source of truth is `apps/cae` — marketing pages use a **GHL section lift** (`HomePage` + `components/ghl/*` + sanitized `styles/ghl/*`), not a Vite-imported vault dump and not `website/cae/`. Parked native BEM (`components/home/*`) is unwired.
4. **CMS and Dr Jasmine deferred** as independent apps under `apps/` when unblocked; see [independent-apps-dr-jasmine-and-cms.md](../../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).
5. **Legacy `website/` shell removed** — no shared Astro registry / site-pages integration for brands.

## Previous decision (historical)

One Astro package at `website/` with top-level site folders, mounted by `sitePagesIntegration()`. That package no longer exists.

## Consequences

- Local preview: `pnpm dev` runs gateway + CAE; open `/cae` on the gateway host.
- Production `vercel.json` builds `@seo/cae` → `apps/cae/dist`.
- Future brands scaffold under `apps/<slug>` only.
