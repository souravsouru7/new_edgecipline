import type { CSSProperties } from "react";
import Link from "next/link";
import { Globe2, Layers, Sparkles } from "lucide-react";

import { features, WAITLIST_HREF } from "@/data/features";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The closing section, on the source's own heading and copy.
 *
 * The three items at the bottom are restricted to things the source document
 * actually states — the early-access status, the two markets, and the feature
 * count. No security certification, platform availability or performance
 * claim is added here.
 */
export function FeaturesCta() {
  return (
    <section className={css("ftCta")} aria-labelledby="features-cta-title">
      <div className={css("ftCtaGlow")} aria-hidden="true" />

      <div className={css("ftInner")}>
        <div className={css("ftCtaInner")}>
          <p className={css("ftLabel")} data-reveal="fade">
            <i aria-hidden="true" />
            Early Access Open
          </p>

          <h2 id="features-cta-title" data-reveal>
            All features. One tool.
          </h2>

          <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
            Edgecipline brings AI extraction, Trading DNA, gamified missions, and daily coaching
            together for Forex and Indian markets. Join the waitlist for early access.
          </p>

          <div className={css("ftCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
            <Link className="waitlist" href={WAITLIST_HREF}>
              Join Waitlist <span aria-hidden="true">→</span>
            </Link>
            <Link className="demo" href="/">
              Back to the home page
            </Link>
          </div>

          <ul className={css("ftTrust")} data-reveal="fade" style={vars({ "--mo-delay": ".24s" })}>
            <li>
              <Sparkles aria-hidden="true" size={15} />
              Early access is open
            </li>
            <li>
              <Globe2 aria-hidden="true" size={15} />
              Forex and Indian markets
            </li>
            <li>
              <Layers aria-hidden="true" size={15} />
              {features.length} features, one system
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
