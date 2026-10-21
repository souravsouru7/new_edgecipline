"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;

/**
 * Feature 12 — a pre-trade checklist you can actually tick.
 *
 * Real checkboxes in a real label, so the whole thing is keyboard-operable and
 * reads correctly to a screen reader; the box is a styled sibling rather than
 * a div pretending to be a control. Nothing is stored and nothing is sent —
 * the state is local and the panel is labelled DEMO, because a visitor ticking
 * boxes on a marketing page must not look like it logged a trade.
 */
const ITEMS = [
  "Setup matches my written plan",
  "Risk is 1% or less of the account",
  "Stop loss is placed before entry",
  "Session is one of my best (DNA report)",
  "I am calm, not chasing a previous loss",
] as const;

export function ChecklistDemo() {
  const [ticked, setTicked] = useState<readonly string[]>([]);

  const toggle = (item: string) =>
    setTicked((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );

  const percent = Math.round((ticked.length / ITEMS.length) * 100);

  return (
    <div>
      <ul className={css("ftChecklist")}>
        {ITEMS.map((item) => (
          <li key={item}>
            <label>
              <input
                type="checkbox"
                checked={ticked.includes(item)}
                onChange={() => toggle(item)}
              />
              <span className={css("ftBox")} aria-hidden="true">
                <Check size={14} strokeWidth={3} />
              </span>
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className={css("ftChecklistFoot")}>
        <p>
          Adherence this trade: <b>{percent}%</b> — logged against the outcome, so you can see how
          rule adherence predicts results.
        </p>
      </div>
    </div>
  );
}
