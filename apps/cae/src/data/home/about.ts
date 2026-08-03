/**
 * @fileoverview Structured About page copy for `/cae/about/`.
 * Sourced from the CAE intro video transcript; client-reading and montage filler omitted.
 */

import { assertHomeHref, type HomeHref } from "./nav.ts";

/**
 * One step on the About intro origin timeline.
 */
export type AboutIntroStep = {
  /** Stable id for list keys and panel wiring. */
  readonly id: string;
  /** Timeline step title. */
  readonly title: string;
  /** Expanded body copy for the step. */
  readonly body: string;
};

/**
 * One audience / fit bullet on the About page.
 */
export type AboutFitItem = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Short punchy title. */
  readonly title: string;
  /** Supporting line under the title. */
  readonly label: string;
};

/**
 * One life-area focus domain (wealth, career, relationships, etc.).
 */
export type AboutFocusArea = {
  /** Stable id for list keys and icon lookup. */
  readonly id: string;
  /** Display title. */
  readonly label: string;
  /** Outcome line: what CAE helps the visitor do in this domain. */
  readonly outcome: string;
};

/**
 * One contrast point under Traditional or CAE in the difference section.
 */
export type AboutDifferencePoint = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Short line visitors can scan. */
  readonly label: string;
};

/**
 * One side of the Traditional vs CAE contrast.
 */
export type AboutDifferenceSide = {
  /** Column eyebrow / label. */
  readonly label: string;
  /** Supporting line under the label. */
  readonly lede: string;
  /** Scanable contrast points. */
  readonly points: readonly AboutDifferencePoint[];
};

/**
 * One belief pillar under the manifesto pull-quote.
 */
export type AboutBeliefPillar = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Short pillar title. */
  readonly title: string;
  /** Supporting sentence. */
  readonly body: string;
};

/**
 * One numbered approach step under "How I work".
 */
export type AboutApproachStep = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Short step title. */
  readonly title: string;
  /** Supporting sentence. */
  readonly body: string;
};

/**
 * About page marketing copy module.
 */
export type AboutCopy = {
  /** Hero eyebrow above the name. */
  readonly heroEyebrow: string;
  /** Optional slogan pill under the eyebrow (homepage-aligned). */
  readonly heroSlogan: string;
  /** Hero H1 brand-level name signal. */
  readonly heroName: string;
  /** One-line role under the name. */
  readonly heroRole: string;
  /** Short supporting sentence under the role. */
  readonly heroSupport: string;
  /** Intro section eyebrow. */
  readonly introEyebrow: string;
  /** Intro section heading. */
  readonly introHeading: string;
  /** Intro section lede above the timeline. */
  readonly introLede: string;
  /** Origin timeline steps (Meet Cae / system / outcome). */
  readonly introSteps: readonly AboutIntroStep[];
  /** Method section heading. */
  readonly methodHeading: string;
  /** Method lede. */
  readonly methodLede: string;
  /** Life areas the work covers. */
  readonly focusAreas: readonly AboutFocusArea[];
  /** Differentiation section heading. */
  readonly differenceHeading: string;
  /** Differentiation section lede. */
  readonly differenceLede: string;
  /** Traditional / old-way column. */
  readonly differenceTraditional: AboutDifferenceSide;
  /** CAE / new-way column. */
  readonly differenceCae: AboutDifferenceSide;
  /** Approach section heading. */
  readonly approachHeading: string;
  /** Approach section lede. */
  readonly approachLede: string;
  /** Ordered approach steps. */
  readonly approachSteps: readonly AboutApproachStep[];
  /** Belief / philosophy section heading. */
  readonly beliefHeading: string;
  /** Setup line above the featured quote. */
  readonly beliefSetup: string;
  /** Featured manifesto pull-quote. */
  readonly beliefQuote: string;
  /** Closing line under the quote. */
  readonly beliefCloser: string;
  /** Supporting belief pillars under the quote. */
  readonly beliefPillars: readonly AboutBeliefPillar[];
  /** Who-it's-for section heading. */
  readonly fitHeading: string;
  /** Who-it's-for section lede. */
  readonly fitLede: string;
  /** Audience bullets. */
  readonly fitItems: readonly AboutFitItem[];
  /** Closing CTA heading. */
  readonly ctaHeading: string;
  /** Closing CTA support sentence. */
  readonly ctaLede: string;
  /**
   * When false, hides the primary book-call CTA (hero + closing).
   * Temporary off-switch: keep href/label for when booking reopens.
   */
  readonly ctaPrimaryVisible: boolean;
  /** Primary CTA label. */
  readonly ctaPrimaryLabel: string;
  /** Primary CTA destination (book-call funnel). */
  readonly ctaPrimaryHref: HomeHref;
  /** Secondary CTA label. */
  readonly ctaSecondaryLabel: string;
  /** Secondary CTA destination (blog). */
  readonly ctaSecondaryHref: HomeHref;
};

/**
 * Locked About copy distilled from the intro video transcript.
 * SEO title/description live in `aboutMeta` (`./meta.ts`).
 */
export const aboutCopy = {
  heroEyebrow: "Zi Wei Dou Shu · Purple Star",
  heroSlogan: "POWER & BREAKTHROUGH FOR EVERYONE",
  heroName: "CAE GOH",
  heroRole: "Purple Star Astrology & life strategy",
  heroSupport:
    "I help business owners and entrepreneurs make better decisions with a clear system, not guesswork.",
  introEyebrow: "About",
  introHeading: "Clarity for people who decide under pressure",
  introLede:
    "Follow the path from who I am, to the system I use, to the clarity you leave with.",
  introSteps: [
    {
      id: "meet",
      title: "Meet Cae",
      body: "Hi, I'm Cae Goh. I work with business owners and entrepreneurs who need sharper decisions in wealth, career, relationships, and the long game of building a life that fits.",
    },
    {
      id: "system",
      title: "The system",
      body: "I use Purple Star Astrology (Zi Wei Dou Shu) as a practical decision system. Starting from simple details like your birthday, I decode your chart so you can see your strengths, your direction, and where your choices create the most leverage.",
    },
    {
      id: "outcome",
      title: "The outcome",
      body: "You leave with clearer judgment under pressure: knowing where to lead, where to wait, and how to align decisions with the life path you actually want.",
    },
  ] as const satisfies readonly AboutIntroStep[],
  methodHeading: "What CAE unlocks for you",
  methodLede:
    "One Purple Star chart. Six life domains. Clear moves, so you stop guessing and start deciding with timing on your side.",
  focusAreas: [
    {
      id: "wealth",
      label: "Wealth",
      outcome:
        "Spot timing for cash flow, investment, and long-term asset moves.",
    },
    {
      id: "career",
      label: "Career & business",
      outcome:
        "Know when to lead, expand, partner, or hold with authority.",
    },
    {
      id: "relationships",
      label: "Relationships",
      outcome:
        "Read alliance, partnership, and love dynamics before you commit.",
    },
    {
      id: "health",
      label: "Health & energy",
      outcome:
        "Protect bandwidth. See where stress hits and when to recover.",
    },
    {
      id: "family",
      label: "Family",
      outcome:
        "Navigate household roles, legacy pressure, and shared decisions.",
    },
    {
      id: "self",
      label: "Personal direction",
      outcome:
        "Align strength, weak spots, and the life path you actually want.",
    },
  ] as const satisfies readonly AboutFocusArea[],
  differenceHeading: "How I'm different",
  differenceLede:
    "Not fortune-telling that frightens you. A modern Purple Star system built for people who already lead and need clearer timing.",
  differenceTraditional: {
    label: "Traditional readings",
    lede: "The old field approach that often scares people off.",
    points: [
      {
        id: "fear",
        label: "Leans on fear and superstition as the product",
      },
      {
        id: "vague",
        label: "Vague predictions with little link to real decisions",
      },
      {
        id: "career-blind",
        label: "Ignores the career and goals you already hold",
      },
    ],
  },
  differenceCae: {
    label: "My Method",
    lede: "Ancient Purple Star timing fused with practical strategy.",
    points: [
      {
        id: "clarity",
        label: "Clarity, authority, and alignment, not scare tactics",
      },
      {
        id: "strategy",
        label: "Usable judgment tied to wealth, career, and relationships",
      },
      {
        id: "respect",
        label: "Respects your goals and the path you're already on",
      },
    ],
  },
  approachHeading: "How I work",
  approachLede:
    "Three moves. One system. From chart to decision, built for people who need leverage, not more noise.",
  approachSteps: [
    {
      id: "decode",
      title: "Decode the chart",
      body: "We start with your blueprint: strengths, patterns, and the life path already written in your chart.",
    },
    {
      id: "match",
      title: "Match path to goals",
      body: "I match what the chart shows with the outcomes you want, so guidance stays grounded in your real decisions.",
    },
    {
      id: "decide",
      title: "Decide with leverage",
      body: "You leave with clearer priorities: where to lead, where to wait, and where a different move unlocks momentum.",
    },
  ] as const satisfies readonly AboutApproachStep[],
  beliefHeading: "What I believe",
  beliefSetup:
    "People often ask: when will I get rich? When will I find the right partner? Those questions matter less than this:",
  beliefQuote:
    "Know your strengths, know your weak spots, and know what you really want.",
  beliefCloser:
    "When you take the first difficult step, you build confidence, belief, and trust. Stay bright. Stay positive. Align back to your goals so you can live the life you choose.",
  beliefPillars: [
    {
      id: "clarity",
      title: "Clarity first",
      body: "Strengths, weak spots, and desire, before chasing dates or dollar timelines.",
    },
    {
      id: "courage",
      title: "First steps",
      body: "The scary move builds confidence, belief, and trust in yourself.",
    },
    {
      id: "alignment",
      title: "Stay aligned",
      body: "Stay bright, stay positive, and keep returning to the goals that matter.",
    },
  ] as const satisfies readonly AboutBeliefPillar[],
  fitHeading: "Who this is for",
  fitLede:
    "Built for people who already carry responsibility and want timing that matches the weight of their decisions.",
  fitItems: [
    {
      id: "founders",
      title: "Business owners",
      label: "Running your own company and holding real authority over decisions.",
    },
    {
      id: "entrepreneurs",
      title: "Entrepreneurs",
      label: "Building something that demands timing, focus, and long-term judgment.",
    },
    {
      id: "high-performers",
      title: "High performers",
      label: "Ready for strategy over superstition, with clarity you can act on.",
    },
    {
      id: "decision-makers",
      title: "Serious decision-makers",
      label: "Wanting a system that links strengths, goals, and life path, not fear-based readings.",
    },
  ] as const satisfies readonly AboutFitItem[],
  ctaHeading: "Ready to decide with more clarity?",
  ctaLede:
    "If you're ready to stop guessing and start aligning decisions with your path, start here.",
  /** Temporary: hide book-call until the funnel is ready to surface again. */
  ctaPrimaryVisible: false,
  ctaPrimaryLabel: "BOOK A CALL WITH OUR TEAM",
  ctaPrimaryHref: assertHomeHref("https://caegoh.com/home-page-4444"),
  ctaSecondaryLabel: "READ THE BLOG",
  ctaSecondaryHref: assertHomeHref("/blog/"),
} as const satisfies AboutCopy;

/** Shape of {@link aboutCopy}. */
export type AboutPageCopy = typeof aboutCopy;
