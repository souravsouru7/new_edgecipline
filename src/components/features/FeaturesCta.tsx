import type { CSSProperties } from "react";
import Link from "next/link";
import { Globe2, Layers, Sparkles } from "lucide-react";

import { features, WAITLIST_HREF } from "@/data/features";
import { FeatureScene } from "./FeatureScene";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The closing band, on the source's own heading and copy.
 *
 * The three items at the bottom are restricted to things the source document
 * actually states — the early-access status, the two markets, and the feature
 * count. No security certification, platform availability or performance
 * claim is added here.
 */
export function FeaturesCta() {
  return (
    <section className={css("ftxCta")} aria-labelledby="features-cta-title">
      <FeatureScene variant="grid" className={css("ftxCtaScene")} />

      <div className={css("ftxInner")}>
        <div className={css("ftxCtaInner")}>
          <p className={css("ftxEyebrow")} data-reveal="fade">
            <i aria-hidden="true" />
            Early access open
          </p>

          <h2 id="features-cta-title" data-reveal>
            All features. <em>One tool.</em>
          </h2>

          <p className={css("ftxLead")} data-reveal style={vars({ "--mo-delay": ".1s" })}>
            Edgecipline brings AI extraction, Trading DNA, gamified missions, and daily coaching
            together for Forex and Indian markets. Join the waitlist for early access.
          </p>

          <div className={css("ftxActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
            <Link className={css("ftxPrimary")} href={WAITLIST_HREF}>
              Join waitlist
              <span aria-hidden="true">→</span>
            </Link>
            <Link className={css("ftxGhost")} href="/">
              Back to the home page
            </Link>
          </div>

          <ul className={css("ftxTrust")} data-reveal="fade" style={vars({ "--mo-delay": ".24s" })}>
            <li>
              <Sparkles aria-hidden="true" size={14} />
              Early access is open
            </li>
            <li>
              <Globe2 aria-hidden="true" size={14} />
              Forex and Indian markets
            </li>
            <li>
              <Layers aria-hidden="true" size={14} />
              {features.length} features, one system
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
