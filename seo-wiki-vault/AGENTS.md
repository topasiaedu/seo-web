# AGENTS.md — SEO Wiki Vault schema

This file is the **operational schema** for any LLM agent working in this vault.
Read it at the start of every session that touches project knowledge.

Pattern source: [Karpathy llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (three layers: raw → wiki → schema).

## Three layers

| Layer | Path | Who writes | Rule |
|-------|------|------------|------|
| **Schema** | `AGENTS.md` (this file) | Human + agent (co-evolve) | Defines structure and workflows |
| **Raw** | `raw/` | Human (drop sources) | **Immutable** — agents never edit |
| **Wiki** | `wiki/` | **Agent owns** | Compiled, interlinked knowledge |

Also:

- `scratch/` — human-only notepad; agents never read as authority and never write
- `outputs/` — optional artifacts from query workflows (tables, decks); agent may write

## Directory layout

```text
seo-wiki-vault/
├── AGENTS.md                 # THIS FILE — read first
├── README.md                 # Human-facing vault intro
├── raw/
│   ├── inbox/                # Unsorted intake
│   └── research/             # Immutable research dumps
├── wiki/
│   ├── index.md              # Catalog — update on every write
│   ├── log.md                # Append-only timeline
│   ├── overview.md           # Living synthesis of the whole project
│   ├── glossary.md           # Ubiquitous language
│   ├── architecture/         # Platform design pages
│   ├── sites/                # One page per brand / CMS
│   ├── packages/             # Shared packages
│   ├── decisions/            # ADRs
│   ├── concepts/             # Named ideas / patterns (optional)
│   └── sources/              # One summary page per raw source
├── scratch/                  # Human only
└── outputs/
```

## Session bootstrap

1. Read `AGENTS.md` (this file).
2. Read `wiki/index.md` to locate pages.
3. Read `wiki/overview.md` for current synthesis.
4. For brand-specific work, also read `wiki/sites/<slug>.md`.
5. Repo code entrypoint remains root `CONTEXT.md` → this vault.

## Workflows

### Ingest (new raw source)

1. Human places file under `raw/inbox/` or `raw/research/` (agent does not move originals out of `raw/` in a destructive way; may copy classified files into `raw/research/` with human approval).
2. Read the source fully.
3. Write or update `wiki/sources/<slug>.md` (summary + provenance link to `raw/...`).
4. Update related `wiki/architecture/`, `wiki/sites/`, `wiki/packages/`, `wiki/concepts/` pages.
5. Update `wiki/overview.md` if the synthesis changes.
6. Update `wiki/index.md` (every new/changed page listed).
7. Append to `wiki/log.md`:
   `## [YYYY-MM-DD] ingest | <title>`
8. Flag contradictions as open questions in the source page or overview.

### Code-change sync (monorepo edits)

When schema, routing, packages, or site folders change in the git repo:

1. Update the matching page under `wiki/` (sites / packages / architecture / decisions).
2. Update `wiki/overview.md` if behavior or layout changed.
3. Update `wiki/index.md` if pages were added/renamed.
4. Append `wiki/log.md`: `## [YYYY-MM-DD] sync | <short description>`

### Query

1. Read `wiki/index.md`, then drill into relevant pages.
2. Answer with citations to wiki paths (and raw paths if needed).
3. If the answer is reusable, file it under `wiki/concepts/` or `outputs/` and index + log it.

### Lint

Periodically (or when asked):

- Broken links between wiki pages
- Orphan pages missing from `index.md`
- Stale claims vs current code
- Concepts mentioned but lacking a page
- ADRs that contradict `overview.md`

Append: `## [YYYY-MM-DD] lint | <summary>`

## Hard rules

1. **Never modify `raw/`** content (except human-directed filing from inbox → research).
2. **Never treat `scratch/` as source of truth.**
3. Prefer updating existing pages over creating duplicates.
4. Keep `wiki/index.md` and `wiki/log.md` current on every write session.
5. Do not invent deferred features; record them only under Deferred in `overview.md`.
6. Brand/CMS apps live under `apps/<slug>/` only — keep wiki `wiki/sites/` in sync; do not resurrect a shared `website/` shell.

## Page conventions

- Filenames: `kebab-case.md`
- ADRs: `NNNN-short-title.md` under `wiki/decisions/`
- Link with relative markdown links inside the vault
- One clear purpose per page; put synthesis in `overview.md`, not duplicated essays everywhere
