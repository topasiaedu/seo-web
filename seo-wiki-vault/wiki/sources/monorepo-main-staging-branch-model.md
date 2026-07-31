# Source: Monorepo main + staging branch model

| Field | Value |
|-------|--------|
| Status | summarized |
| Raw path | [raw/inbox/2026-07-29-monorepo-main-staging-branch-model.md](../../raw/inbox/2026-07-29-monorepo-main-staging-branch-model.md) |
| Ingested | 2026-07-29 |
| Kind | Session notes (git workflow + merge) |
| Related | [monorepo](../architecture/monorepo.md), [routing-vercel](../architecture/routing-vercel.md), [git-init remote](../../raw/inbox/2026-07-23-git-init-github-remote.md) (bootstrap; branch model superseded) |

## Takeaways

- Long-lived **brand-only content branches** (`cae`, `dr-jasmine`) are retired as the day-to-day model. They hid the other app on checkout and diverged CAE/DJ tips.
- **`main`** is the integration branch: always includes `apps/cae` + `apps/dr-jasmine` (+ gateway/packages).
- **`staging`** is the pre-prod check branch; same full tree as `main`.
- “Push only CAE” means **change CAE files** on a full-monorepo branch — not a tree that omits Dr Jasmine.
- Flow: `feat/...` → **`staging`** (check) → **PR → `main`** (ship).
- Nested worktrees under `seo-website\cae` (etc.) rejected; brief sibling worktree experiment reverted.
- Merge tip: `307eb6f`. `origin/main` and `origin/staging` pushed. Remote `dr-jasmine` deleted; remote `cae` still exists until GitHub default branch is switched to `main`.

## Key facts

| Item | Value |
|------|--------|
| Merge | `main` ← FF `dr-jasmine`, then merge `cae` (native ZWDS) |
| Commit | `307eb6f` |
| Remote | `https://github.com/topasiaedu/seo-web.git` |
| Open | Default branch still `cae` on GitHub → cannot delete `origin/cae` yet |

## Affects

- [architecture/monorepo.md](../architecture/monorepo.md) — branch model section
- [architecture/routing-vercel.md](../architecture/routing-vercel.md) — deploy from `main`/`staging`
- [overview.md](../overview.md) — workflow + open default-branch note
- [glossary.md](../glossary.md) — `main` / `staging` / feature-branch terms
- [architecture/overview.md](../architecture/overview.md) — one-tree note

## Open questions / deferred (from raw)

1. Human: set GitHub default branch to `main`, then delete `origin/cae`
2. Retarget Vercel (and any host) off retired brand branches
3. Optional branch protection on `main` / `staging`
4. `gh auth login` for future CLI repo settings
