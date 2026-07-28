/**

 * @fileoverview Dr Jasmine site identity — keep in sync with Supabase `sites` row for slug `dr-jasmine`.

 */



/**

 * Public social profile URLs exposed in site chrome (v1: no phone/email).

 */

export type SiteSocialLinks = {

  /** Instagram profile URL. */

  instagram: string;

  /** LinkedIn profile URL. */

  linkedin: string;

};



/**

 * Code-side description of a deployable brand module.

 */

export type SiteConfig = {

  /** URL and folder slug, e.g. `"dr-jasmine"`. */

  slug: string;

  /**

   * Supabase `sites.id` UUID.

   * Locked for Dr Jasmine per implementation plan T1.

   */

  projectId: string;

  /** Human-readable brand name. */

  name: string;

  /** Production hostnames that map to this site (no protocol). */

  domains: readonly string[];

  /** When false, site exists but is not registered for routing yet. */

  enabled: boolean;

  /**

   * Live GHL register / join funnel URL for landing CTAs

   * (`Secure My Seat` → starts at `/register`, redirects to join page).

   */

  registerUrl: string;

  /** Primary nav and hero CTA label for the free workshop funnel. */

  ctaLabel: string;

  /** Public social profile URLs for footer and chrome. */

  social: SiteSocialLinks;

};



/**

 * Dr Jasmine brand configuration.

 */

export const drJasmineSiteConfig = {

  slug: "dr-jasmine",

  projectId: "00000000-0000-4000-8000-000000000002",

  name: "Dr Jasmine",

  /** Local gateway hosts; production SEO origin is `PUBLIC_SITE_ORIGIN` / doctorjasmine.com. */

  domains: ["dr-jasmine.localhost", "doctorjasmine.com", "www.doctorjasmine.com"],

  enabled: true,

  /** Production seat-registration funnel (GHL). All workshop CTAs use this URL. */
  registerUrl: "https://doctorjasmine.com/register",

  /** Primary nav / marketing CTA label (opens GHL `registerUrl`). */
  ctaLabel: "Join free workshop",

  social: {

    instagram: "https://www.instagram.com/drjasminechiew/",

    linkedin:

      "https://www.linkedin.com/in/jasmine-chiew-glider2626?originalSubdomain=my",

  },

} as const satisfies SiteConfig;


