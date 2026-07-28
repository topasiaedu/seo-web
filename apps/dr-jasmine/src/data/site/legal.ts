/**
 * @fileoverview Legal and medical disclaimer copy for footer and workshop pages.
 * Adapted from GHL `disclaimer.html`; educational tone, no outcome guarantees.
 */

/** Legal strings consumed by site footer and workshop conversion page. */
export type LegalCopy = {
  /** Short disclaimer for public site footer (T3). */
  readonly footerDisclaimer: string;
  /** Full medical / liability disclaimer for workshop registration (T8). */
  readonly workshopMedicalDisclaimer: string;
};

/**
 * Disclaimer copy for footer chrome and the workshop page.
 */
export const legal: LegalCopy = {
  footerDisclaimer:
    "Educational content only, not medical advice. Individual results vary. Consult a qualified healthcare professional before changing medication, diet, exercise, or any treatment plan.",
  workshopMedicalDisclaimer: [
    "Copyright 2025 | Dr Jasmine | Terms & Conditions",
    "",
    "This site is not a part of the YouTube, Google, or Facebook website; Google Inc. or Facebook Inc. Additionally, this site is NOT endorsed by YouTube, Google, or Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc. YOUTUBE is a trademark of GOOGLE Inc.",
    "",
    "This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.",
    "",
    "We do not and cannot make any guarantees about your ability to achieve specific health results using our ideas, information, tools, or strategies. What we can guarantee is your satisfaction with our training and educational materials. You should understand that nothing on this page, any of our websites, or within our content or curriculum is a promise or guarantee of specific medical outcomes. Any medical services provided are based on professional judgment and individual assessment, and results will vary from person to person. Any examples, testimonials, or case studies shared are illustrative of individual experiences and should not be considered typical results, average results, or guarantees of future outcomes. Always consult a qualified healthcare professional before making any changes to your medication, diet, exercise, or treatment plan. Do not discontinue or adjust any prescribed medication without proper medical supervision. You alone are responsible and accountable for your decisions, actions, and results, and by registering here you agree not to hold us liable for any decisions, actions, or outcomes at any time, under any circumstance.",
  ].join("\n"),
} as const;
