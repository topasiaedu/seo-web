# Session notes: Bulk-import LLM template polish + Admin logout CSRF fix

**Date:** 2026-07-30  
**Kind:** Chat / implementation notes (human-directed vault intake)  
**Apps:** `apps/cae` (`@seo/cae`) + `apps/dr-jasmine` (`@seo/dr-jasmine`)  
**Related:**  
- Prior raw: `raw/inbox/2026-07-27-cae-admin-bulk-import.md`  
- Prior raw: `raw/inbox/2026-07-29-cae-bulk-import-schedule-ui.md`  
- Prior raw: `raw/inbox/2026-07-30-dr-jasmine-bulk-import-schedule-ui.md`  
- Wiki sources: `wiki/sources/cae-admin-bulk-import.md` · `cae-bulk-import-schedule-ui.md` · `dr-jasmine-bulk-import-schedule-ui.md`  
- Commit: `4b50cf4` on `main` (pushed)  
**Code touched (both brands, mirrored):**  
- `apps/*/astro.config.mjs` — `security.allowedDomains` for CSRF / logout  
- `apps/*/src/lib/bulk-import-template.ts` — `buildBulkImportWriterTemplate` + stronger AI rules  
- `apps/*/src/lib/bulk-import.ts` — strip AI chat wrappers before parse  
- `apps/*/src/components/admin/BulkImportForm.tsx` — Download .md; live taxonomy in copy/download  
- `apps/*/src/pages/admin/posts/import.astro` — pass `existingTags` from posts  

**Topic:** Make the Bulk Import writer template usable with ChatGPT/Gemini (plain `.md`, length, live categories/tags), and fix Admin Logout `403 Cross-site POST form submissions are forbidden` behind gateway/Vercel.

---

## Problems

1. **LLM output shape** — Pasting the Bulk Import template into ChatGPT/Gemini still produced chat explanations or pretty-rendered articles, not a pasteable/downloadable plain Markdown document for Admin upload.
2. **Thin posts** — AIs defaulted to ~2–3 minute reads; editorial target is **5–15 minutes**.
3. **Taxonomy drift** — Template used hardcoded example categories/tags; site’s real categories/tags were loaded for import matching but never injected into the copied/downloaded template.
4. **Logout CSRF** — Astro `security.checkOrigin` compared browser `Origin` to the internal request URL. Behind local gateway (`changeOrigin` + `xfwd`, `:4321` → app ports) or Vercel (internal `localhost` host), mismatch → **403** with message `Cross-site POST form submissions are forbidden`. Logout itself (`POST /admin/logout`) was fine; the origin check blocked it first.

---

## Locked decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | AI deliverable | Prefer downloadable `bulk-import-posts.md`; else raw text only; last resort one `text` fence |
| 2 | Reading time | **5–15 minutes** per post (~1,000–3,000 words at site ~200 wpm); aim ~8–10 min by default |
| 3 | Taxonomy in template | Inject **live** category names + distinct tags from posts at Admin page load into the HTML instruction block |
| 4 | New categories/tags | Prefer exact existing names; invent only when nothing fits (Admin still creates missing categories) |
| 5 | AI wrappers on paste | Defensively unwrap outer ``` fences + strip chat preamble before `<!--` / `---` |
| 6 | CSRF fix | Keep `checkOrigin: true`; set `security.allowedDomains` (custom domains, `*.vercel.app` / `**.vercel.app`, localhost, `PUBLIC_SITE_ORIGIN`, `VERCEL_URL`) — do **not** disable the check |
| 7 | Scope | Both CAE and Dr Jasmine in one commit |

---

## What shipped

### Writer / LLM template

- Strong **OUTPUT FORMAT (CRITICAL)** block first in the HTML comment (no greetings; no ```markdown wrap; prefer `.md` download).
- **READING TIME (REQUIRED)** hard rule + field-reference body-length requirement.
- `buildBulkImportWriterTemplate({ categories, tags })` replaces static-only copy for Admin Copy/Download.
- **CURRENT SITE TAXONOMY** block lists live categories and tags; example frontmatter uses live names when available.
- Static `BULK_IMPORT_WRITER_TEMPLATE` remains as empty-taxonomy fallback.

### BulkImportForm UI

- **Download .md** beside **Copy template**.
- Copy/download use the live-built template (categories from `knownCategories`; tags from `existingTags` prop).
- Section 1 copy mentions that the file includes current categories/tags.
- Quick field guide mentions 5–15 minute body length.

### Parser (`prepareBulkImportRawText`)

- Unwrap whole-document Markdown/code fences (end-anchored closer so nested body fences survive).
- Extract fenced document after chat preamble only when fence appears **before** real frontmatter/`<!--`.
- Strip leading chat prose before first `<!--` or `---`.
- Strip dangling trailing ``` after preamble stripping.

### Logout / CSRF

- `astro.config.mjs` `security: { checkOrigin: true, allowedDomains: [...] }` so Astro trusts `X-Forwarded-Host` / `X-Forwarded-Proto` for known hosts.
- CAE defaults include `caegoh.com`, `seo-web-cae.vercel.app`; DJ includes `doctorjasmine.com`, `seo-web-dr-jasmine.vercel.app`; both include vercel.app wildcards + localhost.

### Verification

- `pnpm --filter @seo/cae typecheck` + `build` — pass  
- `pnpm --filter @seo/dr-jasmine typecheck` + `build` — pass  
- Fixed `noUncheckedIndexedAccess` issue on example tag array construction before commit  

---

## Key code paths

| Path | Role |
|------|------|
| `apps/*/src/lib/bulk-import-template.ts` | `buildBulkImportWriterTemplate`; AI + length + taxonomy rules |
| `apps/*/src/lib/bulk-import.ts` | `prepareBulkImportRawText` AI-wrapper stripping |
| `apps/*/src/components/admin/BulkImportForm.tsx` | Copy / Download live template |
| `apps/*/src/pages/admin/posts/import.astro` | `existingTags` from `listPosts` |
| `apps/*/astro.config.mjs` | `security.allowedDomains` |

---

## Affects (for wiki ingest)

- Bulk import UX for both brands (template + parser + form)
- Admin logout behind gateway and Vercel
- Related prior sources on bulk import / schedule UI (template claims updated)

## Does not change

- Section 4 MYT schedule model / cadence math  
- Lazy public `published_at` time-gate / no cron  
- Single PostForm datetime model  
- Dual Vercel project topology / `base: "/"` on Vercel  

## Open / follow-ups

1. Manual smoke: Copy template → confirm taxonomy block lists real categories/tags → Logout on gateway + Vercel preview.  
2. Optional: refresh `existingTags` after a successful import without full page reload.  
3. Wiki vault notes outside this commit still dirty/untracked from earlier sessions (not part of `4b50cf4`).  
