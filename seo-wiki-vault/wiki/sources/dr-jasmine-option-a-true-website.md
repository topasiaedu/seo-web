# Source: Dr Jasmine Option A true website + brand tokens

| Field | Value |
|-------|--------|
| Raw path | [`raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md`](../../raw/inbox/2026-07-27-dr-jasmine-option-a-true-website.md) |
| Ingested | 2026-07-27 |
| Kind | Session notes (product + implementation) |
| Related site | [Dr Jasmine](../sites/dr-jasmine.md) |
| Plans | [dr-jasmine-true-website.md](../../../docs/implementation-plan/dr-jasmine-true-website.md) · [dr-jasmine-landing-and-admin.md](../../../docs/implementation-plan/dr-jasmine-landing-and-admin.md) |

## Summary

Dr Jasmine’s public surface moved from a **GHL registration LDP homepage** to an **Option A Clinical Trust** multi-page site (Home, About, Programs, Workshop, Blog, FAQ) with shared `PublicLayout` chrome. Workshop owns hard conversion → `registerUrl`; Admin/blog domain model unchanged. GHL lift remains archive-only.

The same raw note records a **human-provided brand color sheet** (Forest / Gold / warm ivory / stone text). That palette is the **intended** brand system; shipped `tokens-public.css` still used interim soft-sage / deep-teal defaults at Option A closeout — **reconcile in a follow-up**.

## Affects

- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — IA, Option A design, brand tokens, open token reconciliation
- [overview.md](../overview.md) — DJ as Option A marketing site
- [architecture/monorepo.md](../architecture/monorepo.md) — DJ active (already)
- GHL capture source remains [dr-jasmine-ghl-capture.md](dr-jasmine-ghl-capture.md) for archive provenance

## Open questions

1. Apply Forest/Gold/Ivory token table into `apps/dr-jasmine/src/styles/tokens-public.css` (+ section CSS overrides)?
2. When to delete deprecated `components/ghl/**` / `styles/ghl/**`?
