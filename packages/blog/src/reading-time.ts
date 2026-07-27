/**
 * @fileoverview Reading-time estimation from markdown body text.
 */

/** Default words-per-minute used for reading-time estimates. */
const WORDS_PER_MINUTE = 200;

/**
 * Strips common markdown syntax so word counts reflect readable prose.
 *
 * @param bodyMd - Markdown body (`body_md`).
 * @returns Approximate plain text.
 */
function markdownToPlainText(bodyMd: string): string {
  return bodyMd
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~|>]/g, " ")
    .replace(/[-*]{3,}/g, " ")
    .trim();
}

/**
 * Estimates reading time in whole minutes from markdown (~200 wpm).
 *
 * Empty or whitespace-only bodies return `0`. Non-empty bodies return at least `1`.
 *
 * @param bodyMd - Post body markdown.
 * @returns Estimated minutes to read.
 */
export function readingTimeMinutesFromMarkdown(bodyMd: string): number {
  if (typeof bodyMd !== "string") {
    throw new TypeError(
      "@seo/blog readingTimeMinutesFromMarkdown: bodyMd must be a string",
    );
  }

  const plain = markdownToPlainText(bodyMd);
  if (plain.length === 0) {
    return 0;
  }

  const words = plain.split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
