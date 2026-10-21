import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PlayCircle } from "lucide-react";

import { pills, WAITLIST_HREF } from "@/data/features";
import styles from "./Features.module.css";

// These class names are not hashed (see the note at the top of the stylesheet),
// so this falls through to the literal name.
const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The /features hero.
 *
 * A Server Component: the heading, summary and call to action are in the HTML
 * that the crawler and the first paint both see. The only motion is the
 * page-wide `data-reveal` system, so there is no client JavaScript here at all.
 */
export function FeaturesHero() {
  return (
    <section className={css("ftHero")} aria-labelledby="features-title">
      {/* Abstract ribbons from the supplied kit — decorative, hence aria-hidden
          and no alt text. It is not a product screenshot. */}
      <div className={css("ftHeroArt")} aria-hidden="true">
        <Image
          src="/features/art/04_behavior_analytics_waves.svg"
          alt=""
          width={1600}
          height={1000}
          priority
          unoptimized
        />
      </div>
      <div className={css("ftHeroGlow")} aria-hidden="true" />
      <div className={css("ftGrid")} aria-hidden="true" />

      <div className={css("ftInner")}>
        <div className={css("ftHeroInner")}>
          <div>
            <nav aria-label="Breadcrumb">
              <ol className={css("ftCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">Features</li>
              </ol>
            </nav>

            <p className={css("ftLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Product Features
            </p>

            {/* Three grouped lines rather than per-word spans: the reveal is
                typesetting, not a stunt, and the heading stays one text node
                per line for selection and translation. */}
            <h1 id="features-title" className={css("ftHeroTitle")}>
              <span data-reveal>Not just</span>
              <span data-reveal style={vars({ "--mo-delay": ".09s" })}>
                a journal —
              </span>
              <span data-reveal style={vars({ "--mo-delay": ".18s" })}>
                <em>a discipline coach.</em>
              </span>
            </h1>

            <p className={css("ftHeroSummary")} data-reveal style={vars({ "--mo-delay": ".26s" })}>
              Edgecipline combines AI screenshot extraction, Trading DNA, a psychology cost
              calculator, gamified missions &amp; streaks, and daily AI coaching into one system
              built for Forex and Indian market traders.
            </p>

            <div className={css("ftHeroActions")} data-reveal style={vars({ "--mo-delay": ".34s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <a className="demo" href="#features">
                See all 14 features
                <PlayCircle aria-hidden="true" size={20} />
              </a>
            </div>

            <p className={css("ftHeroNote")} data-reveal style={vars({ "--mo-delay": ".4s" })}>
              These are planned launch capabilities. Join the waitlist for confirmed availability.
            </p>
          </div>

          <figure className={css("ftHeroFigure")} data-reveal="from-right" aria-hidden="true">
            <Image
              src="/features/art/01_trading_dna_helix.svg"
              alt=""
              width={1600}
              height={1000}
              priority
              unoptimized
            />
          </figure>
        </div>

        {/* Editorial navigation into the four groups — not feature claims. */}
        <ul className={css("ftPills")} aria-label="Jump to a stage">
          {pills.map(({ label, group }, index) => (
            <li key={label} data-reveal="rise-sm" style={vars({ "--mo-delay": `${0.42 + index * 0.06}s` })}>
              <a href={`#group-${group}`}>
                <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
