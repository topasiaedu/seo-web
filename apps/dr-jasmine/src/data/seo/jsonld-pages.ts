/**
 * @fileoverview JSON-LD builders for public marketing pages (home, About, FAQ).
 */

import type { JsonLdNode } from "@/data/blog/jsonld";
import type { FaqItem } from "@/data/site/faqs";
import {
  getSiteOrigin,
  normalizeBase,
  toAbsoluteUrl,
  toCanonicalUrl,
} from "@/lib/site-url";
import { drJasmineSiteConfig } from "@/site-config";

/**
 * Returns trimmed text when `value` is a non-empty string.
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
 * Merges optional fields onto a base JSON-LD node without mutating readonly types.
 *
 * @param base - Required node fields
 * @param extras - Optional key/value pairs (undefined values omitted)
 * @returns Combined {@link JsonLdNode}
 */
function withOptionalFields(
  base: JsonLdNode,
  extras: Readonly<
    Record<
      string,
      | string
      | number
      | boolean
      | null
      | JsonLdNode
      | ReadonlyArray<string | number | boolean | null | JsonLdNode>
      | undefined
    >
  >,
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
 * Stable schema.org `@id` anchors under the public site origin.
 *
 * @returns Origin root used for shared entity ids
 */
function schemaRoot(): string {
  return getSiteOrigin();
}

/**
 * Absolute home URL under the Astro base path.
 *
 * @returns Canonical home URL
 */
function homeUrl(): string {
  return toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL));
}

/**
 * Shared Organization node id used across page graphs.
 *
 * @returns Fragment id such as `https://doctorjasmine.com/#organization`
 */
function organizationId(): string {
  return `${schemaRoot()}/#organization`;
}

/**
 * Shared WebSite node id used across page graphs.
 *
 * @returns Fragment id such as `https://doctorjasmine.com/#website`
 */
function websiteId(): string {
  return `${schemaRoot()}/#website`;
}

/**
 * Builds the shared Organization node for Dr Jasmine public pages.
 *
 * @param siteName - Brand display name
 * @returns Organization {@link JsonLdNode}
 */
function buildOrganizationNode(siteName: string): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": organizationId(),
    name: siteName,
    url: homeUrl(),
    sameAs: [
      drJasmineSiteConfig.social.instagram,
      drJasmineSiteConfig.social.linkedin,
    ],
  };
}

/**
 * Builds the shared WebSite node referencing the Organization publisher.
 *
 * @param siteName - Brand display name
 * @returns WebSite {@link JsonLdNode}
 */
function buildWebSiteNode(siteName: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    name: siteName,
    url: homeUrl(),
    publisher: {
      "@id": organizationId(),
    },
  };
}

/**
 * Filters FAQ entries to those with non-empty question and answer text.
 *
 * @param items - FAQ list from site content data
 * @returns Valid Q/A pairs only
 */
function validFaqItems(items: ReadonlyArray<FaqItem>): FaqItem[] {
  const result: FaqItem[] = [];
  for (const entry of items) {
    const question = nonEmptyString(entry.question);
    const answer = nonEmptyString(entry.answer);
    if (question === undefined || answer === undefined) {
      continue;
    }
    result.push({ question, answer });
  }
  return result;
}

/**
 * Arguments for {@link buildWebSiteJsonLd}.
 */
export type WebSiteJsonLdInput = {
  /** Current page pathname including Astro base. */
  pathname: string;
  /** Brand name; defaults to site config. */
  siteName?: string;
  /** Page meta description for the WebPage node. */
  description?: string;
  /**
   * Optional FAQ entries. When present, a FAQPage node is added to the graph
   * (used on home after the dedicated `/faq` route was removed).
   */
  faqs?: ReadonlyArray<FaqItem>;
};

/**
 * Builds Organization + WebSite + WebPage JSON-LD for the public home (or any route).
 * Optionally includes FAQPage when {@link WebSiteJsonLdInput.faqs} is provided.
 *
 * @param input - Page pathname and optional SEO overrides
 * @returns JSON-LD document safe for `SeoHead` `jsonLd`
 */
export function buildWebSiteJsonLd(input: WebSiteJsonLdInput): JsonLdNode {
  if (input === null || typeof input !== "object") {
    throw new TypeError("buildWebSiteJsonLd requires an input object.");
  }

  const pathname = nonEmptyString(input.pathname);
  if (pathname === undefined) {
    throw new Error("buildWebSiteJsonLd requires a non-empty pathname.");
  }

  const siteName =
    nonEmptyString(input.siteName) ?? drJasmineSiteConfig.name;
  const pageUrl = toCanonicalUrl(pathname);
  const description = nonEmptyString(input.description);

  const organization = buildOrganizationNode(siteName);
  const website = buildWebSiteNode(siteName);
  const webpage = withOptionalFields(
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: siteName,
      isPartOf: {
        "@id": websiteId(),
      },
      about: {
        "@id": organizationId(),
      },
    },
    {
      description,
    },
  );

  const graph: JsonLdNode[] = [organization, website, webpage];
  const faqDocument =
    input.faqs === undefined
      ? undefined
      : buildFaqPageJsonLd(pageUrl, input.faqs);
  if (faqDocument !== undefined) {
    const faqGraph = faqDocument["@graph"];
    if (Array.isArray(faqGraph)) {
      for (const node of faqGraph) {
        if (typeof node === "object" && node !== null && !Array.isArray(node)) {
          graph.push(node);
        }
      }
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Arguments for {@link buildAboutJsonLd}.
 */
export type AboutJsonLdInput = {
  /** Current page pathname including Astro base. */
  pathname: string;
  /** Physician display name (e.g. Dr Jasmine Chiew, MBBS). */
  name: string;
  /** Brand name; defaults to site config. */
  siteName?: string;
  /** Page meta description. */
  description?: string;
};

/**
 * Builds Person (physician) + MedicalWebPage JSON-LD for the About route.
 * Uses honest public fields only — no invented credentials or contact email.
 *
 * @param input - Pathname, physician name, and optional SEO overrides
 * @returns JSON-LD document safe for `SeoHead` `jsonLd`
 */
export function buildAboutJsonLd(input: AboutJsonLdInput): JsonLdNode {
  if (input === null || typeof input !== "object") {
    throw new TypeError("buildAboutJsonLd requires an input object.");
  }

  const pathname = nonEmptyString(input.pathname);
  if (pathname === undefined) {
    throw new Error("buildAboutJsonLd requires a non-empty pathname.");
  }

  const physicianName = nonEmptyString(input.name);
  if (physicianName === undefined) {
    throw new Error("buildAboutJsonLd requires a non-empty name.");
  }

  const siteName =
    nonEmptyString(input.siteName) ?? drJasmineSiteConfig.name;
  const pageUrl = toCanonicalUrl(pathname);
  const description = nonEmptyString(input.description);
  const personId = `${schemaRoot()}/#physician`;

  const organization = buildOrganizationNode(siteName);
  const website = buildWebSiteNode(siteName);
  const person = withOptionalFields(
    {
      "@type": "Person",
      "@id": personId,
      name: physicianName,
      jobTitle: "Medical doctor",
      url: pageUrl,
      worksFor: {
        "@id": organizationId(),
      },
      sameAs: [
        drJasmineSiteConfig.social.instagram,
        drJasmineSiteConfig.social.linkedin,
      ],
    },
    {
      description,
    },
  );
  const webpage = withOptionalFields(
    {
      "@type": "MedicalWebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: physicianName,
      isPartOf: {
        "@id": websiteId(),
      },
      about: {
        "@id": personId,
      },
      mainEntity: {
        "@id": personId,
      },
    },
    {
      description,
    },
  );

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, person, webpage],
  };
}

/**
 * Arguments for {@link buildReelsJsonLd}.
 */
export type ReelsJsonLdInput = {
  /** Current page pathname including Astro base. */
  pathname: string;
  /** Brand name; defaults to site config. */
  siteName?: string;
  /** Page meta description. */
  description?: string;
};

/**
 * Builds WebPage JSON-LD for the curated Instagram Reels route.
 *
 * @param input - Pathname and optional SEO overrides
 * @returns JSON-LD document safe for `SeoHead` `jsonLd`
 */
export function buildReelsJsonLd(input: ReelsJsonLdInput): JsonLdNode {
  if (input === null || typeof input !== "object") {
    throw new TypeError("buildReelsJsonLd requires an input object.");
  }

  const pathname = nonEmptyString(input.pathname);
  if (pathname === undefined) {
    throw new Error("buildReelsJsonLd requires a non-empty pathname.");
  }

  const siteName =
    nonEmptyString(input.siteName) ?? drJasmineSiteConfig.name;
  const pageUrl = toCanonicalUrl(pathname);
  const description = nonEmptyString(input.description);
  const pageName = `Instagram Reels | ${siteName}`;

  const organization = buildOrganizationNode(siteName);
  const website = buildWebSiteNode(siteName);
  const webpage = withOptionalFields(
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageName,
      isPartOf: {
        "@id": websiteId(),
      },
      about: {
        "@id": organizationId(),
      },
      significantLink: drJasmineSiteConfig.social.instagram,
    },
    {
      description,
    },
  );

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webpage],
  };
}

/**
 * Builds FAQPage JSON-LD for a page that embeds the FAQ accordion (home).
 *
 * @param pageUrl - Absolute canonical URL of the page hosting the FAQs
 * @param items - FAQ entries from site content data
 * @returns JSON-LD document, or `undefined` when no valid items exist
 */
export function buildFaqPageJsonLd(
  pageUrl: string,
  items: ReadonlyArray<FaqItem>,
): JsonLdNode | undefined {
  if (typeof pageUrl !== "string" || pageUrl.trim().length === 0) {
    throw new Error("buildFaqPageJsonLd requires a non-empty pageUrl.");
  }

  const validItems = validFaqItems(items);
  if (validItems.length === 0) {
    return undefined;
  }

  const mainEntity: JsonLdNode[] = validItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const faqPage: JsonLdNode = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [faqPage],
  };
}
