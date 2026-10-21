import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Mail, SquareArrowOutUpRight } from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import {
  FOUNDER_NAMES_SENTENCE,
  FOUNDERS_ABOUT,
  FOUNDERS_LEDE,
  FOUNDERS_STATEMENT,
  SPLIT_NOTE,
  WHY_NOTE,
  founderFaqs,
  founders,
} from "@/data/founders";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, OG_IMAGE_PATH, OG_IMAGE_SIZE, absoluteUrl } from "@/data/brand";
import styles from "@/components/founders/Founders.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const url = absoluteUrl;
const personId = (slug: string) => (url(`/founders/${slug}`) ? `${url(`/founders/${slug}`)}#person` : undefined);

const title = `Founders of Edgecipline — ${FOUNDER_NAMES_SENTENCE}`;
const description =
  "Edgecipline has two founders. Sourav R is a co-founder and leads product, technology and strategy. Munavvir TP is a co-founder and leads operations, administration and people.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url("/founders") },
  openGraph: {
    siteName: BRAND_NAME,
    title,
    description,
    type: "website",
    url: url("/founders"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: { card: "summary_large_image", title, description },
};

/**
 * /founders
 *
 * SEO notes. The previous site invested heavily in founder entity markup, and
 * the reasoning is worth preserving: search engines merge `Person` entities by
 * `@id` plus repeated name/role agreement across pages, so every page that
 * mentions a founder has to agree on the name, the role and the id. All of it
 * comes from `src/data/founders.ts`, once.
 *
 *   * `Organization` with both founders listed in `founder`, plus a `Person`
 *     node per founder carrying the same `@id` the profile pages use, their
 *     job title, image, email, `sameAs` LinkedIn and `worksFor`.
 *   * `BreadcrumbList` for Home → Founders.
 *   * No `FAQPage` here, even though the founder FAQ is visible below. Those
 *     five questions are already in /faq's FAQPage; publishing the same
 *     FAQPage on two URLs splits the signal rather than strengthening it.
 *   * `ItemList` names both founders in order, which is the shape that answers
 *     "who are the founders of Edgecipline".
 */
export default function FoundersPage() {
  const people = founders.map((founder) => ({
    "@type": "Person",
    ...(personId(founder.slug) ? { "@id": personId(founder.slug), url: url(`/founders/${founder.slug}`) } : {}),
    name: founder.name,
    givenName: founder.givenName,
    familyName: founder.familyName,
    alternateName: [...founder.alternateNames],
    jobTitle: founder.role,
    description: founder.bio,
    knowsAbout: [...founder.expertise],
    email: founder.email,
    sameAs: [founder.linkedin],
    ...(url(founder.image) ? { image: url(founder.image) } : {}),
    worksFor: { "@id": `${url("/")}#organization` },
  }));

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${url("/founders")}#webpage`, url: url("/founders"),
        name: title,
        description,
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${url("/")}#organization`, url: url("/"),
        name: "Edgecipline Technologies",
        numberOfEmployees: founders.length,
        founder: people.map((person) =>
          person["@id"] ? { "@id": person["@id"] } : { "@type": "Person", name: person.name },
        ),
      },
      ...people,
      {
        "@type": "ItemList",
        name: "Founders of Edgecipline",
        itemListElement: founders.map((founder, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: founder.name,
          ...(url(`/founders/${founder.slug}`) ? { item: url(`/founders/${founder.slug}`) } : {}),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
          { "@type": "ListItem", position: 2, name: "Founders", item: url("/founders") },
        ],
      },
    ],
  };

  return (
    <div className={css("fdPage")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />

      <a className={css("fdSkip")} href="#the-founders">
        Skip to the founders
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("fdHero")} aria-labelledby="founders-title">
        <div className={css("fdHeroGlow")} aria-hidden="true" />
        <span className={css("fdHeroRule")} aria-hidden="true" />

        <div className={css("fdInner")}>
          <div className={css("fdHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("fdCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">Founders</li>
              </ol>
            </nav>

            <p className={css("fdLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Leadership
            </p>

            <h1 id="founders-title" className={css("fdTitle")} data-reveal>
              The founders of Edgecipline are <em>{FOUNDER_NAMES_SENTENCE}</em>
            </h1>

            <p className={css("fdLede")} data-reveal style={vars({ "--mo-delay": ".1s" })}>
              {FOUNDERS_LEDE}
            </p>

            <p className={css("fdStatement")} data-reveal style={vars({ "--mo-delay": ".16s" })}>
              <strong>Edgecipline was founded by {FOUNDER_NAMES_SENTENCE}.</strong> {FOUNDERS_STATEMENT}
            </p>
          </div>
        </div>
      </section>

      <main className={css("fdBody")}>
        <div className={css("fdInner")}>
          {/* About the founders */}
          <section className={css("fdSection")} aria-labelledby="about-founders-title">
            <header className={css("fdSectionHead")}>
              <p className={css("fdEyebrow")} data-reveal="fade">
                Background
              </p>
              <h2 id="about-founders-title" data-reveal>
                About the Edgecipline founders
              </h2>
              {FOUNDERS_ABOUT.map((paragraph, index) => (
                <p key={paragraph.slice(0, 32)} data-reveal style={vars({ "--mo-delay": `${0.06 + index * 0.05}s` })}>
                  {paragraph}
                </p>
              ))}
            </header>
          </section>

          {/* The pair */}
          <section className={css("fdSection")} id="the-founders" aria-labelledby="the-founders-title">
            <header className={css("fdSectionHead")}>
              <p className={css("fdEyebrow")} data-reveal="fade">
                The Founders
              </p>
              <h2 id="the-founders-title" data-reveal>
                Meet {FOUNDER_NAMES_SENTENCE}
              </h2>
            </header>

            <ul className={css("fdPair")}>
              {founders.map((founder, index) => (
                <li key={founder.slug} data-reveal style={vars({ "--mo-delay": `${index * 0.08}s` })}>
                  <article className={css("fdCard")}>
                    <div className={css("fdPortrait")}>
                      <Image
                        src={founder.image}
                        alt={`${founder.name}, ${founder.shortRole} at Edgecipline`}
                        width={900}
                        height={900}
                        sizes="(max-width: 767px) 92px, 112px"
                      />
                    </div>

                    <h3>
                      <Link href={`/founders/${founder.slug}`}>{founder.name}</Link>
                    </h3>
                    <p className={css("fdRole")}>{founder.role}</p>
                    <p className={css("fdBio")}>{founder.bio}</p>

                    <div className={css("fdOwns")}>
                      <p className={css("fdOwnsTitle")}>Role at Edgecipline</p>
                      <ul className={css("fdList")}>
                        {founder.responsibilities.map((item) => (
                          <li key={item}>
                            <Check aria-hidden="true" size={14} strokeWidth={2.8} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={css("fdCardFoot")}>
                      <Link className={css("fdCardLink")} href={`/founders/${founder.slug}`}>
                        {founder.name} profile
                        <ArrowRight aria-hidden="true" size={14} />
                      </Link>
                      <a
                        className={css("fdQuiet")}
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                        <SquareArrowOutUpRight aria-hidden="true" size={13} />
                      </a>
                      <a className={css("fdQuiet")} href={`mailto:${founder.email}`}>
                        <Mail aria-hidden="true" size={13} />
                        {founder.email}
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          {/* The split */}
          <section className={css("fdSection")} aria-labelledby="split-title">
            <header className={css("fdSectionHead")}>
              <p className={css("fdEyebrow")} data-reveal="fade">
                The Split
              </p>
              <h2 id="split-title" data-reveal>
                Clear ownership, no overlap
              </h2>
            </header>

            <div className={css("fdSplit")} data-reveal>
              {founders.map((founder) => (
                <div key={founder.slug} className={css("fdSplitHalf")}>
                  <b>{founder.name}</b>
                  <span className={css("fdSplitDomain")}>{founder.domain}</span>
                  <span className={css("fdSplitScope")}>{founder.scope}</span>
                </div>
              ))}
            </div>

            <p className={css("fdSplitNote")} data-reveal="fade">
              {SPLIT_NOTE}
            </p>
          </section>

          {/* Founder FAQ — visible here, with the FAQ markup owned by /faq. */}
          <section className={css("fdSection")} aria-labelledby="founder-faq-title">
            <header className={css("fdSectionHead")}>
              <p className={css("fdEyebrow")} data-reveal="fade">
                Founder FAQ
              </p>
              <h2 id="founder-faq-title" data-reveal>
                Questions about who founded Edgecipline
              </h2>
            </header>

            <ul className={css("fdFaq")}>
              {founderFaqs.map((faq, index) => (
                <li
                  key={faq.q}
                  className={css("fdFaqItem")}
                  data-reveal="rise-sm"
                  style={vars({ "--mo-delay": `${index * 0.04}s` })}
                >
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Why the company exists */}
          <section className={css("fdSection")} aria-labelledby="why-title">
            <header className={css("fdSectionHead")}>
              <p className={css("fdEyebrow")} data-reveal="fade">
                Why the company exists
              </p>
              <h2 id="why-title" data-reveal>
                Built by traders who felt this problem
              </h2>
              <p data-reveal>{WHY_NOTE}</p>
            </header>

            <Link className={css("fdCardLink")} href="/about" data-reveal="fade">
              Our story
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </section>
        </div>
      </main>

      <section className={css("fdCta")} aria-labelledby="founders-cta-title">
        <div className={css("fdCtaGlow")} aria-hidden="true" />
        <div className={css("fdInner")}>
          <div className={css("fdCtaInner")}>
            <p className={css("fdLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="founders-cta-title" data-reveal>
              Join the waitlist today.
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Be among the first traders to access Edgecipline when we launch. Priority access for
              early members.
            </p>

            <div className={css("fdCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/about">
                Read our story
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
