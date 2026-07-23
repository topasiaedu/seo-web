# `@seo/gateway`

Local path-based HTTP gateway for the SEO website monorepo. Browse brand apps on one host/port while each Astro app runs on its own upstream port.

## Ports

| Role | Port | Notes |
|------|------|--------|
| Gateway listen | **4321** (or `PORT`) | Bind `0.0.0.0`; open `http://127.0.0.1:4321` |
| CAE upstream | **4322** | `@seo/cae` Astro `server.port` |

Copy `.env.example` to `.env` only if you need a non-default listen port.

## Proxy map

| Path | Target | Status |
|------|--------|--------|
| `/cae`, `/cae/*` | `http://127.0.0.1:4322` | Active |
| `/dr-jasmine`, `/cms` | — | **404 — not migrated yet** |

If CAE is not running, `/cae` returns **502** with a short plain-text hint (expected during early setup).

Dr Jasmine and CMS independent apps are **deferred**. Do not scaffold them here — see [independent-apps-dr-jasmine-and-cms.md](../../docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md).

## How to run

From the repo root (after `pnpm install`):

```bash
# Preferred — gateway (:4321) + CAE (:4322) together
pnpm dev

# Or separately:
pnpm dev:gateway
pnpm dev:cae
```

Then open `http://127.0.0.1:4321/cae`.

WebSocket upgrades under `/cae` are forwarded so Astro/Vite HMR works through the gateway.
