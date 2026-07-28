/**
 * @fileoverview Three-pillar program framework: Find trigger / Fix driver / Steady numbers.
 * Derived from LDP hero promise and discover-session themes.
 */

/** Stable pillar slug used in anchors and layout keys. */
export type PillarId = "find-trigger" | "fix-driver" | "steady-numbers";

/** One educational pillar in the Dr Jasmine approach. */
export type Pillar = {
  readonly id: PillarId;
  /** Display title (sentence case). */
  readonly title: string;
  /** One- or two-sentence explainer for cards and program pages. */
  readonly blurb: string;
};

/**
 * Core three-pillar framework for home and workshop pages.
 */
export const pillars: readonly Pillar[] = [
  {
    id: "find-trigger",
    title: "Find the trigger",
    blurb:
      "Identify what is driving blood sugar swings beyond medication and generic diet advice, so patterns finally make sense.",
  },
  {
    id: "fix-driver",
    title: "Fix the driver",
    blurb:
      "Address underlying metabolic drivers with practical steps, rather than adding more pills year after year.",
  },
  {
    id: "steady-numbers",
    title: "Steady the numbers",
    blurb:
      "Build sustainable habits and tracking routines that support more predictable readings over time.",
  },
] as const;
