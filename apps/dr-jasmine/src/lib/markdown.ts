/**
 * @fileoverview Markdown → HTML and H2 table-of-contents helpers for the public blog.
 *
 * Body “breathing” conventions (styled in `blog-page.css`):
 * - Blockquote starting with “In clinic” / “Clinic tip” / “Tip:” → clinic callout
 * - Any other blockquote → pull quote
 * - Paragraph `**short value** — label` (em/en dash or hyphen) → key number / stat
 * - Ordered lists render as numbered step lists via CSS
 */

import { Marked, type Token, type Tokens } from "marked";

/**
 * One table-of-contents entry derived from an H2 heading in Body markdown.
 */
export type TocHeading = {
  /** Stable fragment id (matches the rendered `<h2 id>`). */
  id: string;
  /** Plain-text heading label (markdown inline marks stripped). */
  text: string;
};

/**
 * Result of rendering Body markdown for a public Post page.
 */
export type RenderedMarkdown = {
  /** HTML for the Body (Admin-authored content; no XSS scrubber in v1). */
  html: string;
  /** H2 headings in document order for the auto TOC. */
  toc: TocHeading[];
};

/** Matches clinic / tip callout openers in a blockquote’s plain text. */
const CLINIC_CALLOUT_OPENER =
  /^(?:\*\*)?(?:in clinic|clinic tip|tip)(?:\*\*)?\s*[:—–-]\s*/i;

/**
 * Matches a key-number paragraph: `**value** — label` (value ≤ 24 chars).
 * Group 1 = value, group 2 = label.
 */
const KEY_NUMBER_PARAGRAPH =
  /^\*\*([^*]{1,24})\*\*\s*[—–-]\s+(.+)$/s;

/**
 * Strips common markdown inline markers so TOC labels stay readable.
 *
 * @param raw - Raw heading text from a markdown line or token.
 * @returns Plain text suitable for TOC link labels.
 */
function stripInlineMarkdown(raw: string): string {
  return raw
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds a URL-safe slug from heading text (lowercase, hyphenated).
 *
 * @param text - Plain heading text.
 * @returns Non-empty slug, or `"section"` when nothing usable remains.
 */
export function slugifyHeading(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("slugifyHeading expects a string");
  }
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return slug.length > 0 ? slug : "section";
}

/**
 * Ensures TOC ids stay unique when multiple H2s share the same slug.
 *
 * @param baseId - Preferred id from {@link slugifyHeading}.
 * @param used - Set of ids already assigned (mutated).
 * @returns Unique id.
 */
function uniqueHeadingId(baseId: string, used: Set<string>): string {
  if (!used.has(baseId)) {
    used.add(baseId);
    return baseId;
  }
  let n = 2;
  let candidate = `${baseId}-${n}`;
  while (used.has(candidate)) {
    n += 1;
    candidate = `${baseId}-${n}`;
  }
  used.add(candidate);
  return candidate;
}

/**
 * Type guard for marked heading tokens.
 *
 * @param token - Lexer token.
 * @returns Whether the token is a heading.
 */
function isHeadingToken(token: Token): token is Tokens.Heading {
  return token.type === "heading";
}

/**
 * Walks markdown tokens and collects H2 headings with unique fragment ids.
 *
 * @param tokens - Top-level marked tokens for the document.
 * @param usedIds - Mutable set of assigned ids.
 * @returns TOC entries in document order.
 */
function collectH2Toc(tokens: Token[], usedIds: Set<string>): TocHeading[] {
  const toc: TocHeading[] = [];
  for (const token of tokens) {
    if (!isHeadingToken(token) || token.depth !== 2) {
      continue;
    }
    const text = stripInlineMarkdown(token.text);
    const id = uniqueHeadingId(slugifyHeading(text), usedIds);
    toc.push({ id, text: text.length > 0 ? text : "Section" });
  }
  return toc;
}

/**
 * Escapes a value for safe use inside an HTML double-quoted attribute.
 *
 * @param value - Raw attribute value.
 * @returns Escaped string.
 */
function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Escapes text for safe use as HTML element content.
 *
 * @param value - Raw text.
 * @returns Escaped string.
 */
function escapeHtmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Collects plain text from nested marked tokens (for callout / stat detection).
 *
 * @param tokens - Token list from a block or inline node.
 * @returns Concatenated raw text.
 */
function tokensToPlainText(tokens: Token[] | undefined): string {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return "";
  }
  const parts: string[] = [];
  for (const token of tokens) {
    if (typeof token === "object" && token !== null && "raw" in token) {
      const raw = Reflect.get(token, "raw");
      if (typeof raw === "string" && raw.length > 0) {
        parts.push(raw);
        continue;
      }
    }
    if (typeof token === "object" && token !== null && "text" in token) {
      const text = Reflect.get(token, "text");
      if (typeof text === "string") {
        parts.push(text);
      }
    }
  }
  return parts.join("");
}

/**
 * Strips a clinic/tip opener from the first paragraph of blockquote HTML.
 *
 * @param html - Parsed blockquote inner HTML.
 * @returns HTML with opener removed from the first `<p>`, or original HTML.
 */
function stripClinicOpenerFromHtml(html: string): string {
  const paragraphOpen = html.match(/^(\s*<p[^>]*>)/i);
  if (paragraphOpen === null || typeof paragraphOpen[1] !== "string") {
    return html;
  }
  const afterOpen = html.slice(paragraphOpen[0].length);
  const strippedLead = afterOpen.replace(
    /^(?:<strong>)?(?:In clinic|Clinic tip|Tip)(?:<\/strong>)?\s*[:—–-]\s*/i,
    "",
  );
  if (strippedLead === afterOpen) {
    return html;
  }
  return `${paragraphOpen[1]}${strippedLead}`;
}

/**
 * Renders Post `body_md` to HTML and builds an H2 table of contents.
 *
 * H2 elements receive matching `id` attributes so TOC links scroll correctly.
 * Empty or non-string input yields empty HTML and an empty TOC.
 *
 * @param markdown - Body markdown from Admin (`body_md`).
 * @returns HTML string plus TOC entries.
 */
export function renderMarkdownWithToc(markdown: string): RenderedMarkdown {
  if (typeof markdown !== "string" || markdown.trim().length === 0) {
    return { html: "", toc: [] };
  }

  const usedIds = new Set<string>();
  const probe = new Marked();
  const tokens = probe.lexer(markdown);
  const toc = collectH2Toc(tokens, usedIds);
  const tocIds = toc.map((entry) => entry.id);
  let h2Index = 0;

  const marked = new Marked();
  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading({ tokens: inlineTokens, depth }: Tokens.Heading): string {
        const inner = this.parser.parseInline(inlineTokens);
        if (depth === 2) {
          const id = tocIds[h2Index];
          h2Index += 1;
          if (typeof id === "string" && id.length > 0) {
            return `<h2 id="${escapeHtmlAttr(id)}">${inner}</h2>\n`;
          }
          return `<h2>${inner}</h2>\n`;
        }
        return `<h${String(depth)}>${inner}</h${String(depth)}>\n`;
      },
      link({ href, title, tokens: inlineTokens }: Tokens.Link): string | false {
        const safeHref = typeof href === "string" ? href.trim() : "";
        if (safeHref.length === 0) {
          return this.parser.parseInline(inlineTokens);
        }
        const isExternal = /^https?:\/\//i.test(safeHref);
        if (!isExternal) {
          return false;
        }
        const label = this.parser.parseInline(inlineTokens);
        const titleAttr =
          typeof title === "string" && title.trim().length > 0
            ? ` title="${escapeHtmlAttr(title.trim())}"`
            : "";
        return `<a href="${escapeHtmlAttr(safeHref)}"${titleAttr} rel="noopener noreferrer" target="_blank">${label}</a>`;
      },
      blockquote({ tokens: quoteTokens }: Tokens.Blockquote): string {
        const plain = tokensToPlainText(quoteTokens).trim();
        const inner = this.parser.parse(quoteTokens);
        if (CLINIC_CALLOUT_OPENER.test(plain)) {
          const body = stripClinicOpenerFromHtml(inner);
          return `<aside class="blog-body__callout" aria-label="In clinic"><p class="blog-body__callout-label">In clinic</p>${body}</aside>\n`;
        }
        return `<blockquote class="blog-body__pullquote">${inner}</blockquote>\n`;
      },
      paragraph({ tokens: inlineTokens, text }: Tokens.Paragraph): string {
        const raw =
          typeof text === "string" && text.trim().length > 0
            ? text.trim()
            : tokensToPlainText(inlineTokens).trim();
        const statMatch = KEY_NUMBER_PARAGRAPH.exec(raw);
        if (statMatch !== null) {
          const value = statMatch[1]?.trim() ?? "";
          const label = statMatch[2]?.trim() ?? "";
          if (value.length > 0 && label.length > 0) {
            return `<p class="blog-body__stat"><span class="blog-body__stat-value">${escapeHtmlText(value)}</span><span class="blog-body__stat-label">${escapeHtmlText(label)}</span></p>\n`;
          }
        }
        const inner = this.parser.parseInline(inlineTokens);
        return `<p>${inner}</p>\n`;
      },
    },
  });

  const parsed = marked.parse(markdown, { async: false });
  const html = typeof parsed === "string" ? parsed : "";

  return { html, toc };
}
