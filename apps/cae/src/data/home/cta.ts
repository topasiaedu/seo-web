/**
 * @fileoverview Connect, social, live-event, and closing CTA copy for the CAE homepage.
 * Funnel destination URLs are intentional — do not retarget without product sign-off.
 */

import type { HomeImageKey } from "./images.ts";
import { assertHomeHref, type HomeHref } from "./nav.ts";

/**
 * Social network link shown under "Connect with me".
 */
export type SocialLink = {
  readonly id: string;
  readonly label: string;
  readonly href: HomeHref;
  readonly iconAlt: string;
  readonly iconTitle: string;
  /** Logical image key resolved by {@link getHomeImage}. */
  readonly iconImageKey: HomeImageKey;
};

/**
 * Bottom-of-page connect / event / book-call CTAs and footer line.
 * Layout: Connect + socials, then stacked free-event and book-call panels.
 * External funnel URLs are preserved from the live GHL capture.
 */
export const homeCta = {
  connectHeadline: "CONNECT WITH ME",
  social: [
    {
      id: "instagram",
      label: "Instagram",
      href: assertHomeHref("https://www.instagram.com/caegoh/"),
      iconAlt: "Instagram",
      iconTitle: "Follow Cae on Instagram",
      iconImageKey: "socialInstagram",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: assertHomeHref("https://www.facebook.com/caegoh"),
      iconAlt: "Facebook",
      iconTitle: "Follow Cae on Facebook",
      iconImageKey: "socialFacebook",
    },
  ] as const satisfies readonly SocialLink[],
  liveEvent: {
    eyebrow: "JOIN THE NEXT LIVE PREDICTABLE DESTINY VIRTUAL EVENT",
    headline:
      "Built for high-performers ready to move with precision. DISCOVER YOUR WEALTH ARCHETYPE and See your NEXT 10-Year WEALTH Cycle.",
    lead: "Get a front-row seat to CAE's signature decoding experience",
    ctaLabel: "JOIN THE NEXT FREE EVENT",
    /** Live GHL free-event funnel — keep destination. */
    ctaHref: assertHomeHref("https://predictabledestiny.com/now"),
  },
  closing: {
    eyebrow: "ONLY FOR SERIOUS HIGH PERFORMERS",
    headline:
      "With limited spots available each month, we ensure every consultation is deep, personalized, and impactful.",
    services:
      "Personalized Destiny and Life Analysis, Relationship Compatibility Insights, Annual Astrological Forecasting, Business Astrological Strategy Consulting",
    ctaLabel: "BOOK A CALL WITH OUR TEAM",
    /** Live GHL book-call funnel — keep destination. */
    ctaHref: assertHomeHref("https://caegoh.com/home-page-4444"),
  },
  footer: {
    /** Short line under the logo in the site footer. */
    tagline: "Zi Wei Dou Shu consulting for clarity, timing, and destiny.",
    /** Visible copyright mark (year kept current in the footer component). */
    copyrightName: "CaeGoh™",
    termsLabel: "Terms & Conditions",
    termsHref: assertHomeHref("https://caegoh.com/"),
    exploreHeading: "Explore",
    connectHeading: "Connect",
  },
} as const;

/** Shape of {@link homeCta}. */
export type HomeCta = typeof homeCta;
