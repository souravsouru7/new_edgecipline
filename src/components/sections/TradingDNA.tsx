import type { CSSProperties } from "react";
import Image from "next/image";

import { DnaFeatureIcon, type DnaIconName } from "./DnaFeatureIcon";
import { DnaHelix } from "./DnaHelix";
import styles from "./TradingDNA.module.css";

// Same helper the other section module uses: these class names are not hashed
// (see the note at the top of TradingDNA.module.css), so this falls through to
// the literal name.
const css = (name: string) => styles[name] || name;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

const features: ReadonlyArray<{ title: string; description: string; icon: DnaIconName }> = [
  { title: "Emotional Triggers", description: "What sets you off?", icon: "emotions" },
  { title: "Risk Behavior", description: "How you handle risk.", icon: "risk" },
  { title: "Strengths & Edges", description: "Where you naturally excel.", icon: "strengths" },
  { title: "Trading Personality", description: "Your unique trading style.", icon: "personality" },
];

// The reference artwork repeats DISCIPLINE as the fifth tag; the supplied
// vectors include an EXECUTION tag, which is used here to avoid the duplicate.
const tags = ["Emotions", "Risk", "Behavior", "Discipline", "Execution"] as const;

export function TradingDNA() {
  return (
    <section
      id="trading-dna"
      className={css("dna")}
      data-sequence
      aria-labelledby="trading-dna-title"
    >
      <div className={css("dnaBackdrop")} aria-hidden="true">
        <Image
          src="/images/trading-dna/particle-background.webp"
          alt=""
          fill
          sizes="100vw"
        />
      </div>
      <div className={css("dnaVeil")} aria-hidden="true" />

      <div className={css("dnaInner")}>
        <div className={css("dnaLead")}>
          <header className={css("dnaHeader")}>
            <h2 id="trading-dna-title" data-reveal>
              Your <span>Trading DNA</span>
            </h2>
            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              A deeper process. A powerful shift.
            </p>
          </header>

          <ul className={css("dnaFeatures")}>
            {features.map(({ title, description, icon }, index) => (
              <li key={title} data-reveal="from-left" style={vars({ "--i": index })}>
                <span className={css("dnaFeatureIcon")}>
                  <DnaFeatureIcon name={icon} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={css("dnaStage")}>
          <div className={css("dnaHelix")} data-reveal="fade">
            <DnaHelix />
          </div>
          <ul className={css("dnaTags")}>
            {tags.map((tag, index) => (
              <li key={tag} data-reveal="from-right" style={vars({ "--i": index })}>
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside
          className={css("dnaInsight")}
          data-reveal="from-right"
          style={vars({ "--mo-delay": ".2s" })}
        >
          <p className={css("dnaInsightLead")}>
            A deeper understanding leads to better decisions.
          </p>
          <p className={css("dnaInsightBody")}>
            Know your patterns. Trade a stronger version of yourself.
          </p>
        </aside>
      </div>
    </section>
  );
}
