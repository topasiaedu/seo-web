# Context map



| Context | Home | Notes |

|---------|------|--------|

| Gateway | `apps/gateway/` | Path front door (`:4321`); proxies `/cae` → CAE |

| Site:CAE | `apps/cae/` | Independent Astro app (`@seo/cae`, `base: /cae/`, port 4322); homepage + `/media/` via GHL section lift; domain language in [`apps/cae/CONTEXT.md`](apps/cae/CONTEXT.md) |

| Shared platform | `packages/`, `supabase/` | Shared DB/blog modules + migrations |

| Site:DrJasmine | (not scaffolded) | Independent app **deferred** → `apps/dr-jasmine` when started |

| CMS | (not scaffolded) | Future shared platform **deferred** → `apps/cms`. CAE authoring for now is **Admin** at `/cae/admin` (see `apps/cae/CONTEXT.md`) — not the CMS. |

| Wiki vault | `seo-wiki-vault/` | LLM wiki: `AGENTS.md` + `raw/` + `wiki/` |



CAE is the source of truth under `apps/cae`. Future brands/CMS are scaffolded under `apps/` — see [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md). The legacy `website/` shell has been removed.



Sites share Supabase and `@seo/blog`; they do not import each other’s UI.



Knowledge for agents lives in [seo-wiki-vault/AGENTS.md](seo-wiki-vault/AGENTS.md) and [seo-wiki-vault/wiki/](seo-wiki-vault/wiki/).

