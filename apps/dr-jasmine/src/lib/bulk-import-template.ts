/**
 * @fileoverview Annotated bulk-import document template for writers and LLMs.
 *
 * Copy this entire string into ChatGPT, Claude, or another assistant (or hand it
 * to a human writer) so they know the exact shape Dr Jasmine Admin expects. HTML
 * comment blocks and YAML `#` lines are stripped or ignored on import — see
 * {@link prepareBulkImportRawText} in `bulk-import.ts`.
 *
 * Go-live date/time is set in Admin Bulk Import section 4 (Malaysia Time), not
 * in this Markdown file.
 */

import { POST_DIVIDER_LINE } from "./bulk-import";

/**
 * Full writer template: instructions (HTML comments) + two annotated example posts.
 * Safe to paste into an LLM prompt or the Bulk Import textarea.
 */
export const BULK_IMPORT_WRITER_TEMPLATE = `<!--
================================================================================
DR JASMINE BLOG — BULK IMPORT TEMPLATE
================================================================================

HOW THIS FILE WORKS
-------------------
One file can contain MANY blog posts. Each post has two parts:

  1. FRONTMATTER — metadata between --- lines (YAML "key: value" pairs)
  2. BODY — the article in Markdown, written AFTER the closing ---

To start another post, add a line containing ONLY:
  ${POST_DIVIDER_LINE}
then begin the next post with --- frontmatter --- again.

FIELD REFERENCE
---------------
REQUIRED
  title          Post headline (only required field)

OPTIONAL — content
  excerpt        Short summary for blog cards / SEO / post dek
  keyTakeaway    Highlighted takeaway box under the title (promise-first lead)
  (body)         Full article in Markdown below the closing ---

BODY BREATHING PATTERNS (optional Markdown conventions)
  > quote text                 Pull quote (serif emphasis)
  > In clinic: practical tip   Soft “In clinic” callout band
  **1.2 points** — meaning     Key number / stat callout
  1. Step one                  Numbered lists render as step cards
  ## Section                   Each H2 starts a visual section beat

OPTIONAL — organization
  category       Category name (created automatically if it does not exist)
  tags           YAML list, e.g. ["wellness", "beginners"]
  slug           URL slug; omit to auto-generate from title (lowercase, hyphens)

OPTIONAL — images
  heroImageUrl   Optional https:// link if the cover is already hosted
  heroImageAlt   Accessibility description for the hero image
  (upload)       Prefer uploading one cover per post in Admin Bulk Import
                 section 3 after the Markdown is parsed — do not put local
                 filenames in this file.

OPTIONAL — status
  status         draft | published | archived
                 Default is draft when omitted.
                 Do NOT put publish times in this file. Set go-live dates in
                 Admin Bulk Import section 4 (Malaysia Time / UTC+8), after
                 hero images. Section 4 can schedule the whole batch
                 (e.g. every day at 8:00 AM from a chosen start date).

OPTIONAL — FAQ & sources (YAML lists in frontmatter)
  faq            List of { question, answer } objects
  sources        List of { label, url? } objects (url is optional)

IMPORT RULES
------------
• Lines starting with # inside frontmatter are comments — ignored on import.
• This HTML comment block at the top is also ignored on import.
• Duplicate slugs or slugs that already exist on the site are skipped.
• Delete example posts below or replace them with real content.
• Any leftover publishAt / publishedAt fields are ignored on import.

FOR AI ASSISTANTS
-----------------
When filling this template for a human to import:
- Preserve the --- frontmatter --- structure exactly for every post.
- Preserve ${POST_DIVIDER_LINE} between posts (exact spelling, on its own line).
- Do NOT wrap the entire file in a markdown code fence.
- Replace placeholder values with real content; remove unused optional fields.
- Do NOT invent publishAt / publishedAt timestamps — scheduling is done in Admin.
- Default to status: "draft" unless the user asks for published or archived.
- Write article bodies in Markdown (## headings, lists, **bold**, links).
- Keep FAQ answers and excerpts concise and factual.
================================================================================
-->

---
# REQUIRED — post headline shown on the blog
title: "Your Post Title Here"

# OPTIONAL — short blurb for listing cards (recommended)
excerpt: "One or two sentences summarizing what the reader will learn."

# OPTIONAL — custom URL slug; omit to auto-generate from title
# slug: "my-custom-slug"

# OPTIONAL — category name (created if missing)
category: "Wellness"

# OPTIONAL — tag list
tags: ["holistic health", "beginners"]

# OPTIONAL — highlighted box at the bottom of the article
keyTakeaway: "The single most important point readers should remember."

# OPTIONAL — already-hosted cover URL (otherwise upload per post in Admin section 3)
# heroImageUrl: "https://example.com/your-cover.jpg"
# heroImageAlt: "Describe the image for screen readers"

# OPTIONAL — draft | published | archived (go-live times are set in Admin section 4)
status: "draft"

# OPTIONAL — FAQ accordion on the published post
faq:
  - question: "Who is this article for?"
    answer: "Readers new to holistic wellness who want practical guidance."
  - question: "Is this medical advice?"
    answer: "No — content is educational. Consult your healthcare provider for personal care."

# OPTIONAL — sources / further reading (url is optional per item)
sources:
  - label: "Peer-reviewed wellness overview"
    url: "https://example.com/reference"
  - label: "Workshop notes"
---

## First Section Heading

Write the full article body here in **Markdown**.

Use paragraphs, lists, and subheadings as needed. Everything below the closing
\`---\` is stored as the post body — do not put metadata here.

${POST_DIVIDER_LINE}

---
# EXAMPLE — second post in the same file (delete or replace)
title: "Second Post Title"

category: "Wellness"
tags: ["mindfulness"]

status: "draft"
---

## Another Article

Second post body goes here. Add as many posts as you need, each separated by
\`${POST_DIVIDER_LINE}\` on its own line.
`;
