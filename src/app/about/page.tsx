import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Repeat,
  ScanFace,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import {
  beliefs,
  INTRO,
  launchStatus,
  milestones,
  pillars,
  story,
  STORY_ATTRIBUTION,
  type Belief,
} from "@/data/about";
import { FOUNDER_NAMES_SENTENCE, founders } from "@/data/founders";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, OG_LOCALE, TWITTER_DEFAULTS, OG_IMAGE_PATH, OG_IMAGE_SIZE, ORGANIZATION_ID, WEBSITE_ID, absoluteUrl, jsonLd, personId } from "@/data/brand";
import styles from "@/components/about/About.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const title = "About Edgecipline — Built by Traders Who Felt This Problem";
const description =
  "Why Edgecipline exists: the mission, the vision, the founder story, and the journey from a behavioural journal to an AI discipline coach for Forex and Indian market traders.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: {
    siteName: BRAND_NAME,
    locale: OG_LOCALE,
    title,
    description,
    type: "website",
              url: absoluteUrl("/about"),
          images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE_PATH],
  },
};

/** The old copy marked each belief with an emoji; these are its replacements. */
const BELIEF_ICONS: Record<Belief["icon"], typeof Target> = {
  edge: Target,
  data: BarChart3,
  mirror: ScanFace,
  execution: Zap,
  compound: Repeat,
  traders: Trophy,
};

/**
 * /about
 *
 * The quietest page on the site by design: no artwork, no demos, one accent
 * colour, and a reading measure that holds. It is entirely server-rendered —
 * there is no client JavaScript here beyond the shared reveal observer, which
 * renders nothing.
 */
/**
 * /about is the company page, so it corroborates the Organization and both
 * founder Person entities declared elsewhere — referencing them by `@id`
 * rather than restating them, which is what lets crawlers merge the three
 * pages that mention each founder into one person.
 */
const aboutGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${absoluteUrl("/about")}#webpage`,
      url: absoluteUrl("/about"),
      name: title,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      mentions: founders.map((founder) => ({ "@id": personId(founder.slug) })),
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      founder: founders.map((founder) => ({ "@id": personId(founder.slug) })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className={`${css("abPage")} abPage`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(aboutGraph) }} />

      <a className={css("abSkip")} href="#story">
        Skip to the story
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("abHero")} aria-labelledby="about-title">
        <div className={css("abHeroGlow")} aria-hidden="true" />
        <span className={css("abHeroRule")} aria-hidden="true" />

        <div className={css("abInner")}>
          <div className={css("abHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("abCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">About</li>
              </ol>
            </nav>

            <p className={css("abEyebrow")} data-reveal="fade">
              Our Story
            </p>

            <h1 id="about-title" className={css("abTitle")}>
              <span data-reveal>Built by traders who</span>
              <span data-reveal style={vars({ "--mo-delay": ".09s" })}>
                felt this problem.
              </span>
            </h1>

            <p className={css("abLede")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              {INTRO}
            </p>
          </div>
        </div>
      </section>

      <main className={css("abBody")}>
        {/* Mission and vision */}
        <section className={css("abSection")} aria-label="Mission and vision">
          <div className={css("abInner")}>
            <div className={css("abPillars")}>
              {pillars.map((pillar, index) => {
                const [before, accent, after] = pillar.statement;
                return (
                  <article
                    key={pillar.eyebrow}
                    className={css("abPillar")}
                    data-reveal
                    style={vars({ "--mo-delay": `${index * 0.08}s` })}
                  >
                    <p className={css("abEyebrow")}>{pillar.eyebrow}</p>
                    <h2>
                      {before}
                      <em>{accent}</em>
                      {after}
                    </h2>
                    <p>{pillar.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* The founder story */}
        <section className={css("abSection")} id="story" aria-labelledby="story-title">
          <div className={css("abInner")}>
            <header className={css("abStoryHead")}>
              <p className={css("abEyebrow")} data-reveal="fade">
                Why We Built This
              </p>
              <h2 className="sr-only" id="story-title">
                Why we built this
              </h2>
            </header>

            <figure className={css("abQuote")} data-reveal>
              <blockquote>
                {story.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </blockquote>

              <figcaption className={css("abAttribution")}>
                <span className={css("abAvatar")} aria-hidden="true">
                  {STORY_ATTRIBUTION.name.charAt(0)}
                </span>
                <span>
                  <b>{STORY_ATTRIBUTION.name}</b>
                  <span>{STORY_ATTRIBUTION.role}</span>
                </span>
              </figcaption>
            </figure>

            {/* Both founders are named here because /about is the company page,
                and each name links to its profile. The sentence is composed
                from the founder data rather than written out, so the names and
                the roles can never drift from /founders. */}
            <p className={css("abFounding")} data-reveal="fade">
              Edgecipline was founded by{" "}
              {founders.map((founder, index) => (
                <span key={founder.slug}>
                  <Link className={css("abFoundingLink")} href={`/founders/${founder.slug}`}>
                    {founder.name}
                  </Link>
                  , who leads {founder.leads}
                  {index < founders.length - 1 ? ", and " : ". "}
                </span>
              ))}
              The story above is {STORY_ATTRIBUTION.name.split(" ")[0]}&rsquo;s; the company runs on
              both of them.
            </p>

            <p className={css("abMeet")} data-reveal="fade">
              <Link href="/founders">
                Meet {FOUNDER_NAMES_SENTENCE}
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </p>
          </div>
        </section>

        {/* Journey */}
        <section className={css("abSection")} aria-labelledby="journey-title">
          <div className={css("abInner")}>
            <div className={css("abProse")}>
              <p className={css("abEyebrow")} data-reveal="fade">
                Our Journey
              </p>
              <h2 className={css("abTitle")} id="journey-title" data-reveal style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                From a losing year to a launch.
              </h2>

              <ol className={css("abTimeline")}>
                {milestones.map((milestone, index) => (
                  <li
                    key={milestone.year + milestone.label}
                    className={css("abMilestone")}
                    data-reveal="rise-sm"
                    style={vars({ "--mo-delay": `${index * 0.06}s` })}
                  >
                    <div className={css("abMilestoneHead")}>
                      <span className={css("abYear")}>{milestone.year}</span>
                      <h3>{milestone.label}</h3>
                    </div>
                    <p>{milestone.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className={css("abSection")} aria-labelledby="philosophy-title">
          <div className={css("abInner")}>
            <p className={css("abEyebrow")} data-reveal="fade">
              Philosophy
            </p>
            <h2 className={css("abTitle")} id="philosophy-title" data-reveal style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
              What we believe.
            </h2>

            <ul className={css("abBeliefs")}>
              {beliefs.map((belief, index) => {
                const Icon = BELIEF_ICONS[belief.icon];
                return (
                  <li
                    key={belief.title}
                    className={css("abBelief")}
                    data-reveal
                    style={vars({ "--mo-delay": `${(index % 3) * 0.07}s` })}
                  >
                    <span className={css("abBeliefIcon")} aria-hidden="true">
                      <Icon size={18} strokeWidth={1.9} />
                    </span>
                    <h3>{belief.title}</h3>
                    <p>{belief.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Launch status */}
        <section className={css("abSection")} aria-labelledby="status-title">
          <div className={css("abInner")}>
            <p className={css("abEyebrow")} data-reveal="fade">
              {launchStatus.eyebrow}
            </p>
            <h2 className="sr-only" id="status-title">
              Launch status
            </h2>

            <div className={css("abStatus")} data-reveal>
              <div className={css("abStatusState")}>
                <span className={css("abLive")}>
                  <i aria-hidden="true" />
                  {launchStatus.state}
                </span>
              </div>
              <p>{launchStatus.body}</p>
            </div>
          </div>
        </section>
      </main>

      <section className={css("abCta")} aria-labelledby="about-cta-title">
        <div className={css("abCtaGlow")} aria-hidden="true" />
        <div className={css("abInner")}>
          <div className={css("abCtaInner")}>
            <p className={css("abLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="about-cta-title" data-reveal>
              Join the waitlist today.
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Request an invitation to the completed web and Android product. Priority access is
              offered to early members.
            </p>

            <div className={css("abCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/features">
                See all 14 features
                <Sparkles aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
