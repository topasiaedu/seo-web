# Source: Bulk-import LLM template polish + Admin logout CSRF

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-30-bulk-import-llm-template-and-logout-csrf.md](../../raw/inbox/2026-07-30-bulk-import-llm-template-and-logout-csrf.md) |
| Ingested | 2026-07-30 |
| Kind | Session notes (implementation) |
| Related sites | [CAE](../sites/cae.md) · [Dr Jasmine](../sites/dr-jasmine.md) |
| Related prior | [cae-admin-bulk-import](cae-admin-bulk-import.md) · [cae-bulk-import-schedule-ui](cae-bulk-import-schedule-ui.md) · [dr-jasmine-bulk-import-schedule-ui](dr-jasmine-bulk-import-schedule-ui.md) |
| Ship | Commit `4b50cf4` on `main` (pushed) |

## Takeaways

- Writer template now leads with **AI OUTPUT FORMAT** rules: prefer downloadable `bulk-import-posts.md`, else raw text only; no chat wrapper / no ```markdown of the whole file.
- **Reading time 5–15 minutes** (~1,000–3,000 words at ~200 wpm) is a hard template rule (aim ~8–10 min).
- Copy/Download use `buildBulkImportWriterTemplate({ categories, tags })` with **live** site categories + distinct post tags (`CURRENT SITE TAXONOMY`); prefer exact existing names.
- Admin section 1 adds **Download .md** beside Copy; `import.astro` passes `existingTags`.
- Parser `prepareBulkImportRawText` strips common AI wrappers (outer fences + preamble) so pasted ChatGPT/Gemini output still imports.
- Admin Logout **403 Cross-site POST…** fixed via Astro `security.allowedDomains` (keep `checkOrigin: true`) — trusts forwarded hosts on gateway + Vercel. Both brands.

## Key code paths

| Path | Role |
|------|------|
| `apps/*/src/lib/bulk-import-template.ts` | Live taxonomy + AI/length rules |
| `apps/*/src/lib/bulk-import.ts` | AI-wrapper stripping before parse |
| `apps/*/src/components/admin/BulkImportForm.tsx` | Copy / Download live template |
| `apps/*/src/pages/admin/posts/import.astro` | `existingTags` |
| `apps/*/astro.config.mjs` | `security.allowedDomains` |

## Affects

- [sites/cae.md](../sites/cae.md) — bulk-import template + logout CSRF note
- [sites/dr-jasmine.md](../sites/dr-jasmine.md) — same
- [cae-admin-bulk-import](cae-admin-bulk-import.md) — template is live-built, not copy-only static
- [glossary.md](../glossary.md) — Bulk import term (taxonomy + length + CSRF note)
- [overview.md](../overview.md) — related sources
- [architecture/routing-vercel.md](../architecture/routing-vercel.md) — logout CSRF / allowedDomains on dedicated hosts

## Open questions / deferred

1. Manual smoke: taxonomy block on Copy; Logout on gateway + Vercel preview.  
2. Optional: refresh tags in-template after import without reload.  

## Does not change

- Section 4 MYT cadence / no MD `publishAt`  
- Lazy schedule time-gate / no cron  
- Dual Vercel `base: "/"` model  
