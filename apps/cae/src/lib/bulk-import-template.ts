/**
 * @fileoverview Annotated bulk-import document template for writers and LLMs.
 *
 * Copy this entire string into ChatGPT, Claude, or another assistant (or hand it
 * to a human writer) so they know the exact shape CAE Admin expects. HTML
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
CAE BLOG — BULK IMPORT TEMPLATE
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
  excerpt        Short summary for blog cards / SEO
  keyTakeaway    Highlighted takeaway box at the end of the article
  (body)         Full article in Markdown below the closing ---

OPTIONAL — organization
  category       Category name (created automatically if it does not exist)
  tags           YAML list, e.g. ["astrology", "beginners"]
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
category: "Astrology 101"

# OPTIONAL — tag list
tags: ["zi wei dou shu", "beginners"]

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
    answer: "Beginners who want a practical overview, not daily horoscope fluff."
  - question: "Do I need my birth time?"
    answer: "Yes, for a full chart. This article explains why timing matters."

# OPTIONAL — sources / further reading (url is optional per item)
sources:
  - label: "Classical Zi Wei reference"
    url: "https://example.com/reference"
  - label: "Internal workshop notes"
---

## First Section Heading

Write the full article body here in **Markdown**.

Use paragraphs, lists, and subheadings as needed. Everything below the closing
\`---\` is stored as the post body — do not put metadata here.

${POST_DIVIDER_LINE}

---
# EXAMPLE — second post in the same file (delete or replace)
title: "Second Post Title"

category: "Astrology 101"
tags: ["four transformations"]

status: "draft"
---

## Another Article

Second post body goes here. Add as many posts as you need, each separated by
\`${POST_DIVIDER_LINE}\` on its own line.
`;
