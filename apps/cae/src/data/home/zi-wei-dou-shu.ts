/**
 * @fileoverview Structured copy for `/cae/zi-wei-dou-shu/` —
 * educational "What is Zi Wei Dou Shu" marketing page.
 */

import { assertHomeHref, type HomeHref } from "./nav.ts";

/**
 * One of the twelve life palaces on a Zi Wei Dou Shu chart.
 */
export type ZwdsPalace = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Chinese name (Han characters). */
  readonly chinese: string;
  /** English palace label. */
  readonly label: string;
  /** One-line domain summary. */
  readonly domain: string;
};

/**
 * One major star highlight for educational scanning.
 */
export type ZwdsMajorStar = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Chinese name. */
  readonly chinese: string;
  /** English / common name. */
  readonly label: string;
  /** Short interpretive note (not a full reading). */
  readonly essence: string;
};

/**
 * One of the two traditional major-star series (紫微 / 天府).
 */
export type ZwdsStarSeries = {
  /** Stable id for list keys and form names. */
  readonly id: string;
  /** Series name in Chinese. */
  readonly chinese: string;
  /** Orbitron eyebrow (Northern / Southern court). */
  readonly eyebrow: string;
  /** Short English series title. */
  readonly heading: string;
  /** One-line series framing. */
  readonly lede: string;
  /** Ordered major-star ids belonging to this series. */
  readonly starIds: readonly string[];
};

/**
 * One contrast row in the ZWDS vs BaZi section.
 */
export type ZwdsComparePoint = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Aspect being compared. */
  readonly aspect: string;
  /** Zi Wei Dou Shu side. */
  readonly zwds: string;
  /** BaZi / Four Pillars side. */
  readonly bazi: string;
};

/**
 * One step in how a chart is built / used.
 */
export type ZwdsProcessStep = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Step index label (01, 02…). */
  readonly index: string;
  /** Step title. */
  readonly title: string;
  /** Supporting body. */
  readonly body: string;
};

/**
 * One of the Four Transformations (四化 / Si Hua).
 * CSS color identity is applied via `id` (`--cae-sihua-*` tokens).
 */
export type ZwdsTransform = {
  /** Stable id matching CSS modifier (`lu` | `quan` | `ke` | `ji`). */
  readonly id: "lu" | "quan" | "ke" | "ji";
  /** Chinese label (e.g. 化祿). */
  readonly chinese: string;
  /** Romanized / English name (e.g. Hua Lu). */
  readonly label: string;
  /** Short meaning for the seal chip. */
  readonly meaning: string;
};

/**
 * One FAQ entry for the educational page + JSON-LD FAQPage.
 */
export type ZwdsFaqItem = {
  /** Stable id for list keys. */
  readonly id: string;
  /** Question text. */
  readonly question: string;
  /** Answer text. */
  readonly answer: string;
};

/**
 * Full marketing copy module for the Zi Wei Dou Shu explainer page.
 */
export type ZiWeiDouShuCopy = {
  readonly heroEyebrow: string;
  readonly heroTitle: string;
  readonly heroSupport: string;
  readonly meaningEyebrow: string;
  readonly meaningHeading: string;
  readonly meaningLede: string;
  readonly meaningBody: readonly string[];
  readonly originEyebrow: string;
  readonly originHeading: string;
  readonly originLede: string;
  readonly originBody: readonly string[];
  readonly chartEyebrow: string;
  readonly chartHeading: string;
  readonly chartLede: string;
  readonly processSteps: readonly ZwdsProcessStep[];
  readonly palacesEyebrow: string;
  readonly palacesHeading: string;
  readonly palacesLede: string;
  readonly palaces: readonly ZwdsPalace[];
  readonly starsEyebrow: string;
  readonly starsHeading: string;
  readonly starsLede: string;
  readonly majorStars: readonly ZwdsMajorStar[];
  readonly starSeries: readonly ZwdsStarSeries[];
  readonly timingEyebrow: string;
  readonly timingHeading: string;
  readonly timingLede: string;
  readonly transforms: readonly ZwdsTransform[];
  readonly timingBody: readonly string[];
  readonly compareEyebrow: string;
  readonly compareHeading: string;
  readonly compareLede: string;
  readonly comparePoints: readonly ZwdsComparePoint[];
  readonly caeEyebrow: string;
  readonly caeHeading: string;
  readonly caeLede: string;
  readonly caeBody: readonly string[];
  readonly faqEyebrow: string;
  readonly faqHeading: string;
  readonly faqItems: readonly ZwdsFaqItem[];
  readonly ctaHeading: string;
  readonly ctaLede: string;
  readonly ctaPrimaryVisible: boolean;
  readonly ctaPrimaryLabel: string;
  readonly ctaPrimaryHref: HomeHref;
  readonly ctaSecondaryLabel: string;
  readonly ctaSecondaryHref: HomeHref;
  readonly ctaTertiaryLabel: string;
  readonly ctaTertiaryHref: HomeHref;
};

/**
 * Research-backed educational copy framed for CAE's strategy audience.
 * Historical attributions follow common lineage accounts (Chen Tuan / Song era);
 * interpretive framing matches CAE's anti-fear, decision-system positioning.
 */
export const ziWeiDouShuCopy = {
  heroEyebrow: "Purple Star Astrology · 紫微斗數",
  heroTitle: "What is Zi Wei Dou Shu?",
  heroSupport:
    "An imperial Chinese destiny map — twelve life palaces, a court of stars, and timing you can use for real decisions.",

  meaningEyebrow: "The name",
  meaningHeading: "Purple Star. Calculation of the heavens.",
  meaningLede:
    "Zi Wei Dou Shu (紫微斗數) is often translated as Purple Star Astrology. The name is a clue to how the system thinks.",
  meaningBody: [
    "Zi Wei (紫微) is the Purple Star — the Emperor Star that anchors the chart. In classical Chinese astronomy it evokes the Purple Forbidden Enclosure around the north celestial pole: the still center the heavens appear to turn around.",
    "Dou Shu (斗數) means calculation of the stars. Together, the name describes a method that places symbolic stars into a structured chart so you can read life domains with precision — not as vague mood, but as a map.",
    "It is one of the two most widely practised systems of Chinese natal astrology, alongside the Four Pillars of Destiny (BaZi). Where BaZi often reads elemental timing, Zi Wei Dou Shu reads space: which palace holds which influence, and what that means for career, wealth, love, and direction.",
  ],

  originEyebrow: "Lineage",
  originHeading: "Born in the court of the stars",
  originLede:
    "Tradition places the system with Daoist sage Chen Tuan in the Song dynasty era — an imperial art refined for questions that demanded precision.",
  originBody: [
    "Zi Wei Dou Shu is traditionally attributed to Chen Tuan (陳摶), a semi-legendary Daoist scholar and hermit of the late Five Dynasties and early Song period (around the 10th century). Whether he was sole creator or a key transmitter, the system crystallised in a Song-era synthesis of Daoist cosmology, stellar observation, and numerological calculation.",
    "Its deeper foundations — Heavenly Stems and Earthly Branches, the Five Phases, yin-yang theory, and celestial enclosures — reach back to Han dynasty Chinese cosmology. The Purple Forbidden Enclosure (紫微垣) that gives the system its name was already a mapped region of the sky.",
    "For centuries the method stayed close to elite and court contexts. That history is why it still carries an \"imperial art\" reputation in Chinese-speaking communities — valued for palace-by-palace detail on succession, appointment, alliance, and fate. Taiwan and Hong Kong remain major homes of living lineages today.",
  ],

  chartEyebrow: "The chart",
  chartHeading: "How a Purple Star chart is built",
  chartLede:
    "Your birth year, month, day, and hour — read through the Chinese lunar-solar calendar — become a twelve-palace map seeded with stars.",
  processSteps: [
    {
      id: "birth-data",
      index: "01",
      title: "Birth data",
      body: "Year, month, day, and hour of birth are converted into the Chinese calendar framework that the system calculates from.",
    },
    {
      id: "emperor",
      index: "02",
      title: "Place the Emperor",
      body: "Calculations locate Zi Wei, the Purple Star. From that anchor, the remaining stars are distributed across the twelve palaces by fixed formulas.",
    },
    {
      id: "palaces",
      index: "03",
      title: "Read the palaces",
      body: "Each palace governs a life domain. The stars inside it — bright or dim, supported or challenged — describe how that domain tends to express.",
    },
    {
      id: "timing",
      index: "04",
      title: "Layer timing",
      body: "Decade and annual cycles, plus the Four Transformations, show when a palace activates — so strategy can match the season you are in.",
    },
  ] as const satisfies readonly ZwdsProcessStep[],

  palacesEyebrow: "Twelve palaces",
  palacesHeading: "A map of twelve life domains",
  palacesLede:
    "Every chart is a square of twelve palaces. Together they cover the full field of a life — self, wealth, career, relationships, and the networks around you.",
  palaces: [
    {
      id: "ming",
      chinese: "命宮",
      label: "Life / Self",
      domain: "Core nature, presence, and life direction.",
    },
    {
      id: "xiongdi",
      chinese: "兄弟",
      label: "Siblings",
      domain: "Peers, siblings, and close allies.",
    },
    {
      id: "fuqi",
      chinese: "夫妻",
      label: "Spouse",
      domain: "Partnership, marriage, and intimate bond.",
    },
    {
      id: "zinü",
      chinese: "子女",
      label: "Children",
      domain: "Descendants, creativity, and what you birth.",
    },
    {
      id: "caibo",
      chinese: "財帛",
      label: "Wealth",
      domain: "Money patterns, assets, and resource flow.",
    },
    {
      id: "ji",
      chinese: "疾厄",
      label: "Health",
      domain: "Body, stress load, and recovery needs.",
    },
    {
      id: "qianyi",
      chinese: "遷移",
      label: "Travel",
      domain: "Movement, relocation, and outer world.",
    },
    {
      id: "puyou",
      chinese: "交友",
      label: "Friends / Network",
      domain: "Teams, clients, and social capital.",
    },
    {
      id: "guanlu",
      chinese: "官祿",
      label: "Career",
      domain: "Work, status, and vocation path.",
    },
    {
      id: "tianzhai",
      chinese: "田宅",
      label: "Property",
      domain: "Home, real estate, and foundations.",
    },
    {
      id: "fude",
      chinese: "福德",
      label: "Fortune / Spirit",
      domain: "Inner peace, mindset, and life satisfaction.",
    },
    {
      id: "fumu",
      chinese: "父母",
      label: "Parents",
      domain: "Elders, authority figures, and lineage.",
    },
  ] as const satisfies readonly ZwdsPalace[],

  starsEyebrow: "The star court",
  starsHeading: "Fourteen major stars lead the chart",
  starsLede:
    "Over a hundred named stars can appear, but fourteen major stars carry the primary weight. They form two imperial series — Zi Wei and Tian Fu — that shape how authority, resources, and change show up. None is purely \"good\" or \"bad\" — brightness, palace, and company decide how a star speaks.",
  majorStars: [
    {
      id: "ziwei",
      chinese: "紫微",
      label: "Zi Wei · Emperor",
      essence: "Authority, dignity, and central command of the chart.",
    },
    {
      id: "tianji",
      chinese: "天機",
      label: "Tian Ji · Strategist",
      essence: "Analysis, planning, and restless intelligence.",
    },
    {
      id: "taiyang",
      chinese: "太陽",
      label: "Tai Yang · Sun",
      essence: "Visibility, generosity, and outward leadership.",
    },
    {
      id: "wuqu",
      chinese: "武曲",
      label: "Wu Qu · Martial Wealth",
      essence: "Drive, discipline, and hard-won results.",
    },
    {
      id: "tiantong",
      chinese: "天同",
      label: "Tian Tong · Blessing",
      essence: "Ease, pleasure, and the need for wise comfort.",
    },
    {
      id: "lianzhen",
      chinese: "廉貞",
      label: "Lian Zhen · Integrity",
      essence: "Intensity, principles, and sharp edges that cut both ways.",
    },
    {
      id: "tianfu",
      chinese: "天府",
      label: "Tian Fu · Treasury",
      essence: "Stability, stewardship, and protective resource sense.",
    },
    {
      id: "taiyin",
      chinese: "太陰",
      label: "Tai Yin · Moon",
      essence: "Sensitivity, receptivity, and quiet influence.",
    },
    {
      id: "tanlang",
      chinese: "貪狼",
      label: "Tan Lang · Desire",
      essence: "Ambition, charm, and appetite for experience.",
    },
    {
      id: "jumen",
      chinese: "巨門",
      label: "Ju Men · Giant Gate",
      essence: "Communication, debate, and exacting scrutiny.",
    },
    {
      id: "tianxiang",
      chinese: "天相",
      label: "Tian Xiang · Seal",
      essence: "Support, mediation, and careful protocol.",
    },
    {
      id: "tianliang",
      chinese: "天梁",
      label: "Tian Liang · Bridge",
      essence: "Protection, mentorship, and timely relief.",
    },
    {
      id: "qisha",
      chinese: "七殺",
      label: "Qi Sha · Seven Killings",
      essence: "Drive, rupture, and decisive force under pressure.",
    },
    {
      id: "pojun",
      chinese: "破軍",
      label: "Po Jun · Broken Army",
      essence: "Change, breakthrough, and constructive upheaval.",
    },
  ] as const satisfies readonly ZwdsMajorStar[],
  starSeries: [
    {
      id: "ziwei-series",
      chinese: "紫微星系",
      eyebrow: "Northern court",
      heading: "Zi Wei series",
      lede: "Six stars of command, intellect, and principled force — anchored by the Emperor.",
      starIds: ["ziwei", "tianji", "taiyang", "wuqu", "tiantong", "lianzhen"],
    },
    {
      id: "tianfu-series",
      chinese: "天府星系",
      eyebrow: "Southern court",
      heading: "Tian Fu series",
      lede: "Eight stars of treasury, bonds, appetite, and transformation — anchored by the Treasury.",
      starIds: [
        "tianfu",
        "taiyin",
        "tanlang",
        "jumen",
        "tianxiang",
        "tianliang",
        "qisha",
        "pojun",
      ],
    },
  ] as const satisfies readonly ZwdsStarSeries[],

  timingEyebrow: "Timing",
  timingHeading: "Four Transformations unlock the season",
  timingLede:
    "A natal chart shows structure. Transformations show motion — which stars activate for wealth, power, recognition, or friction in a given cycle.",
  transforms: [
    {
      id: "lu",
      chinese: "化祿",
      label: "Hua Lu",
      meaning: "Prosperity / flow",
    },
    {
      id: "quan",
      chinese: "化權",
      label: "Hua Quan",
      meaning: "Authority / power",
    },
    {
      id: "ke",
      chinese: "化科",
      label: "Hua Ke",
      meaning: "Reputation / fame",
    },
    {
      id: "ji",
      chinese: "化忌",
      label: "Hua Ji",
      meaning: "Pressure / friction",
    },
  ] as const satisfies readonly ZwdsTransform[],
  timingBody: [
    "Each Heavenly Stem can trigger four star transformations: Hua Lu (prosperity / flow), Hua Quan (authority / power), Hua Ke (reputation / recognition), and Hua Ji (obstruction / pressure). These are among the most dynamic levers in Zi Wei Dou Shu.",
    "Stars also carry brightness levels — from brilliant (Miao) to trapped (Xian). A bright star tends to deliver its gifts more cleanly; a dim star may express the same archetype through friction or delay.",
    "Decade (Da Xian) and annual layers then show which palace is \"on stage.\" That is where strategy becomes practical: expand when the career palace is supported; protect bandwidth when health timing is loud; choose partnership seasons with eyes open.",
  ],

  compareEyebrow: "ZWDS × BaZi",
  compareHeading: "Space versus elemental time",
  compareLede:
    "Both are serious Chinese destiny systems. They answer different questions — and many strategists use them together.",
  comparePoints: [
    {
      id: "focus",
      aspect: "Primary lens",
      zwds: "Twelve palaces — where in life an influence sits",
      bazi: "Four Pillars — elemental balance and day-master dynamics",
    },
    {
      id: "grain",
      aspect: "Granularity",
      zwds: "Domain-specific: career vs wealth vs spouse vs network",
      bazi: "Timing-rich cycles of strength, clash, and opportunity",
    },
    {
      id: "use",
      aspect: "Best used for",
      zwds: "Pinpointing which life area to lead, wait, or redesign",
      bazi: "Reading personal energy seasons and elemental strategy",
    },
  ] as const satisfies readonly ZwdsComparePoint[],

  caeEyebrow: "How CAE uses it",
  caeHeading: "A decision system — not fear-based fortune-telling",
  caeLede:
    "Cae Goh reads Purple Star as a Predictable Destiny System for business owners, entrepreneurs, and high performers.",
  caeBody: [
    "The chart is a blueprint of strengths, patterns, and leverage points. The work is matching that blueprint to the decisions you actually face — wealth moves, career timing, partnerships, health bandwidth, and long-game direction.",
    "You do not leave with superstition. You leave with clearer judgment under pressure: where to lead, where to wait, and how to align choices with the path already written in your chart.",
  ],

  faqEyebrow: "FAQ",
  faqHeading: "Common questions",
  faqItems: [
    {
      id: "need-hour",
      question: "Do I need my exact birth hour?",
      answer:
        "Hour accuracy improves palace placement and timing. If the hour is uncertain, a skilled reader can still work with ranges and cross-checks — but the more precise the birth data, the sharper the map.",
    },
    {
      id: "fixed-fate",
      question: "Does Zi Wei Dou Shu mean my fate is fixed?",
      answer:
        "The chart describes tendencies, timing, and leverage — not a script that removes choice. CAE's approach treats Purple Star as decision intelligence: see the pattern, then choose with clearer timing.",
    },
    {
      id: "vs-western",
      question: "How is this different from Western astrology?",
      answer:
        "Zi Wei Dou Shu uses a twelve-palace chart seeded from Chinese calendar calculations and a large catalog of named symbolic stars. It is a distinct Chinese metaphysical system, not a translation of sun-sign astrology.",
    },
    {
      id: "who-for",
      question: "Who is this for?",
      answer:
        "People who already carry real decisions — business owners, entrepreneurs, and high performers who want strategy and timing over vague or fear-based readings.",
    },
  ] as const satisfies readonly ZwdsFaqItem[],

  ctaHeading: "Ready to see your chart as strategy?",
  ctaLede:
    "Explore how Cae Goh turns Purple Star timing into clearer decisions — or go deeper in the blog.",
  ctaPrimaryVisible: false,
  ctaPrimaryLabel: "BOOK A CALL WITH OUR TEAM",
  ctaPrimaryHref: assertHomeHref("https://caegoh.com/home-page-4444"),
  ctaSecondaryLabel: "MEET CAE GOH",
  ctaSecondaryHref: assertHomeHref("/about/"),
  ctaTertiaryLabel: "READ THE BLOG",
  ctaTertiaryHref: assertHomeHref("/blog/"),
} as const satisfies ZiWeiDouShuCopy;

/** Shape of {@link ziWeiDouShuCopy}. */
export type ZiWeiDouShuPageCopy = typeof ziWeiDouShuCopy;
