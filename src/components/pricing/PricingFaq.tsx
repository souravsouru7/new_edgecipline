"use client";

import { useId, useState } from "react";
import Link from "next/link";

import { faqItems } from "@/data/faq";
import { pricingFaqs } from "@/data/pricing";
import styles from "./Pricing.module.css";

const css = (name: string) => styles[name] || name;

/**
 * The pricing FAQ — one open at a time.
 *
 * Real buttons with `aria-expanded` and `aria-controls`; the panel is a
 * labelled region kept in the DOM so its height can animate, and `inert` takes
 * it out of the tab order and the accessibility tree while it is closed. The
 * open/close is a `grid-template-rows` 0fr → 1fr transition, so the height
 * animates without measuring anything and without clipping text mid-way.
 */
export function PricingFaq() {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();

  return (
    <section className={css("ppFaq")} aria-labelledby="pricing-faq-title" id="faq">
      <div className={css("ppInner")}>
        <header className={css("ppSectionHead")}>
          <h2 id="pricing-faq-title" data-reveal>
            Common questions
          </h2>
        </header>

        <div className={css("ppFaqList")} data-reveal style={{ ["--mo-delay" as string]: ".08s" }}>
          {pricingFaqs.map((faq, index) => {
            const expanded = open === index;
            const id = `${base}-${index}`;
            return (
              <div
                key={faq.q}
                className={css("ppFaqItem")}
                data-open={expanded ? "" : undefined}
              >
                <h3>
                  <button
                    type="button"
                    id={`${id}-button`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-panel`}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    <span>{faq.q}</span>
                    <span className={css("ppFaqIcon")} aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  </button>
                </h3>
                <div
                  className={css("ppFaqPanel")}
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-button`}
                  inert={!expanded}
                >
                  <div>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Six of these questions are about buying; the other twenty-one the
            site answers are on /faq, which is the one page carrying FAQPage
            schema. Linking rather than duplicating keeps a single canonical
            answer per question. */}
        <p className={css("ppFaqMore")}>
          <Link href="/faq">All {faqItems.length} questions, answered in full</Link>
        </p>
      </div>
    </section>
  );
}
