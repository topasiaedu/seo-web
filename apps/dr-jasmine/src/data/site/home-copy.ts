/**
 * @fileoverview Home hero copy taken verbatim from GHL `hero.html`.
 * Do not invent marketing lines for the public home page.
 */

/** Hero messaging for the native home page (GHL LDP only). */
export type HomeCopy = {
  /** Eyebrow above the headline (GHL). */
  readonly eyebrow: string;
  /** Primary headline (GHL H1). */
  readonly headline: string;
  /** Supporting sentence beneath the headline (GHL). */
  readonly subhead: string;
};

/**
 * Exact hero strings from GHL fragment `hero.html`.
 */
export const homeCopy: HomeCopy = {
  eyebrow: "FREE LIVE WORKSHOP",
  headline:
    "Finally: A Clear, Step-By-Step Way To Stabilize Your Blood Sugar — Find The Trigger, Fix The Driver, Steady The Numbers... Without Adding More Medication.",
  subhead:
    "And Used by Regular People Just Like You — Without Strict Diets, Confusing Rules, or Feeling Deprived",
} as const;
