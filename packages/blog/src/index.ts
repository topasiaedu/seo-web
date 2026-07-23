/**
 * @fileoverview Blog domain types and future query helpers shared by all sites.
 */

/**
 * Allowed publication states for a post row.
 */
export type PostStatus = "draft" | "published" | "archived";

/**
 * Public-facing post shape returned to Astro pages.
 */
export type BlogPost = {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyMd: string;
  status: PostStatus;
  publishedAt: string | null;
};

/**
 * Placeholder so `@seo/blog` resolves before list/get helpers are implemented.
 */
export const blogPackageName = "@seo/blog" as const;
