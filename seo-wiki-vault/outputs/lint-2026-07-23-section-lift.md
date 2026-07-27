# Vault lint — 2026-07-23 (post GHL section lift)

## Checks

| Check | Result |
|-------|--------|
| Broken relative links under `wiki/` | **0** |
| Wiki pages missing from `index.md` (excl. index/log) | **0** before fix; ingested 1 missing source |
| Index ghosts (link → missing page) | **0** |
| Uningested `raw/inbox/` prose | **1 found → fixed** (`cae-ghl-1to1-native-parity`) |
| Research dirs without source | **0** (`cae-ghl-capture`, `cae-ghl-capture-media`, `astro-vs-next-vercel`) |

## Ingest coverage (raw → wiki/sources)

| Raw source | Wiki source | Status |
|------------|-------------|--------|
| `raw/research/astro-vs-next-vercel.md` | `astro-vs-next-vercel.md` | OK |
| `raw/inbox/2026-07-23-astro-vs-next-api-and-limits.md` | `astro-vs-next-api-and-limits.md` | OK |
| `raw/inbox/2026-07-23-cae-independent-app-and-native-landing.md` | `cae-independent-app-and-native-landing.md` | OK (visual note points at lift) |
| `raw/inbox/2026-07-23-cae-ghl-1to1-native-parity.md` | `cae-ghl-1to1-native-parity.md` | **Was missing → ingested as superseded** |
| `raw/inbox/2026-07-23-cae-ghl-section-lift-and-media-page.md` | `cae-ghl-section-lift-and-media-page.md` | OK |
| `raw/inbox/2026-07-23-cms-media-library-and-cae-image-alt.md` | `cms-media-library-and-cae-image-alt.md` | OK |
| `raw/research/cae-ghl-capture/` | `cae-ghl-capture.md` | OK |
| `raw/research/cae-ghl-capture-media/` | `cae-ghl-capture-media.md` | OK |

Non-source: `raw/inbox/.gitkeep`, binaries/HTML under capture dirs.

## Stale claims fixed this lint

- `architecture/supabase.md` — seed UUID match path `website/*/config.ts` → `apps/cae/src/site-config.ts`
- `decisions/0001-…` — clarified `website/` deploy wording is historical; current build is `@seo/cae`
- `sources/cae-independent-app-and-native-landing.md` — Vercel `@seo/cae` wiring marked resolved
- `glossary.md` — added **GHL section lift**

## Left as historical (OK)

- `wiki/log.md` older entries describing `ghl-clone` / `@seo/website` — append-only
- Immutable `raw/` files with outdated paths
- Parked `components/home/*` still documented as unwired (matches code)

## ADR vs overview

- **0003** matches overview (apps per brand + gateway; CAE GHL lift).
- **0001** intent (one Vercel project + host routing) still deferred for hosts; no longer claims live `website/` package after this lint.
- **0002** unchanged / aligned with supabase page.

## Code spot-check

- `apps/cae` exists; `website/` absent
- `HomePage.astro` imports `./ghl/*` (not `./home/*`)
- `/media/` route + `MediaLayout` + `styles/ghl/media-page.css` present
- Capture dirs present under `seo-wiki-vault/raw/research/`
- Root scripts: `pnpm dev` = gateway + cae; `vercel.json` → `@seo/cae` / `apps/cae/dist`

## Optional follow-ups (not defects)

- Concept page for “GHL section lift” — glossary term enough for now
- Delete parked native BEM after superior review (tracked in overview Deferred)
