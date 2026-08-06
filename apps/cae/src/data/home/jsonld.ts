/**
 * @fileoverview JSON-LD payloads for CAE marketing pages.
 */

import { aboutMeta, homeMeta, mediaMeta, socialMeta, ziWeiDouShuMeta } from "./meta";
import { aboutCopy } from "./about";
import { ziWeiDouShuCopy } from "./zi-wei-dou-shu";
import {
  getSiteOrigin,
  normalizeBase,
  toAbsoluteUrl,
  toCanonicalUrl,
} from "@/lib/site-url";

/**
 * Serializable JSON-LD graph node (plain object tree).
 */
export type JsonLdNode = {
  readonly [key: string]:
    | string
    | number
    | boolean
    | null
    | JsonLdNode
    | ReadonlyArray<string | number | boolean | null | JsonLdNode>;
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
 * Builds Organization + Person + WebSite JSON-LD for the homepage.
 *
 * @param pathname - Current page pathname (includes Astro base)
 * @param ogImageUrl - Absolute Open Graph image URL
 * @returns JSON-LD `@graph` document
 */
export function buildHomeJsonLd(
  pathname: string,
  ogImageUrl: string,
): JsonLdNode {
  const pageUrl = toCanonicalUrl(pathname);
  const root = schemaRoot();
  const orgId = `${root}/#organization`;
  const personId = `${root}/#person`;
  const websiteId = `${root}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: homeMeta.siteName,
        url: pageUrl,
        logo: ogImageUrl,
        sameAs: [
          "https://www.rednote.com/user/profile/6a19467f000000000d035c00",
          "https://www.instagram.com/caegoh/",
          "https://www.facebook.com/caegoh",
        ],
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Cae Goh",
        url: pageUrl,
        jobTitle: "Zi Wei Dou Shu Consultant",
        worksFor: { "@id": orgId },
        image: ogImageUrl,
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: homeMeta.siteName,
        url: pageUrl,
        description: homeMeta.description,
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
    ],
  };
}

/**
 * Builds CollectionPage JSON-LD for Media & Press.
 *
 * @param pathname - Current page pathname (includes Astro base)
 * @param ogImageUrl - Absolute Open Graph image URL
 * @returns JSON-LD document
 */
export function buildMediaJsonLd(
  pathname: string,
  ogImageUrl: string,
): JsonLdNode {
  const pageUrl = toCanonicalUrl(pathname);
  const homePath = toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL));
  const orgId = `${schemaRoot()}/#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: mediaMeta.title,
    description: mediaMeta.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: mediaMeta.siteName,
      url: homePath,
    },
    about: {
      "@id": orgId,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl,
    },
  };
}

/**
 * Builds CollectionPage JSON-LD for the Social Media hub.
 *
 * @param pathname - Current page pathname (includes Astro base)
 * @param ogImageUrl - Absolute Open Graph image URL
 * @returns JSON-LD document
 */
export function buildSocialJsonLd(
  pathname: string,
  ogImageUrl: string,
): JsonLdNode {
  const pageUrl = toCanonicalUrl(pathname);
  const homePath = toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL));
  const orgId = `${schemaRoot()}/#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: socialMeta.title,
    description: socialMeta.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: socialMeta.siteName,
      url: homePath,
    },
    about: {
      "@id": orgId,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl,
    },
  };
}

/**
 * Builds AboutPage JSON-LD with Person as main entity.
 *
 * @param pathname - Current page pathname (includes Astro base)
 * @param ogImageUrl - Absolute Open Graph image URL
 * @returns JSON-LD document
 */
export function buildAboutJsonLd(
  pathname: string,
  ogImageUrl: string,
): JsonLdNode {
  const pageUrl = toCanonicalUrl(pathname);
  const homePath = toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL));
  const root = schemaRoot();
  const orgId = `${root}/#organization`;
  const personId = `${root}/#person`;

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: aboutMeta.title,
    description: aboutMeta.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: aboutMeta.siteName,
      url: homePath,
    },
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: "Cae Goh",
      jobTitle: aboutCopy.heroRole,
      description: aboutMeta.description,
      url: pageUrl,
      image: ogImageUrl,
      worksFor: { "@id": orgId },
      sameAs: [
        "https://www.rednote.com/user/profile/6a19467f000000000d035c00",
        "https://www.instagram.com/caegoh/",
        "https://www.facebook.com/caegoh",
      ],
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl,
    },
  };
}

/**
 * Builds WebPage + FAQPage JSON-LD for the Zi Wei Dou Shu explainer.
 *
 * @param pathname - Current page pathname (includes Astro base)
 * @param ogImageUrl - Absolute Open Graph image URL
 * @returns JSON-LD `@graph` document
 */
export function buildZiWeiDouShuJsonLd(
  pathname: string,
  ogImageUrl: string,
): JsonLdNode {
  const pageUrl = toCanonicalUrl(pathname);
  const homePath = toAbsoluteUrl(normalizeBase(import.meta.env.BASE_URL));
  const root = schemaRoot();
  const orgId = `${root}/#organization`;
  const faqEntities = ziWeiDouShuCopy.faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: ziWeiDouShuMeta.title,
        description: ziWeiDouShuMeta.description,
        url: pageUrl,
        isPartOf: {
          "@type": "WebSite",
          name: ziWeiDouShuMeta.siteName,
          url: homePath,
        },
        about: {
          "@type": "Thing",
          name: "Zi Wei Dou Shu",
          alternateName: ["Purple Star Astrology", "紫微斗數"],
          description:
            "Chinese natal astrology system using twelve palaces and named stars.",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: ogImageUrl,
        },
        publisher: { "@id": orgId },
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqEntities,
      },
    ],
  };
}

/**
 * Serializes a JSON-LD node for embedding in a script tag.
 *
 * @param node - JSON-LD object tree
 * @returns Minified JSON string safe for HTML embedding
 */
export function stringifyJsonLd(node: JsonLdNode): string {
  return JSON.stringify(node).replace(/</g, "\\u003c");
}
