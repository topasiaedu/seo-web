/**
 * @fileoverview Workshop discover + closing CTA copy from GHL `main-body.html` / `closing-cta.html`.
 * Verbatim LDP strings; used on the home page (CTAs open GHL `registerUrl`).
 */

/** One "you'll discover" bullet from the GHL LDP. */
export type WorkshopDiscoverItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
};

/** Workshop / home funnel copy from the registration LDP. */
export type WorkshopCopy = {
  /** Section heading above discover bullets. */
  readonly discoverHeading: string;
  readonly discoverItems: readonly WorkshopDiscoverItem[];
  /** Closing CTA band from GHL `closing-cta.html`. */
  readonly closingCta: {
    readonly heading: string;
    readonly body: readonly string[];
  };
};

/**
 * Exact copy from GHL main-body and closing-cta fragments.
 */
export const workshopCopy: WorkshopCopy = {
  discoverHeading: "On this FREE session, you'll discover:",
  discoverItems: [
    {
      id: "hidden-factor",
      title:
        "Why your blood sugar stays high even when you take your pills and \"eat healthy\":",
      description:
        "I'll show you the one factor your doctor never explained, and once you know it, you'll finally understand how to fix it.",
    },
    {
      id: "medications-limit",
      title: "Why Medications Alone Can't Reverse Your Diabetes:",
      description:
        "How to fix the root cause instead, so you can reduce or eliminate pills rather than adding more every year.",
    },
    {
      id: "food-clarity",
      title: "Never Worry About What's Safe to Eat Again:",
      description:
        "How to identify exactly what's secretly spiking your blood sugar (and what isn't) - so food choices become effortless, not anxiety-filled.",
    },
    {
      id: "case-studies",
      title: "PLUS - Real Case Studies To Prove It Works:",
      description:
        "See how people in their 40s, 50s and 60s began seeing measurable improvements within their first few months, some even reducing their medication under proper supervision — same struggles you have, completely different outcome.",
    },
  ],
  closingCta: {
    heading: "YOU CAN TAKE CONTROL AGAIN",
    body: [
      "They told you diabetes is for life. That you'll need more pills as you age. That complications are inevitable. But that's not the full story.",
      "Your body is more responsive than you've been led to believe. You just haven't been shown the right approach that targets the real root drivers. This session will show you how to identify them.",
    ],
  },
} as const;
