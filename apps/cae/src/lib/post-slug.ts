/**
 * @fileoverview Slug helpers for CAE Admin Post create / edit / bulk-import routes.
 *
 * Slug is editable while a Post is a never-published draft. After first publish
 * (status published/archived, or `published_at` set from a prior publish), the
 * slug is locked in the UI and omitted from update payloads.
 */

import type { BlogPost } from "@seo/blog";

/**
 * Returns whether a Post's slug must stay fixed.
 *
 * @param post - Loaded Admin Post.
 * @returns `true` when the Post has ever been published (or archived).
 */
export function isPostSlugLocked(post: BlogPost): boolean {
  if (post.status === "published" || post.status === "archived") {
    return true;
  }
  return post.publishedAt !== null;
}

/**
 * Converts a title into a URL-safe slug (draft auto-slug helper).
 *
 * Shared by the single-Post create form and the bulk-import parser so both
 * surfaces derive the same slug from the same title.
 *
 * @param title - Post title text.
 * @returns Lowercase hyphenated slug (may be empty for a title with no
 *   alphanumeric characters).
 */
export function slugifyTitle(title: string): string {
  if (typeof title !== "string") {
    throw new TypeError("slugifyTitle: title must be a string");
  }

  return title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Slug format enforced across single and bulk Post creation. */
export const SLUG_FORMAT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
