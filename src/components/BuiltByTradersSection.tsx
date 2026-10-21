import type { CSSProperties } from "react";
import Image from "next/image";

import { NeuralOverlay } from "./story/NeuralOverlay";
import "./BuiltByTraders.module.css";

/**
 * The three neural strands, named.
 *
 * These labels — "Real Struggles", "Real Traders", "A Clearer Tomorrow" —
 * used to be a column of text floated over the artwork at `top: 20%; left:
 * 6.5%`, next to nothing in particular. They are the three strands of the
 * neural overlay, in order, so they are a legend for it: each one names the
 * stage its strand stands for, with the strand's own colour beside it.
 *
 * `strand` must match the ids in story/NeuralOverlay.tsx.
 */
const strands = [
  { label: "Real Struggles", strand: "struggles" },
  { label: "Real Traders", strand: "awareness" },
  { label: "A Clearer Tomorrow", strand: "growth" },
] as const;

const features = [
  { label: "Real Experience", icon: "/built-by-traders/experience.webp" },
  { label: "Practical Insights", icon: "/built-by-traders/insights.webp" },
  { label: "A Calmer Stronger You", icon: "/built-by-traders/calmer.webp" },
];

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function BuiltByTradersSection() {
  return (
    <section id="story" className="built-traders" data-sequence aria-labelledby="story-heading">
      <div className="story-inner">
        <div className="story-copy">
          <h2 id="story-heading" data-reveal>
            Built by <span>traders,</span>
            <br />
            <span>for traders.</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".14s" })}>
            Edgecipline was born from real trading struggles — the overtrading, the impulsive
            decisions, the frustration. We built it to help traders like us gain self-awareness,
            understand behavior, and trade with a calmer, clearer mind.
          </p>

          <ul className="story-features">
            {features.map(({ label, icon }, index) => (
              <li key={label} data-reveal="rise-sm" style={vars({ "--i": index })}>
                <Image src={icon} alt="" width={160} height={160} sizes="48px" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="story-visual">
          <span className="story-aura" aria-hidden="true" />
          <NeuralOverlay />
          <Image
            src="/built-by-traders/trader.webp"
            alt=""
            width={1500}
            height={1241}
            sizes="(max-width: 900px) 92vw, 46vw"
          />

          <ul className="story-rail-labels">
            {strands.map(({ label, strand }, index) => (
              <li
                key={label}
                data-strand={strand}
                data-reveal="from-left"
                style={vars({ "--i": index })}
              >
                <i aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
