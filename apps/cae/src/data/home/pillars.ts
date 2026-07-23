/**
 * @fileoverview Brand pillars and Ancient Wisdom band for the CAE homepage.
 * GHL Consultations / Academy / Speaking bar has no icons — text only.
 */

import type { HomeImageKey } from "./images.ts";

/**
 * One brand pillar (Consultations / Academy / Speaking).
 */
export type PillarItem = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

/**
 * Pillars row plus the Ancient Wisdom / global vision band.
 */
export const homePillars = {
  items: [
    {
      id: "consultations",
      title: "Consultations",
      body: "1-on-1 blueprint decoding",
    },
    {
      id: "academy",
      title: "Academy",
      body: "Step by step destiny decoding",
    },
    {
      id: "speaking",
      title: "Speaking",
      body: "Life strategy insights for every audience",
    },
  ] as const satisfies readonly PillarItem[],
  wisdom: {
    headline: "Ancient Wisdom, Global Vision",
    subhead: "Not fortune-telling. Real systems. GLOBAL LEVEL.",
    collageAlt: "Photo collage of Cae networking with guests at a professional event",
    collageTitle: "Global community connections",
    /** Logical image key resolved by {@link getHomeImage}. */
    collageImageKey: "pillarsCollage" satisfies HomeImageKey,
  },
} as const;

/** Shape of {@link homePillars}. */
export type HomePillars = typeof homePillars;
