import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Check, Minus, PackageCheck, ShieldCheck, TrendingDown } from "lucide-react";

import {
  EVERY_PLAN_INCLUDES_EVERYTHING,
  perDay,
  plans,
  PRICING_FOOTNOTE,
  savingVsMonthly,
} from "@/data/pricing";
import { WAITLIST_HREF } from "@/data/features";
import styles from "./Pricing.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/** ₹9.99 — two decimals, grouped, so the three cards line up. */
const rupees = (value: number) =>
  value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * The three plans.
 *
 * Two figures on each card are derived rather than written down: the per-day
 * cost and, for the longer terms, what the term saves against paying monthly.
 * Both come from the prices in `pricing.ts`, so they cannot drift out of step
 * with them — and both are arithmetic on Edgecipline's own numbers rather than
 * a claim added to the page.
 *
 * A Server Component: cards, prices and links are all in the first paint.
 */
export function PlanCards() {
  return (
    <section className={css("ppPlans")} aria-labelledby="plans-title" id="plans">
      <div className={css("ppInner")}>
        <h2 className="sr-only" id="plans-title">
          Plans
        </h2>

        <ul className={css("ppCards")}>
          {plans.map((plan, index) => {
            const saving = savingVsMonthly(plan);
            return (
              <li
                key={plan.id}
                className={css("ppCard")}
                data-plan={plan.id}
                data-featured={plan.featured ? "" : undefined}
                data-badge={plan.badge ? "" : undefined}
                data-reveal
                style={vars({ "--mo-delay": `${index * 0.08}s` })}
              >
                {plan.badge && <p className={css("ppBadge")}>{plan.badge}</p>}

                <h3 className={css("ppPlanName")}>{plan.name}</h3>
                <p className={css("ppPlanDesc")}>{plan.description}</p>

                <p className={css("ppPrice")}>
                  <b>{plan.price}</b>
                  <span>{plan.period}</span>
                </p>

                <div className={css("ppMeta")}>
                  <p className={css("ppPerDay")}>≈ ₹{rupees(perDay(plan))} a day</p>
                  {saving && (
                    <p className={css("ppSaving")}>
                      <TrendingDown aria-hidden="true" size={13} />
                      Saves ₹{saving.saved.toLocaleString("en-IN")} ({saving.percent}%) vs.{" "}
                      {plan.months} × monthly
                    </p>
                  )}
                </div>

                <Link className={css("ppCardCta")} href={WAITLIST_HREF}>
                  Join Waitlist
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>

                <span className={css("ppDivider")} aria-hidden="true" />

                {EVERY_PLAN_INCLUDES_EVERYTHING && (
                  <p className={css("ppAllIn")}>
                    <PackageCheck aria-hidden="true" size={15} />
                    All features included — plans differ by term only
                  </p>
                )}

                <ul className={css("ppIncludes")}>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" size={15} strokeWidth={2.8} />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} data-off="">
                      <Minus aria-hidden="true" size={15} strokeWidth={2.8} />
                      {/* The visually-hidden prefix means a screen reader hears
                          "Not included: …" rather than relying on the strike. */}
                      <span>
                        <span className="sr-only">Not included: </span>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <p className={css("ppFootnote")} data-reveal="fade">
          <ShieldCheck aria-hidden="true" size={16} />
          {PRICING_FOOTNOTE}
        </p>
        <p className={css("ppDerived")}>
          Per-day and saving figures are calculated from the plan prices above, at thirty days a
          month.
        </p>
      </div>
    </section>
  );
}
