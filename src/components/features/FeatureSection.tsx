import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { type Feature, type FeatureId, WAITLIST_HREF } from "@/data/features";
import { FeatureVisual } from "./FeatureVisual";
import { TiltPlate } from "./TiltPlate";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * Layout treatment per feature.
 *
 * The page's first rule is "no fourteen identical two-column cards", so the
 * plates vary deliberately rather than alternating mechanically:
 *
 *   mirror  the visual leads, copy follows
 *   wide    the visual takes the larger column (artwork-led features)
 *   full    one column, copy then a full-width visual (tables and timelines,
 *           which need the horizontal room and are unreadable in half of one)
 */
const LAYOUT: Record<FeatureId, "default" | "mirror" | "wide" | "mirror-wide" | "full"> = {
  screenshot: "wide",
  "dual-market": "mirror",
  journal: "full",
  "trading-dna": "mirror-wide",
  psychology: "wide",
  "risk-patterns": "mirror",
  "self-awareness": "full",
  analytics: "mirror-wide",
  missions: "default",
  "ai-coach": "mirror-wide",
  reports: "default",
  checklists: "mirror",
  android: "full",
  "performance-review": "full",
};

/**
 * One feature, drawn as a numbered plate hanging off the page's spine.
 *
 * A Server Component except for the tilt wrapper, which only writes custom
 * properties. The heading is an `h3` because it sits under the stage's `h2`,
 * which sits under the page's single `h1` — so the outline reads
 * page → stage → feature. The `id` is a published deep link.
 */
export function FeatureSection({
  feature,
  stage,
  cta,
}: {
  feature: Feature;
  stage: string;
  cta?: boolean;
}) {
  const layout = LAYOUT[feature.id];

  return (
    <article
      id={feature.id}
      className={css("ftxFeature")}
      data-layout={layout}
      aria-labelledby={`${feature.id}-title`}
    >
      <div className={css("ftxInner")}>
        <div className={css("ftxSpine")} aria-hidden="true" data-sequence>
          <span className={css("ftxNode")} />
          <span className={css("ftxSpineTag")}>{stage}</span>
        </div>

        <TiltPlate className={css("ftxPlate")}>
          <div className={css("ftxPlateFrame")} data-sequence>
            <span className={css("ftxBrackets")} aria-hidden="true" />

            <header className={css("ftxPlateHead")} aria-hidden="true">
              <span>
                MOD <b>{feature.number}</b> / 14
              </span>
              <span className={css("ftxPlateTrace")} />
              <span>{stage}</span>
            </header>

            <div className={css("ftxPlateBody")}>
              <div className={css("ftxPlateCopy")}>
                <b className={css("ftxPlateNum")} aria-hidden="true">
                  {feature.number}
                </b>

                <h3 id={`${feature.id}-title`} data-reveal>
                  {feature.title}
                </h3>

                <p className={css("ftxTagline")} data-reveal style={vars({ "--mo-delay": ".06s" })}>
                  {feature.tagline}
                </p>

                <dl className={css("ftProse")} data-reveal style={vars({ "--mo-delay": ".12s" })}>
                  <div>
                    <dt>The problem</dt>
                    <dd>{feature.problem}</dd>
                  </div>
                  <div className={css("ftSolution")}>
                    <dt>The solution</dt>
                    <dd>{feature.solution}</dd>
                  </div>
                </dl>

                <div data-reveal style={vars({ "--mo-delay": ".18s" })}>
                  <p className={css("ftBenefitsTitle")}>What you get</p>
                  <ul className={css("ftBenefits")}>
                    {feature.benefits.map((benefit, index) => (
                      <li key={benefit} style={vars({ "--i": index })}>
                        <i aria-hidden="true" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The source repeats its waitlist link under all fourteen
                    features. Once per stage keeps the intent without turning
                    the page into a column of identical buttons. */}
                {cta && (
                  <Link
                    className={css("ftxPlateCta")}
                    href={WAITLIST_HREF}
                    data-reveal="fade"
                    style={vars({ "--mo-delay": ".24s" })}
                  >
                    Join the waitlist
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                )}
              </div>

              <div
                className={css("ftxPlateVisual")}
                data-reveal={layout.startsWith("mirror") ? "from-left" : "from-right"}
                style={vars({ "--mo-delay": ".1s" })}
              >
                <FeatureVisual id={feature.id} />
              </div>
            </div>
          </div>
        </TiltPlate>
      </div>
    </article>
  );
}
