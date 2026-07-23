/**
 * @fileoverview Testimonials: member headline, static quotes, and carousel reviews.
 * Static cards use `testimonialPortrait1`–`3`; carousel reviews drive the dual-layer scroller.
 */

import type { HomeImageKey } from "./images.ts";

/**
 * Static featured quote shown above the scrolling carousel
 * (circular portrait + quote + detail + gold stars).
 */
export type StaticTestimonial = {
  readonly id: string;
  readonly quote: string;
  readonly detail: string;
  readonly portraitAlt: string;
  readonly portraitTitle: string;
  /** Logical image key resolved by {@link getHomeImage}. */
  readonly portraitImageKey: HomeImageKey;
};

/**
 * Carousel review entry (name, age, industry, stars, body).
 */
export type CarouselReview = {
  readonly name: string;
  readonly age: number;
  readonly industry: string;
  readonly review: string;
  readonly stars: number;
};

/**
 * Success-stories / recommendations section content.
 */
export const homeTestimonials = {
  sectionId: "success-stories",
  membersHeadline: "1,250+ WORLDWIDE HAPPY MEMBERS",
  recommendationsHeadline: "WHY OTHERS RECOMMEND US",
  starsAlt: "Five-star rating",
  starsTitle: "Five-star reviews",
  staticQuotes: [
    {
      id: "quote-1",
      quote: "Loved everything so far",
      detail:
        "Used their Personal Destiny Analysis and Yearly Forecasting. Surprisingly spot-on insights that really helped me navigate some tough decisions. Highly recommend!",
      portraitAlt: "Portrait of a smiling woman with long dark hair",
      portraitTitle: "Client recommendation",
      portraitImageKey: "testimonialPortrait1",
    },
    {
      id: "quote-2",
      quote: "My life changed forever",
      detail:
        "I've explored various astrologers before, but the yearly forecasting and compatibility readings here are surprisingly spot-on. Worth considering if you're into that sort of thing.",
      portraitAlt: "Portrait of a smiling woman in a white sleeveless top",
      portraitTitle: "Client recommendation",
      portraitImageKey: "testimonialPortrait2",
    },
    {
      id: "quote-3",
      quote: "Highly recommend this",
      detail:
        "After trying a few astrology consults, her insight towards Business Strategic really stood out. Precise, useful insights for my startup's key decisions.",
      portraitAlt: "Portrait of a smiling man in a white t-shirt",
      portraitTitle: "Client recommendation",
      portraitImageKey: "testimonialPortrait3",
    },
  ] as const satisfies readonly StaticTestimonial[],
  /**
   * Scrolling carousel reviews originally ported from the retired GHL testimonial carousel script.
   */
  carouselReviews: [
    {
      name: "Nicole",
      age: 29,
      industry: "E-commerce",
      review:
        "Before this session, I kept pivoting every few months. After decoding my chart, I realized I was chasing a path that wasn't meant for me. I now run a business that feels effortless and I'm finally seeing consistent income.",
      stars: 5,
    },
    {
      name: "Darren",
      age: 34,
      industry: "Marketing",
      review:
        "This gave me more clarity than any coach ever has. I stopped applying for random jobs, and started building a path that fits me exactly.",
      stars: 5,
    },
    {
      name: "Amanda",
      age: 27,
      industry: "Graphic Design",
      review:
        "Within a week of applying what I learned, I turned down two bad fit clients and landed one that paid double, because I finally knew what aligned with my energy.",
      stars: 5,
    },
    {
      name: "Kelvin",
      age: 32,
      industry: "Insurance Agent",
      review:
        "I always thought I had a 'money block.' Turns out, I just had the wrong timing. Once I saw my chart, I stopped self-sabotaging and became the top sales of the month.",
      stars: 5,
    },
    {
      name: "Joanne",
      age: 41,
      industry: "Healthcare",
      review:
        "This wasn't just about business. It helped me fix my focus, plan long-term, and stop feeling like I was behind. I finally feel like I'm building something that lasts.",
      stars: 5,
    },
    {
      name: "Joshua",
      age: 36,
      industry: "Education",
      review:
        "My colleague noticed it first 'You're clearer. Sharper.' I'm leading with more confidence because I'm no longer doubting every decision.",
      stars: 5,
    },
    {
      name: "Michelle",
      age: 31,
      industry: "Technology",
      review:
        "For years I worked hard but felt stuck. Now I know why. This chart showed me exactly how I'm wired to succeed — and it changed everything.",
      stars: 5,
    },
    {
      name: "KS",
      age: 28,
      industry: "Engineer",
      review:
        "After finding my own strengths through the chart, I received a high salary offer from a big company and they wanted me to start immediately. Originally, I thought I'd take a few months to rest but within just 2 weeks, I landed the job with a salary jump from RM4K to RM8K.",
      stars: 5,
    },
    {
      name: "Elaine",
      age: 38,
      industry: "Real Estate",
      review:
        "Before this, I was stuck underpaid and overworked. After realigning my timing and energy, I finally dared to ask for what I was worth and got a 40% raise in one shot.",
      stars: 5,
    },
    {
      name: "Jason",
      age: 43,
      industry: "Consulting",
      review:
        "At first, I didn't really believe the health warning mentioned in my chart — it felt too 'coincidental.' But just a few weeks later, I was diagnosed with an early-stage condition exactly in the area pointed out. Thanks to that early headsup, I could take action quickly and prevent it from getting worse.",
      stars: 5,
    },
  ] as const satisfies readonly CarouselReview[],
} as const;

/** Shape of {@link homeTestimonials}. */
export type HomeTestimonials = typeof homeTestimonials;

/**
 * Validates a carousel review star count is a positive finite number.
 *
 * @param value - Candidate star rating
 * @returns True when value is a finite number greater than zero
 */
export function isValidStarRating(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
