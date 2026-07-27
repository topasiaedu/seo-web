/**
 * @fileoverview Resolve related Posts from the same category (live only).
 */

import { isPostLive, type BlogPost } from "@seo/blog";

/** Max related cards to show under a Post. */
const DEFAULT_RELATED_LIMIT = 3;

/**
 * Picks other live Posts in the same category as `current`.
 *
 * Sorted by `publishedAt` descending (newest first). Posts without a category
 * yield an empty list. Drafts, archived, and not-yet-live Posts are omitted.
 *
 * @param current - The Post being viewed.
 * @param published - All published Posts for the site (already status-filtered).
 * @param limit - Max number of related Posts to return (default 3).
 * @returns Live same-category Posts, excluding `current`.
 */
export function resolveRelatedPublishedPosts(
  current: BlogPost,
  published: readonly BlogPost[],
  limit: number = DEFAULT_RELATED_LIMIT,
): BlogPost[] {
  if (!Array.isArray(published) || published.length === 0) {
    return [];
  }
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0) {
    return [];
  }

  const categoryId =
    typeof current.categoryId === "string" ? current.categoryId.trim() : "";
  if (categoryId.length === 0) {
    return [];
  }

  const max = Math.floor(limit);
  const related: BlogPost[] = [];

  const candidates = published
    .filter((post) => {
      if (post.id === current.id) {
        return false;
      }
      if (!isPostLive(post)) {
        return false;
      }
      const postCategoryId =
        typeof post.categoryId === "string" ? post.categoryId.trim() : "";
      return postCategoryId === categoryId;
    })
    .slice()
    .sort((a, b) => {
      const aTime =
        a.publishedAt !== null ? new Date(a.publishedAt).getTime() : 0;
      const bTime =
        b.publishedAt !== null ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

  for (const post of candidates) {
    if (related.length >= max) {
      break;
    }
    related.push(post);
  }

  return related;
}
