/**
 * Pricing data for the landing page's pricing section.
 *
 * Three plans, three billing terms, three verified prices.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHY THERE IS NO MONTHLY / YEARLY SELECTOR.
 *
 * There used to be one, because the reference artwork showed a Monthly /
 * Yearly toggle with "20% OFF" on the Yearly option. It was a selector over
 * data that does not exist: no plan had a monthly price, so Monthly rendered
 * permanently disabled, and the "20% OFF" label described a discount nothing
 * in the project verified. A control that cannot be used and a saving that
 * cannot be checked are both claims, so both are gone.
 *
 * What the three prices actually are is three different *terms* — one month,
 * three months, six months — not two billing periods for the same plan. They
 * are presented as that, which is what they are, and it needs no selector.
 *
 * If per-month and per-year prices are ever set for all three plans, that is
 * a selector worth building then, against real numbers.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Home-page cards derive terms, prices, and shared feature lists from
 * src/data/pricing.ts so they cannot drift from the full pricing page.
 */

import { plans } from "@/data/pricing";

export type Plan = {
  id: string;
  name: string;
  /** Formatted exactly as it should read, currency symbol included. */
  amount: string;
  /** The term the amount buys. */
  period: string;
  features: readonly string[];
  featured?: boolean;
  badge?: string;
};

export const PLANS: readonly Plan[] = plans.map((plan) => ({
  id: plan.id,
  name: plan.name,
  amount: plan.price,
  period: plan.months === 1 ? "/ month" : `/ ${plan.months} months`,
  features: plan.features,
  featured: plan.featured,
  badge: plan.badge ?? undefined,
}));
