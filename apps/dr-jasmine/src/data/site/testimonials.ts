/**
 * @fileoverview Patient testimonials from GHL `testimonials.html` (verbatim quotes).
 */

/** One testimonial card for home or workshop proof sections. */
export type Testimonial = {
  /** Stable id for list keys. */
  readonly id: string;
  readonly name: string;
  /** Program line under the name (GHL). */
  readonly program: string;
  /** Plain-text quote from the LDP carousel. */
  readonly quote: string;
  /** When true, surface on the home proof band. */
  readonly homeFeatured: boolean;
};

/**
 * Exact testimonials from GHL `testimonials.html`.
 * `homeFeatured` marks the three shown on the home page (first three in LDP order).
 */
export const testimonials: readonly Testimonial[] = [
  {
    id: "sharlene",
    name: "Sharlene",
    program: "Reversing Diabetes Program",
    quote:
      "First and foremost, I wish to thank Dr. Jasmine for her guidance in helping me through 'not-an-easy' journey achieving this awesome results:- 1. Successfully reversed Diabetes- HbA1c reduced from 6.5% to 5.3% 2. 4 years of hypertension reversed (removal of 1 medication) 3. 14 years of fatty liver reversed successfully Too happy for words in achieving a clean bill of health and indeed valuable gift to close for 2024 !!!",
    homeFeatured: true,
  },
  {
    id: "gemma-ng",
    name: "Gemma Ng",
    program: "Reversing Diabetes Program",
    quote:
      "I had better health and could reverse my diabetic. Previously I was with the following: 1. 21 years of diabetes -HbA1c reduced from 9.0% to 5.7% (removal of 2 medications) 2. 8 years of hypertension successfully reversed - removal of 1 medication 3. Body weight reduced from 64 kg to 52 kg (total loss 12 kg) From this programme, I was able to learn how to take care of my diabetic from zero knowledge to where I am now. Thank you Dr Jasmine and may peace be with you under God's blessing.",
    homeFeatured: true,
  },
  {
    id: "ronald-arai",
    name: "Ronald Arai",
    program: "Reversing Diabetes Program",
    quote:
      "My name is Ronald and I am 73 years old. I have been a diabetic for the last 28 years and I have CKD stage 4. I have been prescribed with insulin, Trajentra, high blood medication and statin. Even with all these medications my condition never improved. My life changed after I met Dr. Jasmine. To let you know what RDP did for me : Hypertension reversed. No longer needing insulin and other medications. No more numbness over hands and feet. Lost weight from 63kg to 52kg. eGFR from 24 to 37. a1c from 8 to 10 to 6.7 I would like to thank Dr. Jasmine for guiding and giving me the encouragement to what I am now. FREE FROM MEDICATIONS. Thank you so very much Dr. Jasmine.",
    homeFeatured: true,
  },
  {
    id: "raj-misir",
    name: "Raj Misir",
    program: "Reversing Diabetes Program",
    quote:
      "1. I have Successfully reversed 20 years of diabetes- HbA1c reduced from 6.8% to 5.5% (removal of 2 medications) 2. I have Successfully reversed 20 years of hypertension (removal of 3 medications) 3. My eGFR improved from 62 to 70 4. My Body weight reduced from 75 kg to 61 kg (total loss 14 kg) 5. I do not feel so bloated anymore, felt more energetic Thank you Dr Jasmine for the shared knowledge and guidance to change my lifestyle.",
    homeFeatured: false,
  },
  {
    id: "hock-meng",
    name: "Hock Meng",
    program: "Reversing Diabetes Program",
    quote:
      "It's a life changing experience to have sign up with Dr Jasmine with this Diabetes Reversal program. My eGFR has improved from 59 Stage 3 to 79 Stage 2 . I do not have to take hypertension pill anymore. My blood pressure is always below 110/70. My Blood Sugar 2 hrs after food has even gone down below 6. All in all it's worth every ringgit I paid for this program and I sincerely encourage anyone with diabetes to sign up for this Diabetes Reversal Program. I have reduced taking medication from 9 types, to just 1 my blood thinning tablet. Sign up now, follow the program closely and success is waiting at the door!",
    homeFeatured: false,
  },
  {
    id: "jass-tan",
    name: "Jass Tan",
    program: "Reversing Diabetes Program",
    quote:
      "I started this program last year May 2023 and for the first time in my life i managed to slim down. Wearing clothing 4XL and down to M size. Drop from 84 kg to 68 kg. I feel so good. No need take any medication for diabetes, high blood pressure, cholesterol, painkillers and few type of supplements. My health improves tremendously, no more knees and back pain, sleep well, looks younger, skin is fairer, lots of energy, can walk faster......a good well being. I am most grateful to Dr Jasmine for her advice and guidance. Thank you",
    homeFeatured: false,
  },
  {
    id: "matthew-yusin",
    name: "Matthew Yusin",
    program: "Reversing Diabetes Program",
    quote:
      "I was diagnosed with diabetes in November. For two years, I asked my GP to delay my medication, as I was in denial about my condition. Despite my efforts to reduce sugar intake, exercise more, and take supplements, my blood sugar levels remained high. Everything changed when I started my journey with Dr. Jasmine guided me through my RDP, and after ten months, I am no longer in the diabetic range. My blood sugar levels have dropped to a healthy level, and I've also lost weight. My results: HbA1c reduced from 7.4% to 5.7%. Weight loss from 75kg to 61kg (a total loss of 14kg). Numbness in hands and feet improved by 90%. I am incredibly grateful to Dr. Jasmine for her motivation and patience. Thanks to her, I achieved my desired results. To Dr. Jasmine, please continue to reach out to more diabetic patients and help them achieve a better life without diabetes.",
    homeFeatured: false,
  },
] as const;

/**
 * Returns testimonials flagged for the home proof section.
 *
 * @returns Readonly list where {@link Testimonial.homeFeatured} is true
 */
export function homeFeaturedTestimonials(): readonly Testimonial[] {
  return testimonials.filter((entry) => entry.homeFeatured);
}
