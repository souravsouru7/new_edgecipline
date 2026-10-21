import type { CSSProperties } from "react";

import { FaqAccordion } from "./FaqAccordion";
import styles from "./Faq.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function Faq() {
  return (
    <section id="faq" className={css("faq")} data-sequence aria-labelledby="faq-title">

      <div className={css("faqInner")}>
        <header className={css("faqHeader")}>
          <h2 id="faq-title" data-reveal>
            Frequently <span>Asked</span> <span>Questions</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
            Everything you need to know.
          </p>
          <i className={css("faqRule")} data-reveal="from-left" style={vars({ "--mo-delay": ".18s" })} aria-hidden="true" />
        </header>

        <div data-reveal style={vars({ "--mo-delay": ".14s" })}>
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}
