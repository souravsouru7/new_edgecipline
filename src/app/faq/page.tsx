import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Mail, Sparkles } from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { FaqBrowser } from "@/components/faq/FaqBrowser";
import { faqItems, SUPPORT_EMAIL } from "@/data/faq";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, OG_LOCALE, TWITTER_DEFAULTS, OG_IMAGE_PATH, OG_IMAGE_SIZE, WEBSITE_ID, absoluteUrl } from "@/data/brand";
import styles from "@/components/faq/Faq.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const title = "FAQ — Edgecipline Questions & Answers";
const description =
  "Frequently asked questions about Edgecipline — the AI trading journal, discipline coach, and gamified improvement system. Who founded Edgecipline, Trading DNA, missions & streaks, Forex + Indian market support, pricing, and data privacy.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    siteName: BRAND_NAME,
    locale: OG_LOCALE,
    title,
    description:
      "Everything you want to know about Edgecipline — Trading DNA, missions & streaks, Forex + Indian market support, pricing, and data privacy.",
    type: "website",
              url: absoluteUrl("/faq"),
          images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    card: "summary_large_image",
    title: "Edgecipline FAQ — Common Questions Answered",
    description:
      "Questions about Trading DNA, missions & streaks, Forex/NIFTY/BANKNIFTY support, pricing, and more.",
    images: [OG_IMAGE_PATH],
  },
};

/**
 * FAQPage structured data, built from the same array the accordion renders.
 *
 * Structured data must only ever describe questions the page actually shows,
 * so this is generated rather than written out: the browser below filters by
 * toggling `hidden` and never unmounts anything, so every question here is in
 * the served HTML.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${absoluteUrl("/faq")}#faq`,
      url: absoluteUrl("/faq"),
      name: title,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: "en-IN",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "FAQ", item: absoluteUrl("/faq") },
      ],
    },
  ],
};

/**
 * /faq
 *
 * The hero, the help panel and the closing CTA are server-rendered; the only
 * client code is the browser island, which renders the questions it is given.
 *
 * The old page's "Contact us →" button is restored now that /contact exists;
 * the support address stays beside it, since some people would rather mail
 * than fill anything in.
 */
export default function FaqPage() {
  return (
    <div className={`${css("fqPage")} fqPage`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />

      <a className={css("fqSkip")} href="#questions">
        Skip to the questions
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("fqHero")} aria-labelledby="faq-title">
        <div className={css("fqHeroGlow")} aria-hidden="true" />
        <div className={css("fqHeroWeave")} aria-hidden="true" />

        <div className={css("fqInner")}>
          <div className={css("fqHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("fqCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">FAQ</li>
              </ol>
            </nav>

            <p className={css("fqLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              FAQ
            </p>

            <h1 id="faq-title" className={css("fqTitle")} data-reveal>
              Everything you want to know
            </h1>

            <p className={css("fqLede")} data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Questions about Edgecipline, Trading DNA, gamified missions &amp; streaks, pricing,
              and how it works for both Forex and Indian market traders.
            </p>
          </div>
        </div>
      </section>

      <main className={css("fqBody")} id="questions">
        <div className={css("fqInner")}>
          <FaqBrowser />

          <section className={css("fqHelp")} aria-labelledby="faq-help-title">
            <div>
              <h2 id="faq-help-title">Still have questions?</h2>
              <p>Reach out to the team — we respond to every message.</p>
            </div>
            <div className={css("fqHelpActions")}>
              <Link className={css("fqHelpAction")} href="/contact">
                Contact us
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <a className={css("fqHelpAlt")} href={`mailto:${SUPPORT_EMAIL}`}>
                <Mail aria-hidden="true" size={15} />
                {SUPPORT_EMAIL}
              </a>
            </div>
          </section>
        </div>
      </main>

      <section className={css("fqCta")} aria-labelledby="faq-cta-title">
        <div className={css("fqCtaGlow")} aria-hidden="true" />
        <div className={css("fqInner")}>
          <div className={css("fqCtaInner")}>
            <p className={css("fqLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="faq-cta-title" data-reveal>
              Ready to find your edge?
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Join the waitlist to request invite-only access and receive product and plan updates.
            </p>

            <div className={css("fqCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/pricing">
                See pricing
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
