# ADR 0002 — Supabase multi-site blog

## Status

Accepted

## Context

All brands need a shared blog platform with one authoring UI.

## Decision

CMS writes posts into shared Supabase tables keyed by `site_id`. Public sites read published posts filtered by their project id via `@seo/blog`.

## Consequences

- One content database; RLS enforces public vs editor access.
- Slugs are unique per site, not globally.
