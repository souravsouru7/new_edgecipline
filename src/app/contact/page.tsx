import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, Camera, ChevronRight, Mail, Sparkles, SquarePlay, X } from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  company,
  CONTACT_EMAIL,
  INTRO,
  RESPONSE_TIME,
  socials,
  type SocialId,
} from "@/data/contact";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, OG_LOCALE, TWITTER_DEFAULTS, HEADQUARTERS, OG_IMAGE_PATH, OG_IMAGE_SIZE, absoluteUrl } from "@/data/brand";
import styles from "@/components/contact/Contact.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const url = absoluteUrl;

const title = "Contact Edgecipline — Get in Touch";
const description =
  "Have a question about Edgecipline? Reach out to the team. We respond to every message within 24–48 hours. Questions about waitlist, features, pricing, or partnerships welcome.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url("/contact") },
  openGraph: {
    siteName: BRAND_NAME,
    locale: OG_LOCALE,
    title,
    description: "Have a question about Edgecipline? Reach out — we respond within 24–48 hours.",
    type: "website",
    url: url("/contact"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    card: "summary_large_image",
    title,
    description: "Have a question? We respond to every message within 24–48 hours.",
    images: [OG_IMAGE_PATH],
  },
};

/**
 * lucide-react v1 dropped its brand icons, and drawing someone else's logo
 * from memory is how you ship a wrong one — so these are the closest generic
 * marks. Instagram and YouTube match what the sidebar's social row already
 * uses, so the two stay consistent.
 */
const SOCIAL_ICONS: Record<SocialId, typeof Mail> = {
  x: X,
  linkedin: Briefcase,
  instagram: Camera,
  youtube: SquarePlay,
};

/**
 * /contact
 *
 * SEO notes:
 *
 *   * `ContactPage` + `Organization` + `BreadcrumbList`. The Organization node
 *     carries a `contactPoint` with the real support address, and `sameAs`
 *     lists the four profiles the page itself links to — a profile that is not
 *     linked from the page does not belong in `sameAs`.
 *   * The address is in the HTML as a real `mailto:` link and as plain text,
 *     not assembled in JavaScript, so it is readable without running any.
 *   * One `h1`; the channel blocks and the form are `h2`s under it.
 *
 * Only the form is a client island. Everything that carries contact
 * information is server-rendered.
 */
export default function ContactPage() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${url("/contact")}#webpage`, url: url("/contact"),
        name: title,
        description,
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${url("/")}#organization`, url: url("/"),
        name: company.name,
        email: CONTACT_EMAIL,
        address: { "@type": "PostalAddress", ...HEADQUARTERS },
        sameAs: socials.map((social) => social.href),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: CONTACT_EMAIL,
            areaServed: "IN",
            availableLanguage: ["en"],
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: url("/contact"),
          },
        ],
      },
    ],
  };

  return (
    <div className={`${css("ctPage")} ctPage`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />

      <a className={css("ctSkip")} href="#reach-us">
        Skip to contact details
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("ctHero")} aria-labelledby="contact-title">
        <div className={css("ctHeroGlow")} aria-hidden="true" />
        <span className={css("ctHeroRule")} aria-hidden="true" />

        <div className={css("ctInner")}>
          <div className={css("ctHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("ctCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">Contact</li>
              </ol>
            </nav>

            <p className={css("ctLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Get in Touch
            </p>

            <h1 id="contact-title" className={css("ctTitle")} data-reveal>
              We read every message.
            </h1>

            <p className={css("ctLede")} data-reveal style={vars({ "--mo-delay": ".1s" })}>
              {INTRO}
            </p>
          </div>
        </div>
      </section>

      <main className={css("ctBody")} id="reach-us">
        <div className={css("ctInner")}>
          <div className={css("ctLayout")}>
            <div className={css("ctAside")}>
              <section className={css("ctEmailCard")} aria-labelledby="email-title" data-reveal>
                <h2 className={css("ctBlockTitle")} id="email-title">
                  Email
                </h2>
                <div className={css("ctEmailRow")}>
                  <a className={css("ctEmail")} href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail aria-hidden="true" size={18} />
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <p>{RESPONSE_TIME}</p>
              </section>

              <section className={css("ctCard")} aria-labelledby="social-title" data-reveal style={vars({ "--mo-delay": ".06s" })}>
                <h2 className={css("ctBlockTitle")} id="social-title">
                  Social
                </h2>
                <ul className={css("ctSocials")}>
                  {socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.id];
                    return (
                      <li key={social.id}>
                        <a href={social.href} target="_blank" rel="me noopener noreferrer">
                          <span className={css("ctSocialMark")} aria-hidden="true">
                            <Icon size={16} />
                          </span>
                          <span>{social.label}</span>
                          <span>{social.handle}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className={css("ctCard")} aria-labelledby="company-title" data-reveal style={vars({ "--mo-delay": ".12s" })}>
                <h2 className={css("ctBlockTitle")} id="company-title">
                  Company
                </h2>
                <address className={css("ctCompany")}>
                  <b>
                    <Building2 aria-hidden="true" size={14} style={{ marginRight: 7, verticalAlign: -2 }} />
                    {company.name}
                  </b>
                  <span>{company.country}</span>
                  <span className={css("ctCompanyNote")}>{company.note}</span>
                </address>
              </section>
            </div>

            <div data-reveal="from-right">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <section className={css("ctCta")} aria-labelledby="contact-cta-title">
        <div className={css("ctCtaGlow")} aria-hidden="true" />
        <div className={css("ctInner")}>
          <div className={css("ctCtaInner")}>
            <p className={css("ctLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="contact-cta-title" data-reveal>
              Or skip the question and join the list.
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              The waitlist is free. Join to request invite-only access and receive product and plan
              updates.
            </p>

            <div className={css("ctCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/faq">
                Read the FAQ
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
