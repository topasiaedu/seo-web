# ADR 0001 — One Vercel project with host routing

## Status

Accepted (intent). **Brand ownership** later moved to one app per brand ([ADR 0003](0003-astro-single-app-per-site-folders.md)); the `website/` deploy unit named below is historical.

## Context

Multiple brand sites need independent folders and domains, but we chose a single Vercel project for simpler ops.

## Decision

1. Prefer **one Vercel project** for ops simplicity (can split later without changing Supabase `site_id`).
2. Map each custom domain via **host-based** middleware rewrite to the matching brand surface.
3. *(Historical wording)* Originally: deploy one Astro app (`website/`) with path prefixes. That package is **gone**; today root `vercel.json` builds **`@seo/cae`** only (`apps/cae/dist`, `base: "/cae/"`). Host routing and multi-app production topology remain **deferred**.

## Consequences

- Single-project intent still holds for now; only CAE is wired in `vercel.json`.
- Host rewrite / gateway-as-edge front door not implemented on Vercel yet — see [routing-vercel](../architecture/routing-vercel.md).
- Can split to multiple Vercel projects later without changing Supabase `site_id` model.
