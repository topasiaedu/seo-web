# CAE

Brand site for CAE: public marketing pages, public blog, and an in-app Admin for authoring posts.

## Language

**Admin**:
The authenticated authoring area of this brand app (`/cae/admin`), used to create and manage Posts for CAE only. Access is login-only; accounts are created outside the public UI (e.g. Supabase Auth dashboard).
_Avoid_: CMS (that is a future shared platform, not this surface); open self-signup

**Bulk import**:
Admin flow at `/cae/admin/posts/import` that creates many Posts from one Markdown document (posts separated by `===NEW POST===`, YAML frontmatter + body). Hero images are uploaded per post after parse; frontmatter `status` / `publishAt` are respected (typically scheduled).
_Avoid_: Treating bulk import as a CMS Media Library; overwriting existing slugs (current behavior skips conflicts)

**Admin user**:
A person with credentials who may sign in to Admin. Not the same as Author.
_Avoid_: Author (byline), editor account (unless we later define roles)

**Author**:
The byline person for this brand’s Posts (name, bio, optional photo). Each brand owns its own Author; brands do not share Authors. CAE has one Author profile used on CAE Posts; another brand (e.g. Dr Jasmine) will have a separate Author under that brand.
_Avoid_: Admin user, shared global author, free-text byline with no profile

**Post**:
A blog article belonging to CAE, with draft / published / archived lifecycle and public URL under `/cae/blog`. Status `published` means approved to go live at `published_at`; the public blog shows it only when `published_at <= now()`.
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
A site-scoped label for grouping Posts (breadcrumb and filters). Each brand has its own Categories; brands do not share them. Admins can add or rename Categories for their brand. CAE’s starter set: Zi Wei Dou Shu, Life Strategy, Relationships, Career & Business, Consultations, Academy, Speaking & Media.
_Avoid_: Free-text category on the Post; shared global taxonomy across brands

**Tag**:
Optional free-form or multi-label keywords on a Post for cross-cutting topics. Distinct from Category (one primary Category per Post).

**Slug**:
The URL segment for a Post under `/cae/blog/{slug}`. Chosen while the Post is a draft; locked after the Post is first published.
_Avoid_: Changing published slugs without redirects (not supported in v1)

**Body**:
The main Post content. Edited in Admin with Visual (TipTap) or Markdown mode via a mode pill; stored as markdown (`body_md`) for the public site.
_Avoid_: Treating paste into Visual mode as guaranteed markdown import (use Markdown mode to paste drafts)

**Featured**:
Not in v1. Future pin / homepage surfacing for Posts — see `docs/future-enhancements/featured-posts.md`.

**CMS**:
A future shared authoring platform across brands. Not in scope for CAE Admin.
_Avoid_: Using "CMS" to mean CAE Admin
