# ADR 0001 — One Vercel project with host routing

## Status

Accepted

## Context

Multiple brand sites need independent folders and domains, but we chose a single Vercel project for simpler ops.

## Decision

Deploy one Astro app (`website/`). Map each custom domain via middleware rewrite to `/{siteSlug}/*`.

## Consequences

- One build output; site folders are modules, not separate Vercel projects.
- Can split to multiple Vercel projects later without changing Supabase `site_id` model.
