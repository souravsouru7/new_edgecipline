import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { type Feature, type FeatureId, WAITLIST_HREF } from "@/data/features";
import { FeatureVisual } from "./FeatureVisual";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * Layout treatment per feature.
 *
 * The brief's first rule for this page is "avoid repeating 14 giant identical
 * two-column cards", so the grid is varied deliberately rather than
 * alternated mechanically:
 *
 *   flip   the visual leads on the left
 *   wide   the visual takes the larger column (artwork-led features)
 *   stack  one column, copy then a full-width visual (tables and timelines,
 *          which need the horizontal room and are unreadable in a half column)
 */
const LAYOUT: Record<FeatureId, { flip?: boolean; wide?: boolean; stack?: boolean }> = {
  screenshot: { wide: true },
  "dual-market": { flip: true },
  journal: { stack: true },
  "trading-dna": { flip: true, wide: true },
  psychology: { wide: true },
  "risk-patterns": { flip: true },
  "self-awareness": { stack: true },
  analytics: { flip: true, wide: true },
  missions: {},
  "ai-coach": { flip: true, wide: true },
  reports: {},
  checklists: { flip: true },
  android: { stack: true },
  "performance-review": { stack: true },
};

/**
 * One feature: index, title, source tagline, Problem, Solution, the "What you
 * get" bullets and its own visual.
 *
 * A Server Component. The heading is an `h3` because it sits under the group's
 * `h2`, which sits under the page's single `h1` — so the outline reads
 * page → stage → feature. The `id` is a published deep link.
 */
export function FeatureSection({ feature, cta }: { feature: Feature; cta?: boolean }) {
  const layout = LAYOUT[feature.id];

  return (
    <article
      id={feature.id}
      className={css("ftFeature")}
      data-flip={layout.flip ? "" : undefined}
      data-wide={layout.wide ? "" : undefined}
      data-stack={layout.stack ? "" : undefined}
      aria-labelledby={`${feature.id}-title`}
    >
      <div className={css("ftInner")}>
        <div className={css("ftFeatureInner")}>
          <div className={css("ftFeatureCopy")}>
            <p className={css("ftFeatureNumber")} data-reveal="fade">
              <span>{feature.number}</span>
              <i aria-hidden="true" />
              Feature
            </p>

            <h3 id={`${feature.id}-title`} data-reveal>
              {feature.title}
            </h3>

            <p className={css("ftTagline")} data-reveal style={vars({ "--mo-delay": ".08s" })}>
              {feature.tagline}
            </p>

            <dl className={css("ftProse")} data-reveal style={vars({ "--mo-delay": ".14s" })}>
              <div>
                <dt>The problem</dt>
                <dd>{feature.problem}</dd>
              </div>
              <div className={css("ftSolution")}>
                <dt>The solution</dt>
                <dd>{feature.solution}</dd>
              </div>
            </dl>

            <div data-reveal style={vars({ "--mo-delay": ".2s" })}>
              <p className={css("ftBenefitsTitle")}>What you get</p>
              <ul className={css("ftBenefits")}>
                {feature.benefits.map((benefit) => (
                  <li key={benefit}>
                    <Check aria-hidden="true" size={16} strokeWidth={2.6} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The source repeats its waitlist link under all fourteen
                features. Once per stage keeps the intent without turning the
                page into a column of identical buttons. */}
            {cta && (
              <Link
                className={css("ftFeatureCta")}
                href={WAITLIST_HREF}
                data-reveal="fade"
                style={vars({ "--mo-delay": ".26s" })}
              >
                Join the waitlist
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            )}
          </div>

          <div data-reveal={layout.flip ? "from-left" : "from-right"} style={vars({ "--mo-delay": ".1s" })}>
            <FeatureVisual id={feature.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
