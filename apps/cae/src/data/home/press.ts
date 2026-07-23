/**
 * @fileoverview "Featured On" press marquee entries for the CAE homepage.
 */

import {
  pressImageKeys,
  type PressImageKey,
} from "./images.ts";

/**
 * One press outlet logo in the scrolling marquee.
 */
export type PressLogo = {
  readonly id: string;
  readonly name: string;
  readonly alt: string;
  readonly title: string;
  /** Logical image key resolved by {@link getHomeImage}. */
  readonly imageKey: PressImageKey;
};

/**
 * Press strip heading and logo set (marquee duplicates this list for seamless scroll).
 */
export const homePress = {
  heading: "Featured On:",
  logos: [
    {
      id: "ap",
      name: "Associated Press",
      alt: "APNews Logo",
      title: "Featured in Associated Press",
      imageKey: "pressAp",
    },
    {
      id: "newsbreak",
      name: "Newsbreak",
      alt: "Newsbreak Logo",
      title: "Featured in Newsbreak",
      imageKey: "pressNewsbreak",
    },
    {
      id: "digital-journal",
      name: "Digital Journal",
      alt: "DigitalJournal Logo",
      title: "Featured in Digital Journal",
      imageKey: "pressDigitalJournal",
    },
    {
      id: "prime-time",
      name: "Prime Time Press",
      alt: "PrimeTimePress Logo",
      title: "Featured in Prime Time Press",
      imageKey: "pressPrimeTime",
    },
    {
      id: "ceo-times",
      name: "CEO Times",
      alt: "CEOTimes Logo",
      title: "Featured in CEO Times",
      imageKey: "pressCeoTimes",
    },
    {
      id: "ny-review",
      name: "NY Review",
      alt: "NYReview Logo",
      title: "Featured in NY Review",
      imageKey: "pressNyReview",
    },
    {
      id: "womens-insider",
      name: "Women's Insider",
      alt: "WomensInsider Logo",
      title: "Featured in Women's Insider",
      imageKey: "pressWomensInsider",
    },
    {
      id: "usa-news",
      name: "USA News",
      alt: "USANews Logo",
      title: "Featured in USA News",
      imageKey: "pressUsaNews",
    },
  ] as const satisfies readonly PressLogo[],
} as const;

/** Shape of {@link homePress}. */
export type HomePress = typeof homePress;

/**
 * Narrows an unknown value to a known press marquee image key.
 *
 * @param value - Candidate image key
 * @returns True when value is one of {@link pressImageKeys}
 */
export function isPressImageKey(value: unknown): value is PressImageKey {
  return (
    typeof value === "string" &&
    (pressImageKeys as ReadonlyArray<string>).includes(value)
  );
}
