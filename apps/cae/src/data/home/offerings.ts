/**
 * @fileoverview Four primary offering cards under the potential headline.
 */

import type { HomeImageKey } from "./images.ts";
import { assertHomeHref, type HomeHref } from "./nav.ts";

/**
 * One offering / funnel card on the homepage.
 */
export type OfferingCard = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly href: HomeHref;
  readonly imageAlt: string;
  readonly imageTitle: string;
  /** Logical image key resolved by {@link getHomeImage}. */
  readonly imageKey: HomeImageKey;
};

/**
 * Offerings section: headline plus Consult / Workshop / Learn / Insider cards.
 */
export const homeOfferings = {
  sectionId: "offerings",
  headline: "LIFE STARTS AT YOUR FULL POTENTIAL",
  cards: [
    {
      id: "consult",
      title: "CONSULT WITH CAE GOH (3 MONTH WAITING LIST)",
      body: "Begins at USD15,000. Apply here to see if you are the right fit.",
      href: assertHomeHref("https://caegoh.com/home-page-4444"),
      imageAlt: "High-altitude flight helmet with dramatic blue and orange lighting",
      imageTitle: "Life starts at your full potential",
      imageKey: "offeringConsult",
    },
    {
      id: "workshop",
      title: "ATTEND LIVE WORKSHOP ONLINE",
      body: "Our next live workshop is designed for serious players. See if it's the right fit for you.",
      href: assertHomeHref("https://predictabledestiny.com/now"),
      imageAlt: "Bright creative studio with plants, pallet seating, and handmade textiles",
      imageTitle: "Creative studio space",
      imageKey: "offeringWorkshop",
    },
    {
      id: "learn-zwds",
      title: "LEARN ZI WEI DOU SHU",
      body: "Master the step-by-step systems that drive real breakthroughs.",
      href: assertHomeHref("https://caegoh.com/home-page-4444"),
      imageAlt: "Modern library aisle lined with warm-lit wooden bookshelves",
      imageTitle: "Learning and knowledge",
      imageKey: "offeringLearnZwds",
    },
    {
      id: "insider",
      title: "INSIDER ACCESS",
      body: "Get the latest updates delivered straight to your inbox.",
      href: assertHomeHref("https://caegoh.com/home-page-4444"),
      imageAlt: "Eyes looking through green tropical leaves",
      imageTitle: "Clarity and focused vision",
      imageKey: "offeringInsider",
    },
  ] as const satisfies readonly OfferingCard[],
} as const;

/** Shape of {@link homeOfferings}. */
export type HomeOfferings = typeof homeOfferings;
