import type { CSSProperties } from "react";
import Link from "next/link";

import { faqItems } from "@/data/faq";
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

        {/* The canonical answers live on /faq, which is the only page that
            carries FAQPage schema. These few are the ones worth asking before
            someone scrolls; the link is how both a reader and a crawler get
            from here to the full set. */}
        <p className={css("faqMore")} data-reveal style={vars({ "--mo-delay": ".2s" })}>
          <Link href="/faq">All {faqItems.length} questions, answered in full</Link>
        </p>
      </div>
    </section>
  );
}
