/**
 * @fileoverview Media & Press article cards for `/cae/media/`.
 * Copy and outlet links preserved from the live GHL media capture.
 */

import type { HomeImageKey } from "./images.ts";

/**
 * Absolute HTTPS URL to an external press article.
 */
export type MediaArticleHref = `https://${string}`;

/**
 * One press coverage card on the Media & Press page.
 */
export type MediaArticle = {
  readonly id: string;
  readonly outlet: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly href: MediaArticleHref;
  /**
   * Preferred logo slot from homepage press marks (`getHomeImage`).
   * When set, used instead of the GHL media capture file.
   */
  readonly logoImageKey?: HomeImageKey;
  /** Fallback filename under `src/assets/media/` when no logo key. */
  readonly imageFile: string;
  readonly imageAlt: string;
};

/**
 * Ensures a string is an https URL for media article links.
 *
 * @param value - Candidate URL
 * @returns The same value when valid
 */
function assertHttpsHref(value: string): MediaArticleHref {
  if (typeof value !== "string" || !value.startsWith("https://")) {
    throw new Error(`assertHttpsHref requires an https URL, got: ${value}`);
  }
  return value as MediaArticleHref;
}

/**
 * Media & Press page heading and article list (capture order).
 */
export const homeMedia = {
  eyebrow: "Coverage",
  heading: "Media & Press",
  lede: "Features and press covering CAE Goh and the Predictable Destiny System.",
  ctaLabel: "Read more",
  articles: [
    {
      id: "digital-journal",
      outlet: "Digital Journal",
      title:
        "Strategist CAE Goh unveils the Predictable Destiny System—a Zi Wei Dou Shu-based method helping leaders align decisions with their natural timing and strengths...",
      dateLabel: "11 July 2025",
      href: assertHttpsHref(
        "https://www.digitaljournal.com/pr/news/revupmarketer/cae-goh-launches-predictable-destiny-1836892877.html",
      ),
      logoImageKey: "pressDigitalJournal",
      imageFile: "68779ad0e2aa7c09dfce3604.webp",
      imageAlt: "Digital Journal logo",
    },
    {
      id: "newsbreak",
      outlet: "Newsbreak",
      title:
        "Today’s leaders are under pressure to move quickly and constantly make the right calls. But more effort doesn’t always lead to better outcomes...",
      dateLabel: "16 July 2025",
      href: assertHttpsHref(
        "https://www.newsbreak.com/dmr-news-321522575/4110822968309-why-high-performers-are-turning-to-cae-goh-s-ancient-astrology-framework-for-strategic-decisions",
      ),
      logoImageKey: "pressNewsbreak",
      imageFile: "68787d2b2035ba763b91025a.jpeg",
      imageAlt: "Newsbreak logo",
    },
    {
      id: "usa-news",
      outlet: "USA News",
      title:
        "CAE Goh’s Predictable Destiny System bridges personal growth and business clarity—helping individuals make empowered choices across every area of life...",
      dateLabel: "14 July 2025",
      href: assertHttpsHref(
        "https://usanews.com/newsroom/cae-goh-transforms-life-and-business-decision-making-with-predictable-destiny-system",
      ),
      logoImageKey: "pressUsaNews",
      imageFile: "687879014216d06ee27d8410.png",
      imageAlt: "USA News logo",
    },
    {
      id: "ceo-times",
      outlet: "CEO Times",
      title:
        "By integrating Zi Wei Dou Shu astrology with modern frameworks, CAE Goh's Predictable Destiny System equips high performers to time decisions precisely for sustained excellence...",
      dateLabel: "12 July 2025",
      href: assertHttpsHref(
        "https://ceotimes.com/the-predictable-destiny-system-how-cae-goh-is-revolutionizing-strategic-decision-making-for-high-performers/",
      ),
      logoImageKey: "pressCeoTimes",
      imageFile: "687451f46bf4561738569f0e.png",
      imageAlt: "CEO Times logo",
    },
    {
      id: "prime-time-press",
      outlet: "Prime Time Press",
      title:
        "CAE Goh blends ancient timing wisdom with strategic clarity, guiding clients to make grounded, intuitive decisions through her Predictable Destiny System...",
      dateLabel: "14 July 2025",
      href: assertHttpsHref(
        "https://primetimepress.com/the-predictable-destiny-system-cae-gohs-approach-to-decisions/",
      ),
      logoImageKey: "pressPrimeTime",
      imageFile: "68779ca3204f2d3df0d3b716.png",
      imageAlt: "Prime Time Press logo",
    },
    {
      id: "ap-news",
      outlet: "AP News",
      title:
        "Merging metaphysical insight with high-performance strategy, CAE Goh’s Predictable Destiny System empowers leaders to act with clarity, timing, and conviction...",
      dateLabel: "13 July 2025",
      href: assertHttpsHref(
        "https://apnews.com/press-release/marketersmedia/cae-goh-announces-revolutionary-predictable-destiny-system-for-high-performers-7460e4a52d454ea47c97ddfc0f379d23",
      ),
      logoImageKey: "pressAp",
      imageFile: "6877a37f1db1291e184636bd.svg",
      imageAlt: "AP News logo",
    },
    {
      id: "ny-review",
      outlet: "NY Review",
      title:
        "CAE Goh reframes destiny as a strategy—merging ancient insights with precise planning to help visionaries design a life of alignment, not chance...",
      dateLabel: "14 July 2025",
      href: assertHttpsHref(
        "https://nyreview.com/cae-redefining-destiny-through-alignment-timing-and-strategic-planning-2/",
      ),
      logoImageKey: "pressNyReview",
      imageFile: "6877a085c019ad4fa657ca4c.png",
      imageAlt: "NY Review logo",
    },
    {
      id: "womens-insider",
      outlet: "Women's Insider",
      title:
        "CAE Goh helps high performers unlock clarity and confidence by making precisely timed, purpose-aligned decisions...",
      dateLabel: "14 July 2025",
      href: assertHttpsHref(
        "https://womensinsider.com/cae-gohs-predictable-destiny-system-empowering-high-performers-to-make-precision-based-decisions/",
      ),
      logoImageKey: "pressWomensInsider",
      imageFile: "68779e229ee7147a815c8cc7.png",
      imageAlt: "Women's Insider logo",
    },
    {
      id: "golden-state-review",
      outlet: "Golden State Review",
      title:
        "Integrating Eastern wisdom and strategic foresight, CAE Goh’s Predictable Destiny System offers a clear path to success through timing and self-mastery...",
      dateLabel: "15 July 2025",
      href: assertHttpsHref(
        "https://goldenstatereview.com/the-predictable-destiny-system-cae-gohs-approach-to-success/",
      ),
      imageFile: "6877a22c6c565e26ba1eb25a.png",
      imageAlt: "Golden State Review logo",
    },
  ] as const satisfies readonly MediaArticle[],
} as const;

/** Shape of {@link homeMedia}. */
export type HomeMedia = typeof homeMedia;
