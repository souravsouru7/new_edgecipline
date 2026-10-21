"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";

import { compareGroups, compareRows, type PlanId, plans } from "@/data/pricing";
import styles from "./Pricing.module.css";

const css = (name: string) => styles[name] || name;

/**
 * The full feature matrix.
 *
 * One table, two presentations. On desktop all three plan columns are shown.
 * Below 768px four columns cannot be read at any useful size, so a picker
 * chooses one plan and CSS hides the other two columns — the markup stays a
 * single valid table either way, which keeps it navigable to a screen reader
 * and leaves the whole matrix in the HTML for crawlers.
 *
 * The rows are grouped so seventeen of them read as four ideas rather than a
 * wall. Each group heading is a real `<th colspan>` row, not a styled `<tr>`.
 */
export function PlanCompare() {
  const featured = plans.find((plan) => plan.featured);
  const [shown, setShown] = useState<PlanId>(featured?.id ?? plans[0].id);

  return (
    <section className={css("ppCompare")} aria-labelledby="compare-title" id="compare">
      <div className={css("ppInner")}>
        <header className={css("ppSectionHead")}>
          <h2 id="compare-title" data-reveal>
            Compare all plans
          </h2>
          <p data-reveal style={{ ["--mo-delay" as string]: ".08s" }}>
            Every plan includes every feature. The only thing that changes is how long the term
            runs — and what that brings the per-day cost down to.
          </p>
        </header>

        {/* Mobile only. aria-pressed rather than tabs: this filters a table, it
            does not switch between panels. */}
        <div className={css("ppPicker")} role="group" aria-label="Show one plan">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              aria-pressed={shown === plan.id}
              onClick={() => setShown(plan.id)}
            >
              {plan.name}
            </button>
          ))}
        </div>

        <div className={css("ppTableWrap")} data-reveal style={{ ["--mo-delay" as string]: ".12s" }}>
          <table className={css("ppTable")}>
            <caption>
              Feature availability by plan. All prices in INR; the waitlist is free.
            </caption>
            <thead>
              <tr>
                <th scope="col" data-col="var">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    data-col={plan.id}
                    data-active={shown === plan.id ? "" : undefined}
                    data-featured={plan.featured ? "" : undefined}
                  >
                    {plan.name}
                    <small>
                      {plan.price} · {plan.period}
                    </small>
                  </th>
                ))}
              </tr>
            </thead>

            {compareGroups.map((group) => (
              <tbody key={group}>
                <tr className={css("ppGroupRow")}>
                  <th scope="colgroup" colSpan={plans.length + 1}>
                    {group}
                  </th>
                </tr>
                {compareRows
                  .filter((row) => row.group === group)
                  .map((row) => (
                    <tr key={row.label}>
                      <th scope="row" data-col="var">
                        {row.label}
                      </th>
                      {plans.map((plan) => {
                        const value = row[plan.id];
                        return (
                          <td
                            key={plan.id}
                            data-col={plan.id}
                            data-active={shown === plan.id ? "" : undefined}
                            data-featured={plan.featured ? "" : undefined}
                          >
                            {typeof value === "string" ? (
                              value
                            ) : value ? (
                              <>
                                <span className={css("ppYes")} aria-hidden="true">
                                  <Check size={13} strokeWidth={3} />
                                </span>
                                <span className="sr-only">Included</span>
                              </>
                            ) : (
                              <>
                                <span className={css("ppNo")} aria-hidden="true">
                                  <Minus size={15} strokeWidth={2.5} />
                                </span>
                                <span className="sr-only">Not included</span>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}
