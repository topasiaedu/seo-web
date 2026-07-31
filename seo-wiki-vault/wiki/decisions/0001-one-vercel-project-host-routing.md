# ADR 0001 — One Vercel project with host routing

## Status

**Superseded for production topology** by dual Vercel projects (`seo-web-cae`, `seo-web-dr-jasmine`) — see [routing-vercel](../architecture/routing-vercel.md) and [vercel-dual-site-hosting-and-ssr](../sources/vercel-dual-site-hosting-and-ssr.md).  
Original “one project + host rewrite” intent remains historical; **host-based** custom-domain cutover / optional edge gateway front door still open.

Brand ownership lives in one Astro app per brand ([ADR 0003](0003-astro-single-app-per-site-folders.md)); the `website/` deploy unit named below is historical.

## Context

Multiple brand sites need independent folders and domains. Early ops preferred a single Vercel project; production later split to one project per brand (same GitHub monorepo).

## Decision (original)

1. Prefer **one Vercel project** for ops simplicity (can split later without changing Supabase `site_id`).
2. Map each custom domain via **host-based** middleware rewrite to the matching brand surface.
3. *(Historical wording)* Originally: deploy one Astro app (`website/`) with path prefixes. That package is **gone**.

## Consequences (current)

- **Done differently:** two Vercel projects, Root Directory `apps/cae` / `apps/dr-jasmine`, `@astrojs/vercel`, Output Directory Off, env-conditional `base: "/"` on Vercel.
- Root `vercel.json` remains a CAE fallback for any project still linked at repo root — not the primary dual-host model.
- Host rewrite / gateway-as-edge front door **not** implemented on Vercel — local `@seo/gateway` is preview-only.
- Supabase `site_id` model unchanged by the project split.
