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
  /** Slug of a related blog article, linked under the benefits. */
  article?: string;
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
    article: "ai-in-trading-journals",
    title: "AI Screenshot Extraction",
    tagline: "Screenshot, review, save.",
    problem:
      "Typing every trade into a spreadsheet or form is slow, and a slow routine is easy to abandon before the habit forms.",
    solution:
      "Take a screenshot of your trade terminal after any trade. Edgecipline’s AI reads it and extracts details such as pair, direction, entry, exit, P&L, lot size and time. You review and correct the details before saving, and add your own psychology notes.",
    benefits: [
      "Works with screenshots from Forex platforms and Indian brokers",
      "Extracts single or multiple trades from one screenshot",
      "Supports MT5, NIFTY, BANKNIFTY, options and equity",
      "Review and correct every extracted field before saving",
    ],
    group: "capture",
    keywords: ["ocr", "gemini", "vision", "import", "upload", "extraction", "terminal"],
  },
  {
    number: "02",
    id: "dual-market",
    article: "nifty-banknifty-trading-psychology",
    title: "Forex & Indian Market Modes",
    tagline: "Built for two markets, not a generic one.",
    problem:
      "Forex pip math and Indian F&O fields like strike price, expiry and lot size need different handling, and mixing them in one generic journal makes both harder to review.",
    solution:
      "Edgecipline runs two dedicated modes — Forex (MT5) and Indian Market (NIFTY, BANKNIFTY, options, intraday equity) — each with its own journal, analytics, currency labels, and screenshot extraction tuned to that market’s brokers.",
    benefits: [
      "Separate Forex and Indian market journals and analytics",
      "Choose your broker for Indian screenshots so the AI reads them correctly",
      "Zerodha, Upstox, Angel One, Dhan, Groww, Fyers, 5paisa, and more",
      "Pips vs. rupees, lots vs. lot size — labels adapt automatically",
    ],
    group: "capture",
    keywords: ["forex", "india", "nifty", "banknifty", "options", "pips", "rupees", "broker", "f&o"],
  },
  {
    number: "03",
    id: "journal",
    article: "how-to-build-a-trading-journal-habit",
    title: "Trading Journal",
    tagline: "Your trading history, organized.",
    problem:
      "Most traders have scattered trade records — some on a broker console, some on a spreadsheet, some in chat screenshots. There’s no single source of truth.",
    solution:
      "Edgecipline becomes your single trading history. Every trade, with full context — setup tags, emotional state, rule adherence, and behavioral notes — all searchable and organized.",
    benefits: [
      "Your trade history in one place",
      "Filter by date, instrument, setup, session and result",
      "Attach setup tags and psychology notes",
      "Searchable, and kept when a paid plan ends",
    ],
    group: "capture",
    keywords: ["history", "search", "filter", "tags", "notes", "export"],
  },
  {
    number: "04",
    id: "trading-dna",
    article: "what-is-trading-dna",
    title: "Trading DNA & Pattern Detection",
    tagline: "Find the conditions where you trade best.",
    problem:
      "Your results may differ by session, setup, mood and instrument, but those differences are hard to see without organized records.",
    solution:
      "Trading DNA analyzes your trades by session, mood, setup and instrument to show your strengths, your weaknesses, your best setup and your best session. Pattern detection looks for habits such as losing after a win, overtrading or tilt. Insights unlock as enough trades are recorded.",
    benefits: [
      "Session, mood, setup and instrument breakdown of your results",
      "Strengths, weaknesses, best setup and best session",
      "Shareable Trading DNA card",
      "Insights unlock as your trade history grows",
    ],
    group: "understand",
    keywords: ["edge", "session", "mood", "setup", "pattern", "london", "breakout", "dna"],
  },
  {
    number: "05",
    id: "psychology",
    title: "Psychology Cost Calculator",
    tagline: "The P&L behind each emotion you tag.",
    problem:
      "You may suspect emotional trading is hurting your results, but without data it is hard to know which emotions matter. ‘I trade emotionally sometimes’ is not actionable.",
    solution:
      "Tag each trade with your emotional state: calm, confident, anxious, revenge, FOMO, greed. Edgecipline groups your trades by emotion and mistake tag and totals the P&L of each group, so you can see what trades taken in each state have produced. It shows outcomes for your tagged trades; it does not prove that an emotion caused them.",
    benefits: [
      "Win rate and total P&L by emotion tag",
      "P&L by mistake tag, such as no stop loss or chased price",
      "Flags trades that look like revenge trading",
      "How mood, confidence and emotions relate to your results",
    ],
    group: "understand",
    keywords: ["emotion", "fomo", "revenge", "greed", "cost", "mistake", "calm", "anxious"],
  },
  {
    number: "06",
    id: "risk-patterns",
    article: "risk-management-for-retail-traders",
    title: "Risk Pattern Detection",
    tagline: "Spot risky patterns in your trading history.",
    problem:
      "A single bad trade isn’t a pattern. But repeated losses on the same day of the week, or trading more after a loss, are patterns that are easy to miss until they have cost you.",
    solution:
      "Edgecipline looks through your trade history for patterns such as losing after a win, overtrading and tilt, and warns when your trades look like revenge trading. The AI coach feed suggests next actions for you to review.",
    benefits: [
      "Tilt and revenge-trading detection",
      "Session and time-of-day analysis",
      "Overtrading and losing-after-a-win patterns",
      "Coaching cues and next actions to review",
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
      "It is easy to remember trades as better planned than they were, and that gap between self-image and behavior is hard to see without records.",
    solution:
      "After each trade you can record your entry basis, your mood, a lesson and whether you would retake it. The Self-Awareness Score measures how honestly and completely you record your psychology, and your setup score shows how many of your own rules you followed.",
    benefits: [
      "A score based on how completely you record your psychology",
      "Would-retake and lesson fields on every trade",
      "Setup score: the share of your rules you followed",
      "Rule-following shown alongside your results",
    ],
    group: "understand",
    keywords: ["calibration", "review", "discipline", "adherence", "self-image", "process"],
  },
  {
    number: "08",
    id: "analytics",
    title: "Behavior & Performance Analytics",
    tagline: "The numbers behind your trading.",
    problem:
      "Broker consoles show P&L and basic stats, but they rarely show win rate by setup, performance by session, or how your discipline lines up with your results.",
    solution:
      "Edgecipline’s analytics cover setup and strategy performance, session and time-of-day results, best and worst instruments, risk:reward, drawdowns, weekly P&L and a calendar of green and red days. Analytics are cached so pages open quickly.",
    benefits: [
      "Win rate and P&L by setup, session, and instrument",
      "Drawdown view of your losing periods",
      "Calendar P&L heatmap and equity curve",
      "Risk:reward breakdown and weekly P&L",
    ],
    group: "understand",
    keywords: ["analytics", "drawdown", "sharpe", "profit factor", "heatmap", "equity", "r:r"],
  },
  {
    number: "09",
    id: "missions",
    title: "Missions & Streaks",
    tagline: "Small goals that build consistency.",
    problem:
      "Knowing what to fix and actually building the habit are two different problems. Most traders know their weaknesses and still don’t change their behavior day to day.",
    solution:
      "Edgecipline recommends missions that fit your current weaknesses, such as going a set period without revenge trades, and tracks progress automatically from your trades. Streaks track consistent journaling and discipline.",
    benefits: [
      "Mission suggestions based on your current weaknesses",
      "A progress bar and status for each active mission",
      "Journal, discipline and best-streak tracking",
      "Reminders after a missed journal day",
    ],
    group: "habits",
    keywords: ["missions", "streak", "gamified", "habit", "milestone", "protector"],
  },
  {
    number: "10",
    id: "ai-coach",
    title: "AI Coach & Morning Mentor",
    tagline: "Coaching based on your own records.",
    problem:
      "Generic trading advice — ‘control your emotions,’ ‘follow your rules’ — is correct but hard to act on without your own behavioral data.",
    solution:
      "Ask the AI Coach about your trading and it answers using your journal data, including your recent trades. A coach feed adds coaching cues and next actions, and each morning the Morning Mentor sends a short message to help you set your focus for the day.",
    benefits: [
      "Answers based on your own journal data",
      "A short Morning Mentor message each morning",
      "A feed of coaching cues and next actions",
      "Tracks whether you act on the coach’s advice",
    ],
    group: "habits",
    keywords: ["coach", "mentor", "morning", "observation", "evidence", "action"],
  },
  {
    number: "11",
    id: "reports",
    title: "Weekly AI Reports",
    tagline: "A review of your trading, every week.",
    problem:
      "Even if you journal, you still have to review it, and when you review alone it is easy to notice the patterns you expect and miss the others.",
    solution:
      "Each week, Edgecipline generates a report from your trades covering your performance, your discipline and what to improve next.",
    benefits: [
      "Generated weekly and also sent to your email",
      "Based on your own trades",
      "Highlights what to improve next",
      "Past reports stored in the app",
    ],
    group: "habits",
    keywords: ["weekly", "report", "email", "archive", "review", "focus", "bias"],
  },
  {
    number: "12",
    id: "checklists",
    title: "Setup Checklists",
    tagline: "Check your rules before you trade.",
    problem:
      "You have trading rules, and under pressure they are easy to skip when nothing prompts you to check them before entering a trade.",
    solution:
      "Build a pre-trade checklist for each setup strategy, with up to 20 rules per setup. Tick the rules you followed on each trade and Edgecipline computes a setup score, so you can compare your rule-following with your results.",
    benefits: [
      "Custom checklist per setup or strategy",
      "Checklist reminders at a time you choose, including on Android",
      "Logged adherence tracking per trade",
      "Compare rule-following with your results",
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
      "If you review and log trades from your phone, a journal that is awkward on mobile is easy to skip.",
    solution:
      "The Edgecipline Android app, currently in testing with a limited group of users, offers screenshot upload from your phone, push notifications and reminders, and the same journal and analytics as the web app.",
    benefits: [
      "Screenshot upload from your phone’s gallery",
      "Push notifications and checklist reminders",
      "Full dashboard, journal, analytics, and Trading DNA on mobile",
      "Mobile bottom navigation",
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
      "A review that looks only at P&L misses the behavior behind it: your mindset, your discipline and the mistakes you repeat.",
    solution:
      "The Psychology Timeline shows your mindset and results day by day, and discipline analytics show how your discipline trends over the weeks, so you can review the two side by side.",
    benefits: [
      "Day-by-day mindset and results",
      "Discipline trend over the weeks",
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
