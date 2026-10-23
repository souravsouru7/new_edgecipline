/**
 * /pricing content, taken from the previous site's copy deck:
 * `edgeclipine/site-content.md` → "# Pricing Page".
 *
 * Every price, plan description, feature line, FAQ and CTA string below is
 * that page's wording. The layout is new; the words are not.
 *
 * ── One contradiction had to be resolved ────────────────────────────────────
 * The old page said two different things about what each plan includes:
 *
 *   * the plan cards listed "Not included" per tier — Standard without the AI
 *     Coach, missions and Trading DNA; Professional without Trading DNA;
 *   * the comparison table directly below them marked every feature ✓ for all
 *     three tiers.
 *
 * Resolved by the owner: every plan includes every feature, and the plans
 * differ only by term — which is what the comparison table said. So this flag
 * is true, which ticks every row of the matrix and drops the struck-through
 * "Not included" lists from the cards. Flip it to false to get the tiered
 * reading instead; both the table and the cards follow it.
 */

export const EVERY_PLAN_INCLUDES_EVERYTHING = true;

export const ALL_PLAN_FEATURES = [
  "Trading journal and AI screenshot extraction",
  "AI coaching and weekly reports",
  "Trading DNA and behavior analytics",
  "Missions, streaks, and setup checklists",
] as const;

export type PlanId = "standard" | "professional" | "ultimate";

export type Plan = {
  id: PlanId;
  name: string;
  /** Headline price, as written. */
  price: string;
  /** Billing term, as written. */
  period: string;
  /** Months the term covers — used for the per-day and per-term arithmetic. */
  months: number;
  /** Price as a number, for the same arithmetic. Must match `price`. */
  amount: number;
  badge: string | null;
  featured: boolean;
  description: string;
  features: readonly string[];
  /** Shown struck through, exactly as the old cards did. */
  notIncluded: readonly string[];
};

/**
 * The card copy, verbatim. `notIncluded` is kept with each plan so the tiered
 * reading is still one flag away; `plans` below strips it when every plan
 * includes everything, so the cards can never contradict the table.
 */
const PLAN_COPY: readonly Plan[] = [
  {
    id: "standard",
    name: "Standard",
    price: "₹349",
    period: "per month",
    months: 1,
    amount: 349,
    badge: null,
    featured: false,
    description:
      "For traders who want to start journaling with AI extraction and build the habit.",
    features: [
      "Unlimited trade journals · Forex + Indian markets",
      "AI screenshot extraction",
      "Standard analytics dashboard",
      "Emotion & setup tagging",
      "Trade history search",
      "Email support",
    ],
    notIncluded: ["AI Coach & Morning Mentor", "Missions & streaks", "Trading DNA profile"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹899",
    period: "3 months",
    months: 3,
    amount: 899,
    badge: "3-Month Access",
    featured: true,
    description:
      "For serious traders who want gamified discipline and personalized AI coaching.",
    features: [
      "Everything in Standard",
      "AI Coach, Morning Mentor & weekly reports",
      "Missions & streaks",
      "Psychology cost calculator",
      "Revenge & tilt alerts",
      "Priority support",
    ],
    notIncluded: ["Trading DNA profile", "Pattern detection engine"],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "₹1,499",
    period: "6 months",
    months: 6,
    amount: 1499,
    badge: "Lowest Monthly Cost",
    featured: false,
    description:
      "For committed traders who want the complete behavioral intelligence platform.",
    features: [
      "Everything in Professional",
      "Trading DNA profile & pattern detection",
      "Self-awareness score & psychology timeline",
      "Monthly performance review",
      "Lifetime trade backup",
      "Early beta access to new features",
    ],
    notIncluded: [],
  },
] as const;

export const plans: readonly Plan[] = EVERY_PLAN_INCLUDES_EVERYTHING
  ? PLAN_COPY.map((plan) => ({
      ...plan,
      description: `${plan.months} ${plan.months === 1 ? "month" : "months"} of access to every Edgecipline feature.`,
      features: ALL_PLAN_FEATURES,
      notIncluded: [],
    }))
  : PLAN_COPY;

/**
 * The per-day figures the old copy quoted — "~₹9.99/day", "~₹8.33/day" — are
 * the plan price over thirty days a month. Deriving all three the same way
 * keeps them comparable and means they can never drift from the prices above.
 */
const DAYS_PER_MONTH = 30;

export function perDay(plan: Plan) {
  return plan.amount / (plan.months * DAYS_PER_MONTH);
}

/** What the same period costs at the monthly rate, and what the term saves. */
export function savingVsMonthly(plan: Plan) {
  const monthly = plans[0];
  if (plan.id === monthly.id) return null;
  const atMonthlyRate = monthly.amount * plan.months;
  const saved = atMonthlyRate - plan.amount;
  if (saved <= 0) return null;
  return { atMonthlyRate, saved, percent: Math.round((saved / atMonthlyRate) * 100) };
}

/* -- comparison matrix ----------------------------------------------------- */

export type CompareValue = boolean | string;

export type CompareRow = {
  label: string;
  /** A short grouping label, so thirteen rows read as four ideas. */
  group: string;
  standard: CompareValue;
  professional: CompareValue;
  ultimate: CompareValue;
};

const MATRIX: readonly CompareRow[] = [
  { group: "Journal", label: "Unlimited trade journals (Forex + Indian)", standard: true, professional: true, ultimate: true },
  { group: "Journal", label: "AI screenshot extraction", standard: true, professional: true, ultimate: true },
  { group: "Journal", label: "Analytics dashboard", standard: true, professional: true, ultimate: true },
  { group: "Journal", label: "Emotion & setup tagging", standard: true, professional: true, ultimate: true },
  { group: "Journal", label: "Trade history search", standard: true, professional: true, ultimate: true },

  { group: "Coaching", label: "AI Coach & Morning Mentor", standard: false, professional: true, ultimate: true },
  { group: "Coaching", label: "Weekly AI reports", standard: false, professional: true, ultimate: true },
  { group: "Coaching", label: "Missions & streaks", standard: false, professional: true, ultimate: true },
  { group: "Coaching", label: "Psychology cost calculator", standard: false, professional: true, ultimate: true },
  { group: "Coaching", label: "Revenge & tilt pattern alerts", standard: false, professional: true, ultimate: true },

  { group: "Trading DNA", label: "Trading DNA & pattern detection", standard: false, professional: false, ultimate: true },
  { group: "Trading DNA", label: "Self-awareness score", standard: false, professional: false, ultimate: true },
  { group: "Trading DNA", label: "Psychology timeline", standard: false, professional: false, ultimate: true },

  { group: "Review & extras", label: "Monthly performance review", standard: false, professional: false, ultimate: true },
  { group: "Review & extras", label: "Lifetime trade backup", standard: false, professional: false, ultimate: true },
  { group: "Review & extras", label: "Early beta access", standard: false, professional: false, ultimate: true },
];

export const compareRows: readonly CompareRow[] = EVERY_PLAN_INCLUDES_EVERYTHING
  ? MATRIX.map((row) =>
      typeof row.standard === "boolean"
        ? { ...row, standard: true, professional: true, ultimate: true }
        : row,
    )
  : MATRIX;

/** Row groups in order, for the table's section headings. */
export const compareGroups = [...new Set(compareRows.map((row) => row.group))];

/* -- FAQs ------------------------------------------------------------------ */

export const pricingFaqs = [
  {
    q: "How do I access Edgecipline?",
    a: "Registration is open, while product access is currently invite-only. Join the waitlist to request access and founding-member pricing.",
  },
  {
    q: "Can I switch plans after subscribing?",
    a: "Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades take effect at the end of your current billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. New accounts receive a 7-day premium trial. After the trial, the free account is limited to two saved trades.",
  },
  {
    q: "What currencies do you support?",
    a: "Edgecipline is priced in Indian Rupees (INR) and is optimized for Indian market traders. International pricing is planned for a future update.",
  },
  {
    q: "Do I need a credit card to join the waitlist?",
    a: "No. The waitlist is free, and no card is required to request an invitation. Payment is required only when you choose a paid subscription.",
  },
  {
    q: "What’s your refund policy?",
    a: "For current cancellation and refund terms, review the information shown during checkout or contact support@edgecipline.com before subscribing.",
  },
] as const;

/** The reassurance line that sat under the plan cards. */
export const PRICING_FOOTNOTE =
  "All prices in INR. The waitlist is free; payment is required only when you choose a paid subscription.";
