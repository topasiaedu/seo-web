/**
 * @fileoverview Live vs scheduled visibility helpers for Posts.
 *
 * Admin UI label "Scheduled" is computed from `status` + `publishedAt` vs wall
 * clock — it is not a stored database status.
 */

import type { PostStatus } from "./types.js";

/**
 * Shape required to decide public visibility / scheduled state.
 */
export type PostVisibilityFields = {
  status: PostStatus;
  publishedAt: string | null;
};

/**
 * True when the Post is visible on the public blog right now.
 *
 * Admin "Scheduled" is computed (status published + future publishedAt), not a
 * DB status value.
 *
 * @param post - Status and go-live timestamp.
 * @param now - Wall clock; defaults to `new Date()`.
 * @returns Whether the post should appear on public surfaces.
 */
export function isPostLive(
  post: PostVisibilityFields,
  now: Date = new Date(),
): boolean {
  return (
    post.status === "published" &&
    post.publishedAt !== null &&
    Date.parse(post.publishedAt) <= now.getTime()
  );
}

/**
 * True when approved (`published`) but not yet past publishedAt.
 *
 * Admin "Scheduled" is computed from this predicate — it is not a database
 * status. Use alongside {@link isPostLive} for Admin filters and counts.
 *
 * @param post - Status and go-live timestamp.
 * @param now - Wall clock; defaults to `new Date()`.
 * @returns Whether the post is approved but still in the future.
 */
export function isPostScheduled(
  post: PostVisibilityFields,
  now: Date = new Date(),
): boolean {
  return (
    post.status === "published" &&
    post.publishedAt !== null &&
    Date.parse(post.publishedAt) > now.getTime()
  );
}
