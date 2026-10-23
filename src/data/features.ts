/**
 * The /features content, transcribed verbatim from the supplied kit:
 * `Edgecipline_Premium_Features_Page_Prompt_Assets/Edgecipline_Premium_Features_Page_Kit/docs/SOURCE_FEATURE_CONTENT.md`
 *
 * Nothing here is paraphrased, shortened or embellished: the page is a
 * presentation layer over this file, so the copy stays the single source of
 * truth and the owner can diff it against the source document.
 *
 * The `id` of each feature is a published deep link (`/features#screenshot`
 * and friends) and must not be renamed.
 */

/** The four narrative groups, in source order. */
export type GroupId = "capture" | "understand" | "habits" | "consistent";

/**
 * Anchor id of each feature. Doubles as the key for its visual treatment —
 * one per feature on purpose, since the brief asks for variety rather than
 * fourteen identical two-column cards.
 */
export type FeatureId =
  | "screenshot"
  | "dual-market"
  | "journal"
  | "trading-dna"
  | "psychology"
  | "risk-patterns"
  | "self-awareness"
  | "analytics"
  | "missions"
  | "ai-coach"
  | "reports"
  | "checklists"
  | "android"
  | "performance-review";

export type Feature = {
  /** Two-digit index as shown in the source. */
  number: string;
  /** Anchor id — a published deep link. */
  id: FeatureId;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  /** The source's "What you get" bullets. */
  benefits: readonly string[];
  group: GroupId;
  /** Extra search terms for the explorer, beyond the title itself. */
  keywords: readonly string[];
};

export type Group = {
  id: GroupId;
  /** Group heading, as specified in the brief. */
  title: string;
  /** One editorial line introducing the group. Written for the page. */
  intro: string;
};

export const groups: readonly Group[] = [
  {
    id: "capture",
    title: "Capture your trades",
    intro: "Getting the data in has to be effortless, or the habit never survives week one.",
  },
  {
    id: "understand",
    title: "Understand your patterns",
    intro: "Once the history exists, the behaviour inside it can be measured — and priced.",
  },
  {
    id: "habits",
    title: "Build better habits",
    intro: "Knowing the pattern is not the same as changing it. This is the part that changes it.",
  },
  {
    id: "consistent",
    title: "Stay consistent anywhere",
    intro: "On the phone you actually trade from, and over the months that actually matter.",
  },
] as const;

/** The real waitlist target already on the site: the final CTA on the home page. */
export const WAITLIST_HREF = "/#waitlist";

export const features: readonly Feature[] = [
  {
    number: "01",
    id: "screenshot",
    title: "AI Screenshot Extraction",
    tagline: "Screenshot. That’s it.",
    problem:
      "Manual trade entry is the #1 reason traders quit journaling. Spreadsheets, forms, manual typing — all of it kills the habit before it starts.",
    solution:
      "Take a screenshot of your trade terminal after any trade. A three-layer AI pipeline (Gemini Vision, Google Cloud Vision, and an OCR fallback) reads it automatically — extracting pair, direction, entry, exit, P&L, lot size, time, and more. No typing. No friction.",
    benefits: [
      "Works with 20+ Forex and Indian broker platforms",
      "Extracts single or multiple trades from one screenshot",
      "Supports MT5, NIFTY, BANKNIFTY, options, futures, and equity",
      "No manual data entry — ever",
    ],
    group: "capture",
    keywords: ["ocr", "gemini", "vision", "import", "upload", "extraction", "terminal"],
  },
  {
    number: "02",
    id: "dual-market",
    title: "Forex & Indian Market Modes",
    tagline: "Built for two markets, not a generic one.",
    problem:
      "Most journals are built for one market and bolt everything else on as an afterthought. Forex pip math and Indian F&O fields like strike price, expiry, and lot size need completely different handling.",
    solution:
      "Edgecipline runs two dedicated modes — Forex (MT5, with MT4 and cTrader planned) and Indian Market (NIFTY, BANKNIFTY, options, intraday equity) — each with its own journal, analytics, currency labels, and screenshot extraction tuned to that market’s brokers.",
    benefits: [
      "Separate Forex and Indian market journals and analytics",
      "Broker auto-detection from your screenshot",
      "Zerodha, Upstox, Angel One, Dhan, Groww, Fyers, 5paisa, and more",
      "Pips vs. rupees, lots vs. lot size — labels adapt automatically",
    ],
    group: "capture",
    keywords: ["forex", "india", "nifty", "banknifty", "options", "pips", "rupees", "broker", "f&o"],
  },
  {
    number: "03",
    id: "journal",
    title: "Trading Journal",
    tagline: "Your entire trading history, organized.",
    problem:
      "Most traders have scattered trade records — some on a broker console, some on a spreadsheet, some in chat screenshots. There’s no single source of truth.",
    solution:
      "Edgecipline becomes your single trading history. Every trade, with full context — setup tags, emotional state, rule adherence, and behavioral notes — all searchable and organized.",
    benefits: [
      "Unlimited trade history stored securely",
      "Filter by instrument, setup, emotion, outcome",
      "Attach setup tags and psychology notes",
      "Searchable, exportable, forever yours",
    ],
    group: "capture",
    keywords: ["history", "search", "filter", "tags", "notes", "export"],
  },
  {
    number: "04",
    id: "trading-dna",
    title: "Trading DNA & Pattern Detection",
    tagline: "Discover your repeatable edge.",
    problem:
      "Every trader has a unique set of conditions where they perform best. Most never find them — they trade every session and setup equally, diluting the edge they actually have.",
    solution:
      "Trading DNA analyzes your trades by session, mood, setup, and instrument to find exactly when you’re at your best. The Pattern Detection Engine goes further, surfacing combinations — like ‘London + Confident + Breakout’ — that carry a real, repeatable win-rate edge.",
    benefits: [
      "Session, mood, and instrument breakdown of your edge",
      "Combination pattern detection (session + mood + setup)",
      "Shareable public DNA report link",
      "Full history of past DNA profiles as you evolve",
    ],
    group: "understand",
    keywords: ["edge", "session", "mood", "setup", "pattern", "london", "breakout", "dna"],
  },
  {
    number: "05",
    id: "psychology",
    title: "Psychology Cost Calculator",
    tagline: "A real dollar figure for every emotional trade.",
    problem:
      "You know emotional trading is hurting you. But you can’t see the patterns because you don’t have the data. ‘I trade emotionally sometimes’ is not actionable.",
    solution:
      "Tag each trade with your emotional state: calm, confident, anxious, revenge, FOMO, greed. Edgecipline groups every trade by emotion and mistake tag, then calculates the exact P&L cost of each behavior — down to the rupee or pip.",
    benefits: [
      "Win rate and total cost by emotional trigger",
      "Mistake cost breakdown (no stop loss, chased price, overleveraged)",
      "Detect revenge trading and FOMO patterns automatically",
      "Emotion vs. P&L correlation over time",
    ],
    group: "understand",
    keywords: ["emotion", "fomo", "revenge", "greed", "cost", "mistake", "calm", "anxious"],
  },
  {
    number: "06",
    id: "risk-patterns",
    title: "Risk Pattern Detection",
    tagline: "Catch tilt spirals before they blow up your account.",
    problem:
      "A single bad trade isn’t a pattern. But three losses in a row every Monday, or sizing up after a win streak — those are dangerous patterns most traders never notice until the damage is done.",
    solution:
      "Edgecipline scans your trade history for repeated loss clusters, tilt spirals, and size-escalation patterns, then suggests a concrete rule to stop each one before it repeats.",
    benefits: [
      "Tilt spiral detection (trades taken within minutes of a loss)",
      "Day-of-week and time-of-day loss clustering",
      "Size escalation after win-streak detection",
      "Specific rule suggestions for each pattern found",
    ],
    group: "understand",
    keywords: ["risk", "tilt", "spiral", "loss", "cluster", "sizing", "rules", "monday"],
  },
  {
    number: "07",
    id: "self-awareness",
    title: "Self-Awareness Score",
    tagline: "How well do you actually know yourself?",
    problem:
      "Traders who rate themselves highly but trade with poor discipline are the most dangerous kind — they never see the gap between their self-image and their real behavior.",
    solution:
      "After every trade, you mark whether you’d retake it. Edgecipline compares that self-review to the actual outcome, flagging ‘bad process, good luck’ wins — the trades most likely to reinforce bad habits.",
    benefits: [
      "Review calibration matrix (self-review vs. actual outcome)",
      "Flags dangerous ‘won for the wrong reason’ trades",
      "Plan adherence percentage and most-broken rule",
      "Adherence-vs-win-rate correlation",
    ],
    group: "understand",
    keywords: ["calibration", "review", "discipline", "adherence", "self-image", "process"],
  },
  {
    number: "08",
    id: "analytics",
    title: "Behavior & Performance Analytics",
    tagline: "Every metric that actually matters.",
    problem:
      "Broker consoles show P&L and basic stats. They don’t show win rate by setup, time-of-day performance, drawdown recovery, or how discipline correlates with results.",
    solution:
      "Edgecipline’s analytics dashboard covers every dimension: setup performance, time-of-day win rates, R:R distribution, drawdown analysis, Sharpe ratio, profit factor, and a calendar P&L heatmap — cached for instant load even with years of history.",
    benefits: [
      "Win rate and P&L by setup, session, and instrument",
      "Maximum drawdown and recovery tracking",
      "Calendar P&L heatmap and equity curve",
      "Advanced metrics: Sharpe ratio, profit factor, streaks",
    ],
    group: "understand",
    keywords: ["analytics", "drawdown", "sharpe", "profit factor", "heatmap", "equity", "r:r"],
  },
  {
    number: "09",
    id: "missions",
    title: "Missions & Streaks",
    tagline: "Gamified discipline you can’t ignore.",
    problem:
      "Knowing what to fix and actually building the habit are two different problems. Most traders know their weaknesses and still don’t change their behavior day to day.",
    solution:
      "Edgecipline’s AI recommends specific missions targeting your identified weaknesses — like avoiding emotional trades for 7 days — while a streak system rewards consistent journaling with milestone celebrations and streak-at-risk alerts.",
    benefits: [
      "AI-recommended missions based on your behavior profile",
      "Up to 3 active missions with measurable progress targets",
      "Daily streak tracking with milestone notifications",
      "Streak protector grace period so one missed day doesn’t reset you",
    ],
    group: "habits",
    keywords: ["missions", "streak", "gamified", "habit", "milestone", "protector"],
  },
  {
    number: "10",
    id: "ai-coach",
    title: "AI Coach & Morning Mentor",
    tagline: "The coach that knows your actual history.",
    problem:
      "Generic trading coaches give generic advice. ‘Control your emotions.’ ‘Follow your rules.’ This advice is correct and useless without your specific behavioral data.",
    solution:
      "Edgecipline’s AI Coach has access to your full trading history and answers with observation, evidence, and a specific recommended action. Every morning at 6am, the Morning Mentor sends a personalized message referencing your actual streak, mistakes, and mission progress.",
    benefits: [
      "Personalized to your actual trading data, not generic tips",
      "Daily 6am Morning Mentor push notification",
      "Specific, actionable recommendations with expected P&L impact",
      "Full conversation history for continuity",
    ],
    group: "habits",
    keywords: ["coach", "mentor", "morning", "observation", "evidence", "action", "6am"],
  },
  {
    number: "11",
    id: "reports",
    title: "Weekly AI Reports",
    tagline: "Your personal trading coach, every Sunday.",
    problem:
      "Even if you journal, you have to review it yourself — and you’ll see the patterns you want to see, not the ones that are actually there. Confirmation bias makes self-review unreliable.",
    solution:
      "Every week, Edgecipline’s AI generates a personalized coaching report: what worked, what didn’t, your biggest behavioral patterns, and one specific improvement focus for next week.",
    benefits: [
      "Delivered every Sunday, with a daily reminder to review it",
      "Personalized to your actual trade data",
      "One clear improvement focus per week — not a wall of stats",
      "Full report archive to track week-over-week change",
    ],
    group: "habits",
    keywords: ["weekly", "report", "sunday", "archive", "review", "focus", "bias"],
  },
  {
    number: "12",
    id: "checklists",
    title: "Setup Checklists",
    tagline: "Rules you can’t ignore.",
    problem:
      "You have trading rules. You break them. Not because you forgot them — because there’s no system that forces you to verify them before entering a trade.",
    solution:
      "Build custom pre-trade checklists for each setup strategy. Before you enter a trade, verify every condition. Every checklist completion is logged, so you can see exactly how rule adherence predicts your outcomes.",
    benefits: [
      "Custom checklist per setup or strategy",
      "Pre-trade rule verification, available on Android from the notification shade",
      "Logged adherence tracking per trade",
      "Correlate rule adherence with win rate",
    ],
    group: "habits",
    keywords: ["checklist", "rules", "pre-trade", "verification", "adherence", "strategy"],
  },
  {
    number: "13",
    id: "android",
    title: "Native Android App",
    tagline: "Journal from the phone you already trade on.",
    problem:
      "Most traders review and log trades from their phone, not a desktop. A mobile-unfriendly journal just doesn’t get used.",
    solution:
      "Edgecipline ships as a native Android app with camera and gallery screenshot upload, push notifications for streaks and the morning mentor, and an interactive checklist notification you can complete without opening the app.",
    benefits: [
      "Native camera/gallery screenshot upload",
      "Push notifications for missions, streaks, and the morning mentor",
      "Full dashboard, journal, analytics, and Trading DNA on mobile",
      "Bottom navigation built for one-handed use",
    ],
    group: "consistent",
    keywords: ["android", "mobile", "phone", "camera", "gallery", "notifications", "app"],
  },
  {
    number: "14",
    id: "performance-review",
    title: "Discipline & Psychology Timeline",
    tagline: "See if you’re actually improving.",
    problem:
      "Most traders don’t do structured reviews — and when they do, they only look at P&L. This misses the behavioral dimension that usually improves weeks before the P&L does.",
    solution:
      "The Psychology Timeline plots your psychology score, discipline percentage, average mood, and monthly P&L on one chart, so you can see discipline improvements translate into better results over time.",
    benefits: [
      "Psychology score, discipline %, and mood trend by month",
      "P&L overlaid to show the lag between behavior and results",
      "Repeated mistakes ranked by frequency and cost",
      "Discipline trend history on a dedicated page",
    ],
    group: "consistent",
    keywords: ["timeline", "psychology", "discipline", "mood", "monthly", "trend", "review"],
  },
] as const;

/** The four editorial pills under the hero. They map onto the four groups. */
export const pills = [
  { label: "Capture", group: "capture" },
  { label: "Understand", group: "understand" },
  { label: "Improve", group: "habits" },
  { label: "Review", group: "consistent" },
] as const satisfies readonly { label: string; group: GroupId }[];

export function featuresInGroup(group: GroupId) {
  return features.filter((feature) => feature.group === group);
}
