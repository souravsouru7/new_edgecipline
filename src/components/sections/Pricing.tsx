import type { CSSProperties } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { BillingToggle } from "./BillingToggle";
import { BILLING_MODES, DEFAULT_BILLING, PLANS } from "./pricing-data";
import styles from "./Pricing.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function Pricing() {
  return (
    <section
      id="pricing"
      className={css("pr")}
      data-sequence
      data-billing={DEFAULT_BILLING}
      aria-labelledby="pricing-title"
    >
      <div className={css("prBackdrop")} aria-hidden="true">
        <Image src="/chart-story/mountains.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={css("prVeil")} aria-hidden="true" />

      <div className={css("prInner")}>
        <header className={css("prHeader")}>
          <div>
            <h2 id="pricing-title" data-reveal>
              Pricing <span>Plans</span>
            </h2>
            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Simple and transparent. Choose your path.
            </p>
          </div>
          <div data-reveal style={vars({ "--mo-delay": ".16s" })}>
            <BillingToggle target="pricing" />
          </div>
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

              {/* One price per configured billing mode; CSS shows the selected
                  one, so the amounts stay in server-rendered markup. */}
              {BILLING_MODES.map((mode) => {
                const price = plan.prices[mode.id];
                if (!price) return null;
                return (
                  <p
                    key={mode.id}
                    className={`${css("prPrice")} ${css("prPriceFor")}`}
                    data-mode={mode.id}
                  >
                    <span className={css("prAmount")}>{price.amount}</span>
                    <span className={css("prPeriod")}>{price.period}</span>
                  </p>
                );
              })}

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
      </div>
    </section>
  );
}
