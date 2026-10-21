import type { CSSProperties } from "react";
import { Check } from "lucide-react";

import { PLANS } from "./pricing-data";
import styles from "./Pricing.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function Pricing() {
  return (
    <section id="pricing" className={css("pr")} data-sequence aria-labelledby="pricing-title">
      <div className={css("prInner")}>
        <header className={css("prHeader")}>
          <h2 id="pricing-title" data-reveal>
            Pricing <span>Plans</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
            Simple and transparent. Choose your path.
          </p>
        </header>

        <ul className={css("prCards")}>
          {PLANS.map((plan, index) => (
            <li
              key={plan.id}
              className={css("prCard")}
              data-featured={plan.featured ? "" : undefined}
              data-reveal
              style={vars({ "--i": index })}
            >
              {plan.badge ? <span className={css("prBadge")}>{plan.badge}</span> : null}

              <h3 className={css("prName")}>{plan.name}</h3>

              <p className={css("prPrice")}>
                <span className={css("prAmount")}>{plan.amount}</span>
                <span className={css("prPeriod")}>{plan.period}</span>
              </p>

              <ul className={css("prFeatures")}>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check aria-hidden="true" size={15} strokeWidth={3} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a className={css("prCta")} href="#waitlist">
                Join Waitlist <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        {/* The three buttons above join a waitlist; none of them takes a
            payment, and nothing on this page can. Saying so is the difference
            between a price list and a checkout that does not exist. */}
        <p className={css("prNote")} data-reveal style={vars({ "--mo-delay": ".2s" })}>
          These are the launch prices. Nothing is charged today — the buttons above join the
          waitlist, and billing opens when early access does.
        </p>
      </div>
    </section>
  );
}
