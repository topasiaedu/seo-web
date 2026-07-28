/**
 * @fileoverview Frequently asked questions from GHL `faq.html` (verbatim).
 */

/** One FAQ entry for accordion pages and JSON-LD. */
export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

/**
 * Exact FAQ copy from GHL `faq.html`.
 */
export const faqs: readonly FaqItem[] = [
  {
    question: "I'm already on medication. Is this still relevant for me?",
    answer:
      "Yes. Many attendees are already on medication but still struggle with unstable numbers. This session focuses on identifying the hidden drivers behind those fluctuations, so you can make more informed decisions moving forward.",
  },
  {
    question: "I've had diabetes for many years, will this still help?",
    answer:
      "Yes. Many patients had been managing diabetes for 10, 20 even 30 years before seeing meaningful improvements once the underlying drivers were addressed. Duration doesn't automatically mean it's permanent.",
  },
  {
    question: "Is this going to be complicated or hard to understand?",
    answer:
      "This session is designed for everyday people. Everything will be broken down into simple, practical steps, so you can better understand what may be influencing your condition... without needing technical knowledge.",
  },
  {
    question: "Where will this event take place?",
    answer:
      "This is a fully virtual event. You can join from anywhere using your tablet or computer with an internet connection.",
  },
  {
    question: "Will there be a replay?",
    answer:
      "This is a live-only session because we'll be breaking down real scenarios and answering questions in real time. It's designed to be interactive, not passive content. Recordings are easy to postpone and rarely lead to action. If your condition has been fluctuating, this isn't something to delay.",
  },
] as const;
