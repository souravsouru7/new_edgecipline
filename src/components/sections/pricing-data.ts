/**
 * Pricing data for Section 08.
 *
 * Every string here was read off the supplied reference screenshot at 4x — the
 * plan names, prices, billing periods and feature lists are transcriptions, not
 * inventions.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * MONTHLY PRICES ARE NOT SET.
 *
 * The reference shows a Monthly / Yearly selector with Yearly active, but it
 * only ever shows the Yearly prices, and the project has no plan data to read
 * the Monthly ones from. Rather than invent them, `monthly` is left null on
 * every plan and the selector renders that option disabled.
 *
 * Fill in the three `monthly` entries below and the selector becomes live on
 * its own — no component changes needed.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type BillingMode = "monthly" | "yearly";

export type Price = {
  /** Formatted exactly as it should read, currency symbol included. */
  amount: string;
  /** The billing period shown next to the amount. */
  period: string;
};

export type Plan = {
  id: string;
  name: string;
  features: readonly string[];
  featured?: boolean;
  badge?: string;
  prices: Record<BillingMode, Price | null>;
};

export const BILLING_MODES: ReadonlyArray<{ id: BillingMode; label: string; note?: string }> = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", note: "20% OFF" },
];

/** The option the reference shows selected. */
export const DEFAULT_BILLING: BillingMode = "yearly";

export const PLANS: readonly Plan[] = [
  {
    id: "standard",
    name: "Standard",
    prices: {
      monthly: null,
      yearly: { amount: "₹349", period: "/ month" },
    },
    features: ["Trading Journal", "Basic AI Insights", "Weekly Reflections", "Community Access"],
  },
  {
    id: "professional",
    name: "Professional",
    featured: true,
    badge: "Most Popular",
    prices: {
      monthly: null,
      yearly: { amount: "₹899", period: "/ 3 months" },
    },
    features: [
      "Advanced AI Analysis",
      "Trading DNA Report",
      "Personalized Coaching Insights",
      "Priority Support",
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    prices: {
      monthly: null,
      yearly: { amount: "₹1,499", period: "/ 6 months" },
    },
    features: [
      "Full AI Coach Access",
      "Deep Behavior Analysis",
      "Advanced Analytics",
      "Early Access to New Features",
    ],
  },
];

/** A billing mode is offered only when every plan has a price for it. */
export const availableBillingModes = (): BillingMode[] =>
  BILLING_MODES.filter((mode) => PLANS.every((plan) => plan.prices[mode.id] !== null)).map(
    (mode) => mode.id,
  );
