# Dr Jasmine

Brand site for Dr Jasmine: public marketing site (GHL-sourced home copy), public blog, and an in-app Admin for authoring posts.

## Public site

The live site is a **native Astro marketing site**. Home page visible copy is taken from the GHL registration LDP. GHL HTML fragments under `src/components/ghl/` are **archive/reference only**.

### Information architecture

| Route (under `/dr-jasmine/`) | Purpose |
|------------------------------|---------|
| `/` | Brand home (GHL LDP copy) + Meet Dr. Jasmine + FAQ accordion; CTAs to GHL register |
| `/blog` | Public blog index + post detail |
| `/admin` | Login-only authoring (hidden from public nav) |

### Conversion funnel: `registerUrl`

All workshop CTAs (`RegisterCta`, including “Join free workshop” and “Secure My Seat”) open the live GHL seat-registration funnel:

`drJasmineSiteConfig.registerUrl` → `https://doctorjasmine.com/register` (redirects to the GHL join page).

There is **no** native `/workshop` page. Do not invent alternate funnel URLs without updating this note and `site-config.ts`.

### CTA labels

| Surface | Label | Target |
|---------|-------|--------|
| Nav (default) | **Join free workshop** | `registerUrl` |
| Home (GHL wording) | **Secure My Seat** | `registerUrl` |

No phone or email in public chrome (v1).



### Social links



Configured on `drJasmineSiteConfig.social`:



| Network | URL |

|---------|-----|

| Instagram | https://www.instagram.com/drjasminechiew/ |

| LinkedIn | https://www.linkedin.com/in/jasmine-chiew-glider2626?originalSubdomain=my |



### Dan Henry

Not shown on the native public site. The GHL registration LDP may still include a Dan Henry block; portrait asset remains under `src/assets/ghl/` for archive/remap use.



### GHL capture archive



Immutable vault capture: `seo-wiki-vault/raw/research/dr-jasmine-ghl-capture/`. Regenerate app-side lift outputs via `scripts/README.md`. Do not delete or overwrite vault `raw/` without a new dated capture folder.



Portrait and background assets under `src/assets/ghl/` remain in use by native pages; the folder name is historical.



---



## Config notes



**registerUrl**:

Live GHL register / join funnel for workshop handoff CTAs. Remapper in deprecated `components/ghl/remapHtml.ts` substituted `__GHL_REGISTER_URL__` when GHL fragments were mounted; native pages use `RegisterCta` + `site-config` instead.



## Language



**Admin**:

The authenticated authoring area of this brand app (`/dr-jasmine/admin`), used to create and manage Posts for Dr Jasmine only. Access is login-only; accounts are created outside the public UI (e.g. Supabase Auth dashboard).

_Avoid_: CMS (that is a future shared platform, not this surface); open self-signup



**Bulk import**:

Admin flow at `/dr-jasmine/admin/posts/import` that creates many Posts from one Markdown document (posts separated by `===NEW POST===`, YAML frontmatter + body). Hero images are uploaded per post after parse; frontmatter `status` / `publishAt` are respected (typically scheduled).

_Avoid_: Treating bulk import as a CMS Media Library; overwriting existing slugs (current behavior skips conflicts)



**Admin user**:

A person with credentials who may sign in to Admin. Not the same as Author.

_Avoid_: Author (byline), editor account (unless we later define roles)



**Author**:

The byline person for this brand’s Posts (name, bio, optional photo). Each brand owns its own Author; brands do not share Authors. Dr Jasmine has one Author profile used on Dr Jasmine Posts; another brand (e.g. CAE) has a separate Author under that brand.

_Avoid_: Admin user, shared global author, free-text byline with no profile



**Post**:

A blog article belonging to Dr Jasmine, with draft / published / archived lifecycle and public URL under `/dr-jasmine/blog`. Status `published` means approved to go live at `published_at`; the public blog shows it only when `published_at <= now()`.

_Avoid_: Article, page, content entry (unless quoting an external sample); treating Admin "Scheduled" as a database status



**Draft**:

A Post not shown on the public blog. Returning a published Post here is unpublish.



**Published**:

A Post approved to go live. Visible on the public blog when `status = published` and `published_at <= now()`.



**Scheduled**:

Admin label only for a Post with `status = published` and a future `published_at`. Not a database status; public queries use a lazy time-gate (no cron/worker).



**Archived**:

A Post hidden from the public blog but kept in Admin (not the same as delete).



**Delete**:

Permanently remove a Post from Admin and the database (confirm required). Distinct from Archive.

_Avoid_: Soft delete / trash (not in v1)



**Reading time**:

Estimated minutes to read a Post. Computed from body word count by default; an Admin may override the stored value.

_Avoid_: Purely decorative fixed number with no link to body length



**Category**:

A site-scoped label for grouping Posts (breadcrumb and filters). Each brand has its own Categories; brands do not share them. Admins can add or rename Categories for their brand. Dr Jasmine’s starter set: Diabetes Reversal, Blood Sugar, Metabolic Health, Nutrition & Lifestyle, Patient Stories, Workshops & Webinars.

_Avoid_: Free-text category on the Post; shared global taxonomy across brands



**Tag**:

Optional free-form or multi-label keywords on a Post for cross-cutting topics. Distinct from Category (one primary Category per Post).



**Slug**:

The URL segment for a Post under `/dr-jasmine/blog/{slug}`. Chosen while the Post is a draft; locked after the Post is first published.

_Avoid_: Changing published slugs without redirects (not supported in v1)



**Body**:

The main Post content. Edited in Admin with Visual (TipTap) or Markdown mode via a mode pill; stored as markdown (`body_md`) for the public site.

_Avoid_: Treating paste into Visual mode as guaranteed markdown import (use Markdown mode to paste drafts)



**Featured**:

Not in v1. Future pin / homepage surfacing for Posts — see `docs/future-enhancements/featured-posts.md`.



**CMS**:

A future shared authoring platform across brands. Not in scope for Dr Jasmine Admin.

_Avoid_: Using "CMS" to mean Dr Jasmine Admin


