/**
 * /faq content, taken from the previous site's copy deck:
 * `edgeclipine/site-content.md` → "# FAQ Page".
 *
 * The 25 questions retain their original categories and order. Answers about
 * access availability, security, broker support, and pricing have been
 * clarified so they do not imply unverified live product capabilities.
 */

export type FaqCategory =
  | "Founders & Company"
  | "About Edgecipline"
  | "AI & Features"
  | "Forex & Indian Markets"
  | "Pricing & Access"
  | "Privacy & Data";

export type FaqItem = {
  /** Stable slug — used for the accordion ids and as a deep link. */
  id: string;
  category: FaqCategory;
  q: string;
  a: string;
};

/** Category order, as the old page had it. */
export const faqCategories: readonly FaqCategory[] = [
  "Founders & Company",
  "About Edgecipline",
  "AI & Features",
  "Forex & Indian Markets",
  "Pricing & Access",
  "Privacy & Data",
] as const;

export const faqItems: readonly FaqItem[] = [
  // ── Founders & Company ────────────────────────────────────────────────────
  {
    id: "who-are-the-founders",
    category: "Founders & Company",
    q: "Who are the founders of Edgecipline?",
    a: "Edgecipline was founded by Sourav R and Munavvir TP. Sourav R is a co-founder of Edgecipline and leads product, technology and strategy. Munavvir TP is a co-founder of Edgecipline and leads operations, administration and people. The two founders split the company between them: Sourav R owns product and technology, and Munavvir TP owns operations and people.",
  },
  {
    id: "how-many-founders",
    category: "Founders & Company",
    q: "How many founders does Edgecipline have?",
    a: "Edgecipline has two founders — Sourav R and Munavvir TP. Both are co-founders of Edgecipline and neither is a silent partner: Sourav R leads product, technology and strategy, while Munavvir TP leads operations, administration and people.",
  },
  {
    id: "who-is-sourav-r",
    category: "Founders & Company",
    q: "Who is Sourav R of Edgecipline?",
    a: "Sourav R is a co-founder of Edgecipline and leads product, technology and strategy. A business and technology professional who combines management education with hands-on software development and product execution. At Edgecipline he owns product development, software architecture, technical decision-making, business planning and product execution.",
  },
  {
    id: "who-is-munavvir-tp",
    category: "Founders & Company",
    q: "Who is Munavvir TP of Edgecipline?",
    a: "Munavvir TP is a co-founder of Edgecipline and leads operations, administration and people. An operations, administration and people-management professional with more than seven years of experience across India and the UAE. At Edgecipline he owns business operations, administration and internal processes, people coordination, documentation and reporting, and client communication.",
  },
  {
    id: "who-runs-edgecipline",
    category: "Founders & Company",
    q: "Who runs Edgecipline?",
    a: "Edgecipline is run by its two co-founders, Sourav R and Munavvir TP. Sourav R decides what gets built and Munavvir TP runs how the company operates, so the company is covered end to end between them.",
  },

  // ── About Edgecipline ─────────────────────────────────────────────────────
  {
    id: "what-is-edgecipline",
    category: "About Edgecipline",
    q: "What is Edgecipline?",
    a: "Edgecipline is an AI-powered trading journal, discipline coach, and gamified improvement system — not just a P&L tracker. Upload a screenshot of your trade and the AI automatically extracts the details, builds your Trading DNA profile, and reveals your emotional patterns, execution mistakes, and behavioral blind spots over time.",
  },
  {
    id: "how-is-it-spelled",
    category: "About Edgecipline",
    q: "How is Edgecipline spelled? Is it a typo?",
    a: "Edgecipline is spelled E-D-G-E-C-I-P-L-I-N-E. It’s an intentional brand name — a portmanteau of ‘Edge’ (the competitive advantage traders seek) and ‘discipline’ (the consistent behavior required to maintain it). Not a misspelling of discipline.",
  },
  {
    id: "who-is-it-for",
    category: "About Edgecipline",
    q: "Who is Edgecipline built for?",
    a: "Edgecipline is built for retail Forex traders using MT5, and Indian retail traders on NIFTY, BANKNIFTY, options, and equity through brokers like Zerodha, Upstox, Angel One, Dhan, and Groww — anyone tired of losing money to emotional decisions and inconsistent execution. MT4 and cTrader support are planned.",
  },
  {
    id: "when-will-it-launch",
    category: "About Edgecipline",
    q: "Is Edgecipline available?",
    a: "The Edgecipline product is complete on web and Android. Registration is open, while product access is currently invite-only. Join the waitlist to request access and founding-member pricing.",
  },
  {
    id: "is-there-a-mobile-app",
    category: "About Edgecipline",
    q: "Is there a mobile app?",
    a: "Yes. The Android app is available through Google Play, although product access is currently invite-only. An iOS release is planned for the future.",
  },

  // ── AI & Features ─────────────────────────────────────────────────────────
  {
    id: "how-extraction-works",
    category: "AI & Features",
    q: "How does AI screenshot extraction work?",
    a: "Take a screenshot of your trade terminal after any trade. Edgecipline’s AI reads the screenshot to extract: trading pair, direction (long/short), entry price, exit price, P&L, lot size, and time. No manual data entry required.",
  },
  {
    id: "supported-brokers",
    category: "AI & Features",
    q: "What brokers and platforms does Edgecipline support?",
    a: "Edgecipline currently supports MT5 and major Indian brokers such as Zerodha, Upstox, Angel One, Dhan and Groww. MT4 and cTrader support are planned for a future update.",
  },
  {
    id: "what-is-trading-dna",
    category: "AI & Features",
    q: "What is Trading DNA?",
    a: "Trading DNA is your behavioral fingerprint — a comprehensive profile of your unique trading patterns, strengths, weaknesses, and psychological tendencies, built from your actual data. It also powers a Pattern Detection Engine that finds high-edge combinations like ‘London session + confident mood + breakout setup.’",
  },
  {
    id: "psychology-cost-calculator",
    category: "AI & Features",
    q: "What is the Psychology Cost Calculator?",
    a: "It groups your trades by emotion and mistake tag — revenge, FOMO, greed, no stop loss, chased price — and calculates the exact P&L cost of each behavior, so you see a real number instead of a vague feeling.",
  },
  {
    id: "missions-streaks-mentor",
    category: "AI & Features",
    q: "What are Missions, Streaks, and the Morning Mentor?",
    a: "Missions are AI-recommended challenges targeting your specific weaknesses, like avoiding emotional trades for 7 days. Streaks reward consistent daily journaling. The Morning Mentor sends a personalized AI message every morning at 6am based on your real trading data.",
  },
  {
    id: "patterns-detected",
    category: "AI & Features",
    q: "What behavioral patterns does Edgecipline detect?",
    a: "Edgecipline detects revenge trading patterns, FOMO entry behavior, tilt spirals, time-of-day performance changes, size escalation after win streaks, rule adherence breakdowns, setup delusion, and emotional state correlations with outcomes.",
  },
  {
    id: "weekly-reports",
    category: "AI & Features",
    q: "What are the weekly AI coaching reports?",
    a: "Every Sunday, Edgecipline generates a personalized report based on your actual trade data from the week: what worked, what didn’t, your biggest behavioral pattern, win rate by setup, and one specific improvement focus for next week. Not generic tips — specific to your data.",
  },

  // ── Forex & Indian Markets ────────────────────────────────────────────────
  {
    id: "forex-support",
    category: "Forex & Indian Markets",
    q: "Does Edgecipline support Forex trading on MT5?",
    a: "Yes. Edgecipline has a dedicated Forex mode for MT5, with its own journal, analytics, and screenshot extraction tuned for pip-based currency pairs. MT4 and cTrader support are planned for a future update.",
  },
  {
    id: "nifty-banknifty",
    category: "Forex & Indian Markets",
    q: "Is Edgecipline suitable for NIFTY and BANKNIFTY traders?",
    a: "Yes — Edgecipline has a dedicated Indian Market mode covering NIFTY, BANKNIFTY, options, futures, and equity trades, with pricing in INR and insights tailored for Indian market hours.",
  },
  {
    id: "options-traders",
    category: "Forex & Indian Markets",
    q: "Does it work for options traders?",
    a: "Yes. Indian Market mode captures F&O-specific fields — strike price, option type (CE/PE), expiry date, and lot size — and tracks behavioral patterns unique to options, like theta decay denial and expiry-day FOMO.",
  },

  // ── Pricing & Access ──────────────────────────────────────────────────────
  {
    id: "how-much-does-it-cost",
    category: "Pricing & Access",
    q: "How much does Edgecipline cost?",
    a: "The paid plans are Standard at ₹349/month, Professional at ₹899 for 3 months, and Ultimate at ₹1,499 for 6 months. A 7-day trial is available, and free accounts can save up to 2 trades. Joining the waitlist is free; payment is only required when you choose a paid subscription.",
  },
  {
    id: "is-the-waitlist-free",
    category: "Pricing & Access",
    q: "Is the waitlist free?",
    a: "Yes, completely free. Joining requests an invitation and does not require a credit card.",
  },
  {
    id: "waitlist-member-benefits",
    category: "Pricing & Access",
    q: "What do waitlist members get?",
    a: "Priority access before the general public, potential founding pricing discounts, early beta access to new features, and the ability to shape the product through feedback.",
  },
  {
    id: "free-trial",
    category: "Pricing & Access",
    q: "Is there a free trial?",
    a: "New accounts receive a 7-day premium trial. After the trial, the free account is limited to two saved trades.",
  },

  // ── Privacy & Data ────────────────────────────────────────────────────────
  {
    id: "how-data-is-stored",
    category: "Privacy & Data",
    q: "How is my trade data stored?",
    a: "Account and trade data is stored in MongoDB Atlas, while uploaded screenshots are stored in Cloudinary. Screenshots and raw OCR data remain associated with an active account. Deleting the account permanently deletes its associated account data, trades, screenshots, OCR data, analytics, reports, and coaching history.",
  },
  {
    id: "broker-account-access",
    category: "Privacy & Data",
    q: "Does Edgecipline have access to my broker account?",
    a: "The screenshot workflow does not require broker login credentials or a direct broker connection. Never share broker credentials through a screenshot or message.",
  },
  {
    id: "waitlist-data-collected",
    category: "Privacy & Data",
    q: "What data is collected when I join the waitlist?",
    a: "When you join the waitlist, we collect your name, email address, optional phone number, and trading experience level so we can manage invitation requests. See our Privacy Policy for full details.",
  },
] as const;

/** The real support address, from the old site's `lib/brand.ts`. */
export const SUPPORT_EMAIL = "support@edgecipline.com";

/**
 * The short answer set shown on the homepage. Keeping these as references to
 * the canonical FAQ collection prevents the visible answers and homepage
 * FAQPage schema from drifting apart.
 */
const homepageFaqIds = [
  "what-is-edgecipline",
  "how-extraction-works",
  "how-data-is-stored",
  "who-is-it-for",
  "when-will-it-launch",
] as const;

export const homepageFaqItems = homepageFaqIds.map((id) => {
  const item = faqItems.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Missing homepage FAQ item: ${id}`);
  return item;
});

export function faqItemsIn(category: FaqCategory) {
  return faqItems.filter((item) => item.category === category);
}
