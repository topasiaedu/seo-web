/**
 * @fileoverview Meet Dr Jasmine credential bullets from GHL `main-body.html`.
 * Labels are verbatim from the LDP; no invented detail lines.
 */

/** One credential bullet shown in Meet Dr Jasmine sections. */
export type CredentialItem = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Exact GHL bullet text. */
  readonly label: string;
};

/**
 * Exact Meet Dr. Jasmine bullets from GHL `main-body.html`.
 */
export const credentials: readonly CredentialItem[] = [
  {
    id: "researcher",
    label:
      "Published researcher on metabolic health in the International Journal of Obesity",
  },
  {
    id: "experience",
    label: "Over a decade of experience",
  },
  {
    id: "patients",
    label: "Helped 1,000+ diabetics reverse their condition naturally",
  },
  {
    id: "countries",
    label:
      "Trusted by patients from Singapore, Australia, Malaysia, Brunei, UK, USA, and beyond",
  },
] as const;
