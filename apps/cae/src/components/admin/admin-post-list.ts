/**
 * @fileoverview Shared helpers for Admin dashboard and Posts list pages.
 */

import {
  isPostLive,
  isPostScheduled,
  type BlogPost,
  type PostStatus,
} from "@seo/blog";

/**
 * Status filter values accepted on the Posts list query string.
 */
export type PostStatusFilter = "all" | PostStatus | "scheduled";

/**
 * Counts of Posts grouped by lifecycle status.
 */
export type PostStatusCounts = {
  draft: number;
  published: number;
  scheduled: number;
  archived: number;
  total: number;
};

/** How many recent drafts to show on the Admin dashboard. */
export const RECENT_DRAFTS_LIMIT = 8;

/**
 * Type guard for a valid {@link PostStatus} string.
 *
 * @param value - Candidate status from a URL or form.
 * @returns Whether the value is a known Post status.
 */
export function isPostStatus(value: string): value is PostStatus {
  return value === "draft" || value === "published" || value === "archived";
}

/**
 * Parses the Posts list `status` search param into a filter.
 *
 * Missing, empty, or `"all"` → show every status. Unknown values fall back to `"all"`.
 *
 * @param raw - Raw `Astro.url.searchParams.get("status")` value.
 * @returns Normalized filter for the list UI and `listPosts` call.
 */
export function parseStatusFilter(raw: string | null): PostStatusFilter {
  if (raw === null || raw.trim().length === 0) {
    return "all";
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized === "all") {
    return "all";
  }
  if (normalized === "scheduled") {
    return "scheduled";
  }
  if (isPostStatus(normalized)) {
    return normalized;
  }
  return "all";
}

/**
 * Builds `listPosts` options from a UI status filter.
 *
 * @param filter - Parsed status filter (`all` omits the status option).
 * @returns Options object safe to pass to `@seo/blog` `listPosts`.
 */
export function listPostsOptionsForFilter(
  filter: PostStatusFilter,
): { status?: PostStatus } {
  if (filter === "all") {
    return {};
  }
  if (filter === "scheduled" || filter === "published") {
    return { status: "published" };
  }
  return { status: filter };
}

/**
 * Tallies Posts by status for dashboard summary cards.
 *
 * @param posts - Full (or site-scoped) post list from `listPosts`.
 * @returns Per-status counts plus total.
 */
export function countPostsByStatus(
  posts: readonly BlogPost[],
  now: Date = new Date(),
): PostStatusCounts {
  const counts: PostStatusCounts = {
    draft: 0,
    published: 0,
    scheduled: 0,
    archived: 0,
    total: posts.length,
  };

  for (const post of posts) {
    if (post.status === "draft") {
      counts.draft += 1;
    } else if (post.status === "published") {
      if (isPostScheduled(post, now)) {
        counts.scheduled += 1;
      } else if (isPostLive(post, now)) {
        counts.published += 1;
      }
    } else if (post.status === "archived") {
      counts.archived += 1;
    }
  }

  return counts;
}

/**
 * Returns the newest drafts (already ordered by `updated_at` desc from `listPosts`).
 *
 * @param posts - Site posts (any status mix).
 * @param limit - Max drafts to return.
 * @returns Draft posts, newest first, capped at `limit`.
 */
export function recentDrafts(
  posts: readonly BlogPost[],
  limit: number = RECENT_DRAFTS_LIMIT,
): BlogPost[] {
  if (typeof limit !== "number" || !Number.isFinite(limit) || limit < 1) {
    throw new TypeError("recentDrafts: limit must be a positive finite number");
  }
  const drafts = posts.filter((post) => post.status === "draft");
  return drafts.slice(0, Math.floor(limit));
}

/**
 * Formats an ISO timestamp for Admin list display (locale date + short time).
 *
 * @param iso - ISO-8601 string from Supabase (`updated_at`, etc.).
 * @returns Human-readable local datetime, or an em dash when invalid.
 */
export function formatAdminDateTime(iso: string): string {
  if (typeof iso !== "string" || iso.trim().length === 0) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/**
 * Capitalizes a Post status for display.
 *
 * @param status - Lifecycle status.
 * @returns Title-case label.
 */
export function formatPostStatusLabel(status: PostStatus): string {
  if (status === "draft") {
    return "Draft";
  }
  if (status === "published") {
    return "Published";
  }
  return "Archived";
}

/**
 * Admin row badge label — "Scheduled" when approved but not yet live.
 *
 * @param post - Post row from `listPosts`.
 * @param now - Wall clock for scheduled vs live; defaults to `new Date()`.
 * @returns Display label for status pills in list views.
 */
export function formatPostDisplayLabel(
  post: BlogPost,
  now: Date = new Date(),
): string {
  if (isPostScheduled(post, now)) {
    return "Scheduled";
  }
  return formatPostStatusLabel(post.status);
}

/**
 * Filter tab / empty-state label for a Posts list query filter.
 *
 * @param filter - Parsed status filter from the URL.
 * @returns Title-case label for tabs and empty copy.
 */
export function formatPostFilterLabel(filter: PostStatusFilter): string {
  if (filter === "all") {
    return "All";
  }
  if (filter === "scheduled") {
    return "Scheduled";
  }
  return formatPostStatusLabel(filter);
}
