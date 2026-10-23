import type { CSSProperties } from "react";
import Link from "next/link";
import { ChevronRight, CornerDownRight } from "lucide-react";

import { features, pills, WAITLIST_HREF } from "@/data/features";
import { FeatureScene } from "./FeatureScene";
import styles from "./Features.module.css";

// These class names are not hashed (see the note at the top of the stylesheet),
// so this falls through to the literal name.
const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/** The readouts framing the lattice. Each one is a fact the page itself states. */
const TELEMETRY = [
  ["MODULES", String(features.length).padStart(2, "0")],
  ["STAGES", "04"],
  ["MARKETS", "FX / IN"],
  ["STATUS", "INVITE-ONLY"],
] as const;

/**
 * The /features hero.
 *
 * Everything that carries meaning is server-rendered: the heading, the
 * summary, the call to action and the stage index are in the first HTML the
 * crawler and the first paint both see. The lattice beside them is the page's
 * one interactive WebGL plate and renders nothing readable, so it loads only
 * when it is near the viewport and is skipped entirely under reduced motion.
 */
export function FeaturesHero() {
  return (
    <section className={css("ftxHero")} aria-labelledby="features-title">
      <div className={css("ftxHeroField")} aria-hidden="true">
        <span className={css("ftxSweep")} />
      </div>

      <div className={css("ftxInner")}>
        <nav aria-label="Breadcrumb">
          <ol className={css("ftxCrumbs")}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} />
            </li>
            <li aria-current="page">Features</li>
          </ol>
        </nav>

        <div className={css("ftxHeroGrid")}>
          <div className={css("ftxHeroCopy")}>
            <p className={css("ftxEyebrow")} data-reveal="fade">
              <i aria-hidden="true" />
              Product system — {features.length} modules
            </p>

            {/* Three grouped lines rather than per-word spans: the reveal is
                typesetting, not a stunt, and the heading stays one text node
                per line for selection and translation. */}
            <h1 id="features-title" className={css("ftxHeroTitle")}>
              <span data-reveal>Not just</span>
              <span data-reveal style={vars({ "--mo-delay": ".09s" })}>
                a journal —
              </span>
              <span data-reveal style={vars({ "--mo-delay": ".18s" })}>
                <em>a discipline coach.</em>
              </span>
            </h1>

            <p className={css("ftxLead")} data-reveal style={vars({ "--mo-delay": ".26s" })}>
              Edgecipline combines AI screenshot extraction, Trading DNA, a psychology cost
              calculator, gamified missions &amp; streaks, and daily AI coaching into one system
              built for Forex and Indian market traders.
            </p>

            <div className={css("ftxActions")} data-reveal style={vars({ "--mo-delay": ".34s" })}>
              <Link className={css("ftxPrimary")} href={WAITLIST_HREF}>
                Join waitlist
                <span aria-hidden="true">→</span>
              </Link>
              <a className={css("ftxGhost")} href="#features">
                See all {features.length} features
                <CornerDownRight aria-hidden="true" size={15} />
              </a>
            </div>

            <p className={css("ftxFinePrint")} data-reveal style={vars({ "--mo-delay": ".4s" })}>
              The product is complete on web and Android. Access is currently invite-only.
            </p>
          </div>

          <div className={css("ftxHeroPlate")} data-reveal="fade" style={vars({ "--mo-delay": ".2s" })}>
            <FeatureScene variant="core" className={css("ftxScene")} />

            <dl className={css("ftxTelemetry")} aria-hidden="true">
              {TELEMETRY.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <p className={css("ftxPlateStamp")} aria-hidden="true">
              FIG. 00 — SYSTEM LATTICE
            </p>
          </div>
        </div>

        {/* Editorial navigation into the four stages — not feature claims. */}
        <ol className={css("ftxStageIndex")} aria-label="Jump to a stage">
          {pills.map(({ label, group }, index) => (
            <li
              key={label}
              data-reveal="rise-sm"
              style={vars({ "--mo-delay": `${0.42 + index * 0.06}s` })}
            >
              <a href={`#group-${group}`}>
                <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
                <span>{label}</span>
                <i aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
