/**
 * @fileoverview Annotated bulk-import document template for writers and LLMs.
 *
 * Copy/download builds a fresh string via {@link buildBulkImportWriterTemplate}
 * so the HTML instruction block includes the site's current categories and tags.
 * HTML comment blocks and YAML `#` lines are stripped or ignored on import — see
 * {@link prepareBulkImportRawText} in `bulk-import.ts`.
 *
 * Go-live date/time is set in Admin Bulk Import section 4 (Malaysia Time), not
 * in this Markdown file.
 */

import { POST_DIVIDER_LINE } from "./bulk-import";

/** Inputs for a live writer/LLM bulk-import template. */
export type BulkImportWriterTemplateOptions = {
  /** Category names currently on this site (exact spelling). */
  categories: readonly string[];
  /** Distinct tags already used on posts for this site. */
  tags: readonly string[];
};

/**
 * Formats a YAML double-quoted string (safe for names with spaces / punctuation).
 *
 * @param value - Raw string value.
 * @returns YAML/JSON-style quoted string.
 */
function formatYamlQuotedString(value: string): string {
  return JSON.stringify(value);
}

/**
 * Formats a YAML inline string list for frontmatter `tags`.
 *
 * @param values - Tag strings.
 * @returns e.g. `["a", "b"]`.
 */
function formatYamlStringList(values: readonly string[]): string {
  return `[${values.map((entry) => formatYamlQuotedString(entry)).join(", ")}]`;
}

/**
 * Builds the live taxonomy block injected into the HTML instruction comment.
 *
 * @param categories - Existing category names.
 * @param tags - Existing tag strings.
 * @returns Multi-line instruction text (no surrounding HTML comment).
 */
function formatTaxonomyBlock(
  categories: readonly string[],
  tags: readonly string[],
): string {
  const categoryLines =
    categories.length === 0
      ? "  (none yet — invent a sensible category name; Admin creates it on import)"
      : categories.map((name) => `  - ${name}`).join("\n");

  const tagLines =
    tags.length === 0
      ? "  (none yet — prefer short reusable tags; new tags are fine)"
      : tags.map((tag) => `  - ${tag}`).join("\n");

  return `CURRENT SITE TAXONOMY (live from Admin — prefer these)
--------------------------------------------
Prefer an EXISTING category name below when it fits (exact spelling).
Only invent a new category when none fit; Admin will create it on import.

Prefer EXISTING tags below when they fit (exact spelling). New tags are OK
when needed, but reuse existing ones to keep the taxonomy tidy.

Categories (${String(categories.length)}):
${categoryLines}

Tags already used on posts (${String(tags.length)}):
${tagLines}`;
}

/**
 * Builds the annotated writer template, including live category/tag lists.
 *
 * @param options - Current site taxonomy (from Admin Bulk Import page load).
 * @returns Full template string safe to paste into an LLM or download as `.md`.
 */
export function buildBulkImportWriterTemplate(
  options: BulkImportWriterTemplateOptions,
): string {
  if (typeof options !== "object" || options === null) {
    throw new TypeError("buildBulkImportWriterTemplate: options must be an object");
  }
  if (!Array.isArray(options.categories)) {
    throw new TypeError("buildBulkImportWriterTemplate: categories must be an array");
  }
  if (!Array.isArray(options.tags)) {
    throw new TypeError("buildBulkImportWriterTemplate: tags must be an array");
  }

  const categories = options.categories
    .map((name) => (typeof name === "string" ? name.trim() : ""))
    .filter((name) => name.length > 0);
  const tags = options.tags
    .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
    .filter((tag) => tag.length > 0);

  const exampleCategory =
    categories[0] !== undefined ? categories[0] : "Wellness";

  const firstTag = tags[0];
  const secondTag = tags[1];
  const thirdTag = tags[2];

  const exampleTags: string[] =
    firstTag !== undefined && secondTag !== undefined
      ? [firstTag, secondTag]
      : firstTag !== undefined
        ? [firstTag, "beginners"]
        : ["holistic health", "beginners"];

  const secondExampleTags: string[] =
    thirdTag !== undefined
      ? [thirdTag]
      : firstTag !== undefined
        ? [firstTag]
        : ["mindfulness"];

  const taxonomyBlock = formatTaxonomyBlock(categories, tags);

  return `<!--
================================================================================
DR JASMINE BLOG — BULK IMPORT TEMPLATE
================================================================================

FOR AI ASSISTANTS — OUTPUT FORMAT (CRITICAL)
--------------------------------------------
Your job is to produce a plain .md file the human can upload (or paste) into
Admin → Bulk import. Chat explanations are NOT useful.

Preferred delivery (use the best option your chat UI supports):
  1. BEST — Attach / offer a downloadable file named:
       bulk-import-posts.md
     (ChatGPT: canvas or file download; Gemini: .md download / export)
  2. GOOD — Reply with ONLY the raw document text (no chat wrapper at all)
  3. LAST RESORT — One plain copyable block. If the UI forces a fence, use a
     single \`\`\`text fence containing ONLY the document. Tell the human once
     to copy the inside contents into Admin, or save as .md and upload.

Hard rules (non-negotiable):
  - Do NOT greet, summarize, or explain before or after the document.
  - Do NOT wrap the whole document in \`\`\`markdown / \`\`\`md fences.
  - Do NOT "pretty-print" or render the article as a chat reply — output the
    literal YAML frontmatter + Markdown SOURCE the importer expects.
  - First non-empty line must be "<!--" (this instruction block) OR "---".
  - Last line must be body content from the last post — never a follow-up question.
  - Preserve --- frontmatter --- exactly for every post.
  - Preserve ${POST_DIVIDER_LINE} between posts (exact spelling, own line).
  - Replace placeholders with real content; remove unused optional fields.
  - Do NOT invent publishAt / publishedAt — scheduling is done in Admin.
  - Default status: "draft" unless the user asks for published or archived.
  - Write bodies in Markdown (## headings, lists, **bold**, links).
  - Keep FAQ answers and excerpts concise and factual.
  - READING TIME (REQUIRED): each post body must be a 5–15 minute read.
    Target ~1,000–3,000 words per post (site uses ~200 words/minute).
    Do NOT ship thin 2–3 minute posts. Prefer depth: multiple H2 sections,
    explanations, examples, practical steps, FAQ (3–5 items), and sources.
    Aim near the middle (~8–10 minutes / ~1,600–2,000 words) unless the user
    asks for shorter or longer within the 5–15 range.
  - TAXONOMY: prefer category and tag names from CURRENT SITE TAXONOMY below
    (exact spelling). Invent new ones only when nothing suitable exists.

${taxonomyBlock}

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
  (body length)  Each article body must read in about 5–15 minutes
                 (~1,000–3,000 words at ~200 wpm). Short blurbs are rejected
                 by editorial standards — expand with real sections, not filler.

OPTIONAL — content
  excerpt        Short summary for blog cards / SEO / post dek
  keyTakeaway    Highlighted takeaway box under the title (promise-first lead)
  (body)         Full article in Markdown below the closing ---
                 Structure for depth: intro → several ## sections →
                 examples / steps → key takeaway → FAQ → sources.

BODY BREATHING PATTERNS (optional Markdown conventions)
  > quote text                 Pull quote (serif emphasis)
  > In clinic: practical tip   Soft “In clinic” callout band
  **1.2 points** — meaning     Key number / stat callout
  1. Step one                  Numbered lists render as step cards
  ## Section                   Each H2 starts a visual section beat

OPTIONAL — organization
  category       Category name (prefer CURRENT SITE TAXONOMY; created if new)
  tags           YAML list (prefer existing tags; new tags are OK)
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
================================================================================
-->

---
# REQUIRED — post headline shown on the blog
title: "Your Post Title Here"

# OPTIONAL — short blurb for listing cards (recommended)
excerpt: "One or two sentences summarizing what the reader will learn."

# OPTIONAL — custom URL slug; omit to auto-generate from title
# slug: "my-custom-slug"

# OPTIONAL — category name (prefer CURRENT SITE TAXONOMY; created if missing)
category: ${formatYamlQuotedString(exampleCategory)}

# OPTIONAL — tag list (prefer existing tags from CURRENT SITE TAXONOMY)
tags: ${formatYamlStringList(exampleTags)}

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

Target length: a **5–15 minute** read (~1,000–3,000 words). Use several
\`##\` sections with real explanation, examples, and practical steps — not a
thin 2–3 minute summary.

Use paragraphs, lists, and subheadings as needed. Everything below the closing
\`---\` is stored as the post body — do not put metadata here.

${POST_DIVIDER_LINE}

---
# EXAMPLE — second post in the same file (delete or replace)
title: "Second Post Title"

category: ${formatYamlQuotedString(exampleCategory)}
tags: ${formatYamlStringList(secondExampleTags)}

status: "draft"
---

## Another Article

Second post body goes here. Add as many posts as you need, each separated by
\`${POST_DIVIDER_LINE}\` on its own line.
`;
}

/**
 * Static fallback template (empty taxonomy). Prefer
 * {@link buildBulkImportWriterTemplate} with live Admin data when copying.
 */
export const BULK_IMPORT_WRITER_TEMPLATE = buildBulkImportWriterTemplate({
  categories: [],
  tags: [],
});
