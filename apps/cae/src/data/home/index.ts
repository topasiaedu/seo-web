/**
 * @fileoverview Barrel re-exports for CAE homepage data modules.
 */

export {
  homeMeta,
  requireMetaString,
  type HomeMeta,
} from "./meta.ts";

export {
  assertHomeHref,
  homeNav,
  type HomeHref,
  type HomeNav,
  type NavLink,
} from "./nav.ts";

export {
  homeHero,
  type HomeHero,
} from "./hero.ts";

export {
  homePress,
  isPressImageKey,
  type HomePress,
  type PressLogo,
} from "./press.ts";

export {
  homeOfferings,
  type HomeOfferings,
  type OfferingCard,
} from "./offerings.ts";

export {
  homePillars,
  type HomePillars,
  type PillarItem,
} from "./pillars.ts";

export {
  homePlatform,
  type HomePlatform,
  type PlatformRhythmItem,
} from "./platform.ts";

export {
  homeTestimonials,
  isValidStarRating,
  type CarouselReview,
  type HomeTestimonials,
  type StaticTestimonial,
} from "./testimonials.ts";

export {
  homeCta,
  type HomeCta,
  type SocialLink,
} from "./cta.ts";

export {
  getHomeImage,
  homeImages,
  isHomeImageKey,
  pressImageKeys,
  type HomeImageAsset,
  type HomeImageKey,
  type PressImageKey,
} from "./images.ts";
