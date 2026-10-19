"use client";

import { useState } from "react";
import { answeredFaqItems } from "./faq-data";

/**
 * One-at-a-time FAQ accordion.
 *
 * Real buttons with `aria-expanded` and `aria-controls`, and the panel is a
 * labelled region. The open/close itself is a `grid-template-rows` transition
 * from 0fr to 1fr, so the height animates smoothly without measuring anything
 * and without ever clipping the text mid-transition.
 */
export function FaqAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  const items = answeredFaqItems();

  return (
    <div className="faqList">
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <div key={item.id} className="faqItem" data-open={expanded ? "" : undefined}>
            <h3 className="faqQuestion">
              <button
                type="button"
                id={`faq-${item.id}-button`}
                aria-expanded={expanded}
                aria-controls={`faq-${item.id}-panel`}
                onClick={() => setOpen(expanded ? null : item.id)}
              >
                <span>{item.question}</span>
                {/* Two bars rather than an icon, so the vertical one can
                    collapse and turn the plus into a real minus. */}
                <span className="faqIcon" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>
            <div
              className="faqPanel"
              id={`faq-${item.id}-panel`}
              role="region"
              aria-labelledby={`faq-${item.id}-button`}
              // Kept in the DOM so the height can animate; `inert` takes it out
              // of the accessibility tree and the tab order while collapsed.
              inert={!expanded}
            >
              <div className="faqPanelInner">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
