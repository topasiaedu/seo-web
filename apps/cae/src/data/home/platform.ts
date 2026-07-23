/**
 * @fileoverview Platform mastery section: Daily / Weekly / Monthly rhythm.
 * Copy and image keys match the caegoh.com GHL funnel Platform band.
 */

import type { HomeImageKey } from "./images.ts";

/**
 * One cadence item in the platform section.
 */
export type PlatformRhythmItem = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly iconAlt: string;
  readonly iconTitle: string;
  /** Logical image key resolved by {@link getHomeImage}. */
  readonly iconImageKey: HomeImageKey;
};

/**
 * "#1 Platform" copy, app visual slot, and Daily / Weekly / Monthly items.
 * Layout: left `platformApp` mockup, right rhythm list with icon keys.
 */
export const homePlatform = {
  headline: "#1 PLATFORM FOR DESTINY CHART MASTERY",
  lead: "Unlock hidden patterns, level up your life, and achieve clarity every step of the way.",
  appAlt: "CAE Zi Wei Dou Shu mobile app dashboard on a phone",
  appTitle: "The CAE app",
  /** Phone/app mockup slot — resolved by {@link getHomeImage}. */
  appImageKey: "platformApp" satisfies HomeImageKey,
  rhythm: [
    {
      id: "daily",
      title: "DAILY READING",
      body: "Track chart. Spot hidden patterns.",
      iconAlt: "Glowing heart icon for daily reading",
      iconTitle: "Track your chart and spot patterns",
      iconImageKey: "platformDaily",
    },
    {
      id: "weekly",
      title: "WEEKLY LEARNING",
      body: "Push yourself further with weekly guidance.",
      iconAlt: "Analytics icon with chart and notification badge",
      iconTitle: "Weekly guidance",
      iconImageKey: "platformWeekly",
    },
    {
      id: "monthly",
      title: "MONTHLY REFLECTION",
      body: "Track your progress. Celebrate your monthly milestones.",
      iconAlt: "Glowing star icon for monthly reflection",
      iconTitle: "Monthly progress and milestones",
      iconImageKey: "platformMonthly",
    },
  ] as const satisfies readonly PlatformRhythmItem[],
} as const;

/** Shape of {@link homePlatform}. */
export type HomePlatform = typeof homePlatform;
