/**
 * @fileoverview JSON-LD helpers for CAE public blog index and Post pages.
 *
 * Pure builders return {@link JsonLdNode} trees for `SeoHead`’s `jsonLd` prop.
 * Pages wire these in B5 (index) and B6 (post detail) — do not call from layouts yet.
 *
 * @example B5 — blog index
 * ```ts
 * import { buildBlogIndexJsonLd } from "@/data/blog/jsonld";
 *
 * const jsonLd = buildBlogIndexJsonLd({
 *   pathname: Astro.url.pathname,
 *   name: "Insights",
 *   description: "Articles on Zi Wei Dou Shu and life strategy from Cae Goh.",
 *   siteName: "Cae Goh",
 *   ogImageUrl: resolvedOgImageAbsoluteUrl,
 *   posts: posts.map((p) => ({
 *     slug: p.slug,
 *     title: p.title,
 *     datePublished: p.publishedAt,
 *   })),
 * });
 * ```
 *
 * @example B6 — Post detail
 * ```ts
 * import { buildBlogPostJsonLd } from "@/data/blog/jsonld";
 *
 * const jsonLd = buildBlogPostJsonLd(post, {
 *   pathname: Astro.url.pathname,
 *   siteName: "Cae Goh",
 *   ogImageUrl: absoluteHeroOrOgUrl,
 *   headline: resolvePostSeoTitle(post.seoTitle, post.title),
 *   description: resolvePostSeoDescription(
 *     post.seoDescription,
 *     post.excerpt,
 *     post.title,
 *   ),
 * });
 * ```
 */

import type { BlogPost, FaqItem } from "@seo/blog";
import type { JsonLdNode } from "@/data/home/jsonld";
import {
  getSiteOrigin,
  normalizeBase,
  toAbsoluteUrl,
  toCanonicalUrl,
} from "@/lib/site-url";

/** Re-export so B5/B6 can type `jsonLd` without importing from home. */
export type { JsonLdNode };

/** Default brand name used in `WebSite` / `Organization` nodes. */
const DEFAULT_SITE_NAME = "Cae Goh";

/** Default byline when a Post has no joined Author. */
const DEFAULT_AUTHOR_NAME = "Cae Goh";

/**
 * One list entry for the index `Blog.blogPost` graph (optional on the index builder).
 */
export type BlogIndexListItem = {
  /** Post URL slug under `/blog/{slug}`. */
  slug: string;
  /** Post headline for schema. */
  title: string;
  /**
   * Absolute canonical Post URL.
   * When omitted, derived as `{origin}{base}blog/{slug}/`.
   */
  url?: string;
  /** ISO-8601 `datePublished` when known. */
  datePublished?: string | null;
};

/**
 * Arguments for {@link buildBlogIndexJsonLd}.
 *
 * Pass `pathname` from `Astro.url.pathname` (includes Astro `base`, e.g. `/cae/blog/`).
 * Canonical URL is derived via {@link toCanonicalUrl}.
 */
export type BlogIndexJsonLdInput = {
  /** Current page pathname including Astro base. */
  pathname: string;
  /** Collection / Blog display name (e.g. `"Insights"` or `"Blog"`). */
  name: string;
  /** Meta description for the index CollectionPage. */
  description: string;
  /** Brand name for Organization / WebSite. Defaults to `"Cae Goh"`. */
  siteName?: string;
  /** Absolute primary / OG image URL for `primaryImageOfPage`. */
  ogImageUrl?: string;
  /**
   * Optional published Posts to embed as lightweight `BlogPosting` stubs
   * under `Blog.blogPost`. Safe to omit or pass `[]`.
   */
  posts?: ReadonlyArray<BlogIndexListItem>;
};

/**
 * Arguments for {@link buildBlogPostJsonLd} (beyond the `BlogPost` itself).
 *
 * Pass `pathname` from `Astro.url.pathname` (e.g. `/cae/blog/my-slug/`).
 * Prefer resolved SEO title/description from `blog-format` helpers when available.
 */
export type BlogPostJsonLdInput = {
  /** Current Post pathname including Astro base. */
  pathname: string;
  /** Brand name for publisher / WebSite. Defaults to `"Cae Goh"`. */
  siteName?: string;
  /**
   * Absolute image URL (OG or hero). When omitted, no `image` is set on BlogPosting
   * (SeoHead still emits a default OG image independently).
   */
  ogImageUrl?: string;
  /**
   * Absolute URL of the blog index (parent Blog / CollectionPage).
   * Defaults to `{origin}{base}blog/`.
   */
  blogIndexUrl?: string;
  /**
   * Headline override (e.g. resolved `seoTitle`). Defaults to trimmed `post.title`.
   */
  headline?: string;
  /**
   * Description override (SEO description / excerpt). Defaults to excerpt, then title.
   */
  description?: string;
};

/**
 * Stable fragment ids under the site origin (not path-prefixed).
 *
 * @returns Origin root used for `@id` anchors
 */
function schemaRoot(): string {
  return getSiteOrigin();
}

/**
 * Returns a trimmed non-empty string, or `undefined` when invalid.
 *
 * @param value - Candidate string
 * @returns Trimmed string or `undefined`
 */
function nonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Validates an ISO-8601 timestamp string for schema dates.
 *
 * @param value - Candidate date string
 * @returns Trimmed ISO string when parseable, otherwise `undefined`
 */
function validIsoDate(value: unknown): string | undefined {
  const trimmed = nonEmptyString(value);
  if (trimmed === undefined) {
    return undefined;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return trimmed;
}

/**
 * Builds the absolute canonical URL for a Post slug under the blog index.
 *
 * @param slug - Post slug segment
 * @returns Absolute Post URL with trailing slash
 */
function canonicalPostUrlFromSlug(slug: string): string {
  const cleaned = nonEmptyString(slug);
  if (cleaned === undefined) {
    throw new Error("canonicalPostUrlFromSlug requires a non-empty slug.");
  }
  const base = normalizeBase(import.meta.env.BASE_URL);
  return toCanonicalUrl(`${base}blog/${cleaned}`);
}

/**
 * Absolute URL of the public blog index.
 *
 * @returns Canonical blog index URL
 */
function defaultBlogIndexUrl(): string {
  const base = normalizeBase(import.meta.env.BASE_URL);
  return toCanonicalUrl(`${base}blog`);
}

/**
 * Converts reading-time minutes to an ISO-8601 duration (`PTnM`).
 *
 * @param minutes - Estimated minutes
 * @returns Duration string, or `undefined` when invalid
 */
function readingTimeDuration(
  minutes: number | null,
): string | undefined {
  if (typeof minutes !== "number" || !Number.isFinite(minutes) || minutes <= 0) {
    return undefined;
  }
  const rounded = Math.max(1, Math.round(minutes));
  return `PT${String(rounded)}M`;
}

/**
 * Resolves a site-relative or absolute image URL to an absolute `https://` URL.
 *
 * @param value - Candidate image path or URL
 * @returns Absolute URL, or `undefined` when empty
 */
function absoluteImageUrl(value: unknown): string | undefined {
  const trimmed = nonEmptyString(value);
  if (trimmed === undefined) {
    return undefined;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return toAbsoluteUrl(trimmed);
}

/**
 * Merges optional fields onto a base JSON-LD node without mutating readonly types.
 *
 * @param base - Required node fields
 * @param extras - Optional key/value pairs (undefined values omitted)
 * @returns Combined {@link JsonLdNode}
 */
function withOptionalFields(
  base: JsonLdNode,
  extras: Readonly<Record<string, string | number | boolean | null | JsonLdNode | ReadonlyArray<string | number | boolean | null | JsonLdNode> | undefined>>,
): JsonLdNode {
  const merged: {
    [key: string]:
      | string
      | number
      | boolean
      | null
      | JsonLdNode
      | ReadonlyArray<string | number | boolean | null | JsonLdNode>;
  } = { ...base };
  for (const [key, value] of Object.entries(extras)) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

/**
 * Filters FAQ entries to those with non-empty question and answer text.
 * Invalid or blank pairs are skipped so callers never emit broken FAQPage schema.
 *
 * @param faq - Raw FAQ array from a {@link BlogPost}
 * @returns Valid Q/A pairs only
 */
function validFaqItems(faq: ReadonlyArray<FaqItem>): FaqItem[] {
  if (!Array.isArray(faq)) {
    return [];
  }
  const items: FaqItem[] = [];
  for (const entry of faq) {
    if (entry === null || typeof entry !== "object") {
      continue;
    }
    const question = nonEmptyString(entry.question);
    const answer = nonEmptyString(entry.answer);
    if (question === undefined || answer === undefined) {
      continue;
    }
    items.push({ question, answer });
  }
  return items;
}

/**
 * Builds a FAQPage graph node, or `undefined` when no valid Q/A pairs exist.
 *
 * @param pageUrl - Absolute canonical Post URL
 * @param faq - Post FAQ array
 * @returns FAQPage node, or `undefined` to omit from `@graph`
 */
function buildFaqPageNode(
  pageUrl: string,
  faq: ReadonlyArray<FaqItem>,
): JsonLdNode | undefined {
  const items = validFaqItems(faq);
  if (items.length === 0) {
    return undefined;
  }

  const mainEntity: JsonLdNode[] = items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity,
  };
}

/**
 * Builds CollectionPage + Blog JSON-LD for the public blog index.
 *
 * Expected wiring (B5):
 * - `pathname`: `Astro.url.pathname` (canonical derived internally)
 * - `name` / `description`: match the visible index title and meta description
 * - `siteName`: brand string passed to SeoHead (usually `"Cae Goh"`)
 * - `ogImageUrl`: absolute OG image (same URL SeoHead resolves)
 * - `posts`: optional list stubs for `Blog.blogPost`
 *
 * @param input - Index page metadata and optional Post stubs
 * @returns JSON-LD `@graph` document safe for `SeoHead` `jsonLd`
 */
export function buildBlogIndexJsonLd(input: BlogIndexJsonLdInput): JsonLdNode {
  if (input === null || typeof input !== "object") {
    throw new TypeError("buildBlogIndexJsonLd requires an input object.");
  }

  const pathname = nonEmptyString(input.pathname);
  if (pathname === undefined) {
    throw new Error("buildBlogIndexJsonLd requires a non-empty pathname.");
  }

  const name = nonEmptyString(input.name);
  if (name === undefined) {
    throw new Error("buildBlogIndexJsonLd requires a non-empty name.");
  }

  const description = nonEmptyString(input.description);
  if (description === undefined) {
    throw new Error("buildBlogIndexJsonLd requires a non-empty description.");
  }

  const siteName = nonEmptyString(input.siteName) ?? DEFAULT_SITE_NAME;
  const pageUrl = toCanonicalUrl(pathname);
  const root = schemaRoot();
  const orgId = `${root}/#organization`;
  const websiteId = `${root}/#website`;
  const blogId = `${pageUrl}#blog`;
  const webpageId = `${pageUrl}#webpage`;
  const homePath = toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL));

  const blogPostNodes: JsonLdNode[] = [];
  const rawPosts = input.posts;
  if (Array.isArray(rawPosts)) {
    for (const item of rawPosts) {
      if (item === null || typeof item !== "object") {
        continue;
      }
      const slug = nonEmptyString(item.slug);
      const title = nonEmptyString(item.title);
      if (slug === undefined || title === undefined) {
        continue;
      }
      const explicitUrl = nonEmptyString(item.url);
      const postUrl =
        explicitUrl !== undefined
          ? explicitUrl
          : canonicalPostUrlFromSlug(slug);
      blogPostNodes.push(
        withOptionalFields(
          {
            "@type": "BlogPosting",
            headline: title,
            url: postUrl,
            mainEntityOfPage: postUrl,
          },
          {
            datePublished: validIsoDate(item.datePublished),
          },
        ),
      );
    }
  }

  const ogAbsolute = absoluteImageUrl(input.ogImageUrl);
  const collectionPage = withOptionalFields(
    {
      "@type": "CollectionPage",
      "@id": webpageId,
      url: pageUrl,
      name,
      description,
      isPartOf: {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: homePath,
      },
      about: {
        "@id": orgId,
      },
      mainEntity: {
        "@id": blogId,
      },
    },
    {
      primaryImageOfPage:
        ogAbsolute === undefined
          ? undefined
          : {
              "@type": "ImageObject",
              url: ogAbsolute,
            },
    },
  );

  const blogNode = withOptionalFields(
    {
      "@type": "Blog",
      "@id": blogId,
      name,
      description,
      url: pageUrl,
      publisher: {
        "@id": orgId,
      },
      inLanguage: "en",
    },
    {
      blogPost: blogPostNodes.length > 0 ? blogPostNodes : undefined,
    },
  );

  return {
    "@context": "https://schema.org",
    "@graph": [collectionPage, blogNode],
  };
}

/**
 * Builds BlogPosting (+ optional FAQPage) JSON-LD for a published Post.
 *
 * Expected wiring (B6):
 * - `post`: published {@link BlogPost} from `@seo/blog`
 * - `pathname`: `Astro.url.pathname` → canonical article URL
 * - `headline` / `description`: prefer `resolvePostSeoTitle` / `resolvePostSeoDescription`
 * - `ogImageUrl`: absolute hero/OG URL (optional)
 * - `blogIndexUrl`: absolute blog index URL (optional; defaults to `{base}blog/`)
 * - `siteName`: brand string (defaults to `"Cae Goh"`)
 *
 * FAQPage is included only when `post.faq` has at least one valid non-empty Q/A pair;
 * blank or malformed entries are skipped (no broken FAQ graph).
 *
 * @param post - Published Post domain object
 * @param input - Page URL and SEO overrides
 * @returns JSON-LD `@graph` document safe for `SeoHead` `jsonLd`
 */
export function buildBlogPostJsonLd(
  post: BlogPost,
  input: BlogPostJsonLdInput,
): JsonLdNode {
  if (post === null || typeof post !== "object") {
    throw new TypeError("buildBlogPostJsonLd requires a BlogPost object.");
  }
  if (input === null || typeof input !== "object") {
    throw new TypeError("buildBlogPostJsonLd requires an input object.");
  }

  const pathname = nonEmptyString(input.pathname);
  if (pathname === undefined) {
    throw new Error("buildBlogPostJsonLd requires a non-empty pathname.");
  }

  const siteName = nonEmptyString(input.siteName) ?? DEFAULT_SITE_NAME;
  const pageUrl = toCanonicalUrl(pathname);
  const root = schemaRoot();
  const orgId = `${root}/#organization`;
  const websiteId = `${root}/#website`;
  const articleId = `${pageUrl}#article`;

  const blogIndex =
    nonEmptyString(input.blogIndexUrl) ?? defaultBlogIndexUrl();
  const blogId = `${blogIndex}#blog`;

  const headline =
    nonEmptyString(input.headline) ??
    nonEmptyString(post.title) ??
    "Blog post";

  const description =
    nonEmptyString(input.description) ??
    nonEmptyString(post.seoDescription) ??
    nonEmptyString(post.excerpt) ??
    headline;

  const authorName =
    post.author !== null && post.author !== undefined
      ? nonEmptyString(post.author.name) ?? DEFAULT_AUTHOR_NAME
      : DEFAULT_AUTHOR_NAME;

  const authorPhoto =
    post.author !== null && post.author !== undefined
      ? absoluteImageUrl(post.author.photoUrl)
      : undefined;

  const authorNode = withOptionalFields(
    {
      "@type": "Person",
      name: authorName,
    },
    {
      image: authorPhoto,
    },
  );

  const articleSection =
    post.category !== null && post.category !== undefined
      ? nonEmptyString(post.category.name)
      : undefined;

  const keywordList = Array.isArray(post.tags)
    ? post.tags
        .map((tag) => nonEmptyString(tag))
        .filter((tag): tag is string => tag !== undefined)
    : [];
  const keywords =
    keywordList.length > 0 ? keywordList.join(", ") : undefined;

  const imageAbsolute = absoluteImageUrl(input.ogImageUrl);

  const blogPosting = withOptionalFields(
    {
      "@type": "BlogPosting",
      "@id": articleId,
      headline,
      description,
      url: pageUrl,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      inLanguage: "en",
      isPartOf: {
        "@id": blogId,
      },
      author: authorNode,
      publisher: {
        "@type": "Organization",
        "@id": orgId,
        name: siteName,
      },
    },
    {
      datePublished: validIsoDate(post.publishedAt),
      dateModified: validIsoDate(post.updatedAt),
      image:
        imageAbsolute === undefined
          ? undefined
          : {
              "@type": "ImageObject",
              url: imageAbsolute,
            },
      articleSection,
      keywords,
      timeRequired: readingTimeDuration(post.readingTimeMinutes),
    },
  );

  // Keep a WebSite anchor so BlogPosting can sit beside homepage Organization ids.
  const websiteNode: JsonLdNode = {
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL)),
    publisher: { "@id": orgId },
  };

  const blogNode: JsonLdNode = {
    "@type": "Blog",
    "@id": blogId,
    name: `${siteName} Blog`,
    url: blogIndex,
    publisher: { "@id": orgId },
  };

  const faqNode = buildFaqPageNode(pageUrl, post.faq);
  const graph: JsonLdNode[] =
    faqNode === undefined
      ? [blogPosting, blogNode, websiteNode]
      : [blogPosting, blogNode, websiteNode, faqNode];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
