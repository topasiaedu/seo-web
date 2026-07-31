/**
 * @fileoverview Patient-first About page copy for Dr Jasmine.
 * Facts sourced from LinkedIn / GHL credentials; rewritten for patients (not corporate About).
 */

/** One bullet in the "who it's for" fit lists. */
export type AboutFitItem = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Short punchy title for the visual grid. */
  readonly title: string;
  /** Supporting line under the title. */
  readonly label: string;
};

/** About page marketing copy module. */
export type AboutCopy = {
  /** Document title (before site name suffix handling). */
  readonly metaTitle: string;
  /** Meta description. */
  readonly metaDescription: string;
  /** Hero H1 brand-level name signal. */
  readonly heroName: string;
  /** One-line clinical role under the name. */
  readonly heroRole: string;
  /** Short supporting sentence under the role. */
  readonly heroSupport: string;
  /** Story section eyebrow. */
  readonly storyEyebrow: string;
  /** Story section heading. */
  readonly storyHeading: string;
  /** Story body paragraphs. */
  readonly storyParagraphs: readonly string[];
  /** Credentials section heading. */
  readonly credentialsHeading: string;
  /** Education line shown above GHL credential bullets (LinkedIn). */
  readonly educationLabel: string;
  /** Short secondary trust facts shown under the credential grid. */
  readonly secondaryFactItems: readonly string[];
  /** Approach section heading. */
  readonly approachHeading: string;
  /** Approach lede above the three pillars. */
  readonly approachLede: string;
  /** Who-it's-for section heading. */
  readonly fitHeading: string;
  /** Audience bullets. */
  readonly fitGood: readonly AboutFitItem[];
  /** Closing CTA heading. */
  readonly ctaHeading: string;
  /** Closing CTA support sentence. */
  readonly ctaLede: string;
  /** Home Meet band link label to this page. */
  readonly readFullStoryLabel: string;
};

/**
 * Locked v1 About copy from the About page content plan.
 */
export const aboutCopy: AboutCopy = {
  metaTitle: "About Dr Jasmine Chiew",
  metaDescription:
    "Meet Dr Jasmine Chiew, a Kuala Lumpur clinician helping adults with Type 2 diabetes and metabolic health address insulin resistance at the root.",
  heroName: "Dr Jasmine Chiew",
  heroRole: "Diabetes reversal & metabolic health clinician",
  heroSupport:
    "Helps working adults stabilize blood sugar by fixing insulin resistance at the root, so more medication isn't treated as the only path.",
  storyEyebrow: "About",
  storyHeading: "Medicine that looks past the next prescription",
  storyParagraphs: [
    "Dr Jasmine Chiew is a medical doctor based in Kuala Lumpur who specializes in lifestyle medicine for Type 2 diabetes, obesity, and hypertension.",
    "After years of the familiar path (diagnose, prescribe, raise the dose), she focused on what many patients never hear in a short clinic visit: Type 2 diabetes is a metabolic condition driven largely by insulin resistance, and with the right framework many people can improve numbers, energy, and medication burden under proper medical supervision.",
    "Her work combines conventional medical training with root-cause assessment, including frameworks she calls the Metabolic Health Diagnostic and RootCause Assessment Model, so care plans emphasize nutrition, movement, stress management, and support, not miracle supplements or extreme diets.",
  ],
  credentialsHeading: "Training & trust signals",
  educationLabel: "MBBS, Manipal University College Malaysia",
  secondaryFactItems: [
    "HRDC-accredited trainer",
    "300+ workshops & keynotes",
    "Based in Kuala Lumpur",
  ],
  approachHeading: "How she works",
  approachLede:
    "A simple clinical sequence: find what's driving the spike, fix the root drivers, then steady the numbers with habits that last.",
  fitHeading: "Who this is for",
  fitGood: [
    {
      id: "type2-prediabetes",
      title: "Type 2 or prediabetes",
      label: "Living with Type 2 diabetes or prediabetes and ready for a clearer path.",
    },
    {
      id: "stuck",
      title: "Stuck on the usual advice",
      label: "Tried medication or lifestyle tweaks and still feel stuck with your numbers.",
    },
    {
      id: "root-cause",
      title: "Root-cause focused",
      label: "Want a plan that targets insulin resistance, not another supplement stack.",
    },
    {
      id: "virtual",
      title: "Virtual and ready",
      label: "Can join a virtual workshop or education path from where you are.",
    },
  ],
  ctaHeading: "Start with the free workshop",
  ctaLede:
    "Learn the framework she uses with patients, then decide if a deeper program is right for you.",
  readFullStoryLabel: "Read full story",
} as const;
