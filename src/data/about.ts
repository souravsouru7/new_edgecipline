/**
 * /about content, taken from the previous site's copy deck:
 * `edgeclipine/site-content.md` → "# About Page".
 *
 * Every statement, paragraph, timeline entry and belief below is that page's
 * wording. The layout and the iconography are new; the words are not.
 *
 * The founder links are live: /founders and /founders/<slug> exist now, so the
 * sentence naming both founders links each name to its profile and the page
 * ends with the old "Meet …" call to action, exactly as the original did.
 */

export type Belief = {
  /** Which lucide icon the page draws. Replaces the old copy's emoji. */
  icon: "edge" | "data" | "mirror" | "execution" | "compound" | "traders";
  title: string;
  body: string;
};

export type Milestone = {
  year: string;
  label: string;
  text: string;
};

export const INTRO =
  "Edgecipline exists because we lived through the same painful cycle most traders face: good strategy, inconsistent execution, unexplained losses. The problem wasn’t the market.";

export const pillars = [
  {
    eyebrow: "Mission",
    /** Split so the page can set the accent word without splitting the string. */
    statement: ["Help every trader understand ", "themselves", " as clearly as the market."],
    body: "Most trading tools track what happened. We track why — and then help you build the habit to fix it. By surfacing behavioral patterns that drive losses — revenge trading, FOMO entries, time-of-day blind spots — and turning them into daily missions, streaks, and coaching, we help traders fix the root cause, not just the symptoms.",
  },
  {
    eyebrow: "Vision",
    statement: ["A world where discipline is the ", "default", ", not the exception."],
    body: "When every trader has access to honest behavioral feedback, the entire ecosystem becomes healthier. Better traders make better decisions. Better decisions create more consistent outcomes — for everyone.",
  },
] as const;

/** The founder story, as three quoted paragraphs. */
export const story = [
  "I had a strategy that worked. Backtested. Profitable on paper. But every month, I’d end up negative. Not because the strategy failed — but because I didn’t follow it. I’d revenge trade after a loss. I’d overtrade on expiry Thursdays. I’d exit winners at 50% of target and hold losers 3x past my stop.",
  "I started keeping a journal. Not a P&L tracker — a behavioral journal. Three months later, the data showed me something embarrassing: I had a 67% win rate on my morning trades and a 31% win rate on afternoon trades. I had been averaging my way to zero.",
  "I stopped trading after 1pm. My account started growing. Edgecipline started as that journal — and grew into a discipline coach, with missions, streaks, and a morning mentor, because knowing the pattern wasn’t enough. I needed something that made me act on it every single day, for Forex and Indian markets alike.",
] as const;

export const STORY_ATTRIBUTION = {
  name: "Sourav R",
  role: "Co-Founder, Product & Technology, Edgecipline",
} as const;

export const FOUNDING_SENTENCE =
  "Edgecipline was founded by Sourav R, who leads product, technology and strategy, and Munavvir TP, who leads operations, administration and people. The story above is Sourav’s; the company runs on both of them.";

export const milestones: readonly Milestone[] = [
  {
    year: "2022",
    label: "The Problem",
    text: "Losing money despite having a strategy. Revenge trades. Breaking rules. Realizing the issue wasn’t the market — it was the trader.",
  },
  {
    year: "2023",
    label: "The Research",
    text: "Deep-diving into trading psychology, behavioral finance, and habit research. The pattern was clear: behavior, not strategy, was the bottleneck.",
  },
  {
    year: "2024",
    label: "The Build",
    text: "Started building Edgecipline — an AI trading journal focused on behavioral analysis, not just P&L tracking.",
  },
  {
    year: "2025",
    label: "Private Alpha",
    text: "Launched private alpha and opened the waitlist. Refining the product based on real feedback.",
  },
  {
    year: "2025 · Late",
    label: "Beyond the Journal",
    text: "Realized journaling alone wasn’t enough to change behavior. Added Trading DNA, a psychology cost calculator, and a gamified layer — missions, streaks, and a daily morning mentor — to turn insight into habit.",
  },
  {
    year: "2026",
    label: "Product Complete",
    text: "Completed the web and Android product with AI screenshot extraction, Trading DNA, gamified missions & streaks, and daily AI coaching. Access remains invite-only while iOS is prepared for a future release.",
  },
] as const;

export const beliefs: readonly Belief[] = [
  {
    icon: "edge",
    title: "Discipline Creates Edge",
    body: "Your edge isn’t your strategy — it’s your ability to execute it consistently. Discipline is the edge.",
  },
  {
    icon: "data",
    title: "Data Over Feelings",
    body: "Feelings tell you what you want to believe. Data tells you what’s actually happening. We build for data.",
  },
  {
    icon: "mirror",
    title: "Markets Are a Mirror",
    body: "Every trade reflects a decision. Every loss reflects a behavior. The market shows you exactly who you are.",
  },
  {
    icon: "execution",
    title: "Small Edge, Executed Well",
    body: "A 55% win rate + consistent R:R + disciplined execution beats a 70% win rate traded emotionally every time.",
  },
  {
    icon: "compound",
    title: "Self-Knowledge Compounds",
    body: "The more you know about your behavioral patterns, the better your next 100 trades will be. This knowledge compounds.",
  },
  {
    icon: "traders",
    title: "Built by Traders",
    body: "We trade. We journal. We’ve had the same psychological struggles. We built the tool we wish we had.",
  },
] as const;

export const launchStatus = {
  eyebrow: "Invite-Only Access — 2026",
  state: "Product complete — access by invitation",
  body: "Registration is open for the completed web and Android product. Join the waitlist to request invite-only access and founding-member pricing. An iOS release is planned for the future.",
} as const;
