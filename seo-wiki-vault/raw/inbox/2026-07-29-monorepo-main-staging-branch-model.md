# Session notes: Monorepo main + staging branch model

**Date:** 2026-07-29  
**Kind:** Chat / git workflow + merge  
**Related:** Remote `https://github.com/topasiaedu/seo-web.git`; local `E:\projects\seo-website`  
**Topic:** Stop using separate long-lived `cae` / `dr-jasmine` content branches. Keep both brand apps on one tree (`apps/cae`, `apps/dr-jasmine`) under `main`, with `staging` for pre-prod checks. Day-to-day site work uses feature branches that still contain the full monorepo.

---

## Problem (before)

1. Long-lived **`cae`** and **`dr-jasmine`** branches diverged after common ancestor `11c7311`.
2. Checking out one branch replaced the working tree — CAE-only tip lacked `apps/dr-jasmine`; DJ tip had older CAE (pre–native ZWDS).
3. Goal: one local folder with **both** sites always visible; still able to ship carefully via staging → main.
4. Nested worktrees under `seo-website\cae` were considered and **rejected** (messy nesting; fights existing `apps/<slug>` layout). Sibling worktrees under `E:\projects\` were tried briefly then **reverted**.

---

## Decisions from session

1. **One integration branch: `main`.** Always contains both `apps/cae` and `apps/dr-jasmine` (plus gateway, packages, vault).
2. **`staging`** mirrors pre-prod checks; same full monorepo tree as `main`.
3. **“Push only CAE” ≠ CAE-only tree.** Means: commit/push a branch that **changes** CAE (and shared packages if needed) while DJ files remain present and unchanged. Never recreate a branch that deletes the other brand app.
4. **Intended flow:** `feat/...` (or short-lived site work branch) → merge into **`staging`** for check → **PR `staging` → `main`** when good.
5. **Retire long-lived remote `cae` / `dr-jasmine`** as primary content branches (history preserved in merge graph).
6. **Do not** put Git worktrees inside `seo-website\` as `cae/` / `dr-jasmine/` folders.

---

## What shipped (repo state)

| Item | Value |
|------|--------|
| Merge commit | `307eb6f` — `merge(cae): integrate native ZWDS CAE into main with Dr Jasmine` |
| Path to merge | Fast-forward `main` ← `dr-jasmine`, then merge `cae`; wiki conflicts resolved for both brands |
| `origin/main` | Pushed (`-u`); tracking set |
| `origin/staging` | Created from same tip as `main`; pushed |
| Local `cae` / `dr-jasmine` | Deleted after merge |
| Remote `dr-jasmine` | Deleted |
| Remote `cae` | **Still present** — GitHub default branch was `cae`; delete rejected until default switches to `main` |
| Default branch change | Blocked in-session (`gh` not authenticated). Human must set default to `main` in GitHub Settings, then `git push origin --delete cae` |
| Untracked left alone | `docs/blog/dr-jasmine/` draft posts (not part of this merge) |

### Working tree layout (locked)

```text
seo-website/                 # checkout: main (or staging / feat/*)
  apps/cae/
  apps/dr-jasmine/
  apps/gateway/
  packages/
  ...
```

---

## Workflow (locked going forward)

```text
feat/cae-* or feat/dj-*  →  staging (check)  →  PR → main (ship)
```

| Branch | Role |
|--------|------|
| `main` | Production integration; both apps always present |
| `staging` | Pre-prod / smoke; both apps always present |
| `feat/...` | Day-to-day work; branch from `main` (or `staging`); full monorepo tree |

Deploy note: point Vercel (or other hosts) at **`main`** / **`staging`**, with per-project root `apps/cae` or `apps/dr-jasmine` as needed — not at retired brand-only branches.

---

## Open / next

1. GitHub: set **default branch** to `main`, then delete remote `cae`; `git fetch --prune`.
2. Confirm Vercel (and any other host) no longer deploys from `cae` / `dr-jasmine` tips; retarget `main` or `staging`.
3. Optional: protect `main` / `staging` with required PRs.
4. Authenticate `gh` on this machine if CLI repo settings are needed later.

---

## Provenance

Human asked how to keep both websites on one machine while still pushing per-site work; rejected nested worktrees; chose monorepo-on-`main`. Agent merged branches, pushed `main` + `staging`, deleted local brand branches and remote `dr-jasmine`; remote `cae` delete deferred on default-branch constraint. Human asked for wiki raw + ingest of this change.
