# Context map



| Context | Home | Notes |

|---------|------|--------|

| Gateway | `apps/gateway/` | Path front door (`:4321`); proxies `/cae` → CAE, `/dr-jasmine` → DJ; `/cms` not migrated |

| Site:CAE | `apps/cae/` | Independent Astro app (`@seo/cae`, `base: /cae/`, port 4322); homepage + `/media/` via GHL section lift; domain language in [`apps/cae/CONTEXT.md`](apps/cae/CONTEXT.md) |

| Site:DrJasmine | `apps/dr-jasmine/` | Independent Astro app (`@seo/dr-jasmine`, `base: /dr-jasmine/`, port 4323); Option A native marketing + Admin + blog; [`apps/dr-jasmine/CONTEXT.md`](apps/dr-jasmine/CONTEXT.md) |

| Shared platform | `packages/`, `supabase/` | Shared DB/blog modules + migrations |

| CMS | (not scaffolded) | Future shared platform **deferred** → `apps/cms`. Brand authoring is **Admin** at `/cae/admin` and `/dr-jasmine/admin` — not the CMS. |

| Wiki vault | `seo-wiki-vault/` | LLM wiki: `AGENTS.md` + `raw/` + `wiki/` |



CAE and Dr Jasmine are live under `apps/`. CMS remains deferred — see [docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md](docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md). The legacy `website/` shell has been removed.



Sites share Supabase and `@seo/blog`; they do not import each other’s UI.



Knowledge for agents lives in [seo-wiki-vault/AGENTS.md](seo-wiki-vault/AGENTS.md) and [seo-wiki-vault/wiki/](seo-wiki-vault/wiki/).
