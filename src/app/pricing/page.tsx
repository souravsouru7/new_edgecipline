import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { MobileNav } from "@/components/MobileNav";
import { SidebarNav } from "@/components/SidebarNav";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { PlanCards } from "@/components/pricing/PlanCards";
import { PlanCompare } from "@/components/pricing/PlanCompare";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, OG_IMAGE_PATH, OG_IMAGE_SIZE, SOFTWARE_ID, WEBSITE_ID, absoluteUrl, jsonLd } from "@/data/brand";
import styles from "@/components/pricing/Pricing.module.css";

const css = (name: string) => styles[name] || name;

const title = "Pricing — Edgecipline Plans & Early Access";
const description =
  "Edgecipline pricing: Standard ₹349/month, Professional ₹899 for 3 months (~₹9.99/day), Ultimate ₹1,499 for 6 months (~₹8.33/day). Trading DNA, missions & streaks, and AI coaching for Forex and Indian markets. Join the waitlist for founding-member pricing.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/pricing") },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: BRAND_NAME,
    title,
    description:
      "Three plans from ₹349/month. One bad trade costs more than a year of Edgecipline. Join the waitlist for founding pricing.",
    type: "website",
              url: absoluteUrl("/pricing"),
          images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edgecipline Pricing — From ₹349/month",
    description:
      "Standard ₹349/mo · Professional ₹899/3mo · Ultimate ₹1,499/6mo. Join the waitlist for founding pricing.",
    images: [OG_IMAGE_PATH],
  },
};

/**
 * /pricing
 *
 * No Product / Offer / AggregateOffer markup, carried over deliberately from
 * the previous site: Edgecipline is waitlist-only today, with no checkout and
 * no payment route anywhere in the project. Offer markup carries an implicit
 * claim that the product can be bought, so emitting it would misrepresent the
 * real business state. The prices in the visible copy are accurate; re-add
 * Offer nodes (with a real `availability` and `priceValidUntil`) only once a
 * genuine purchase or preorder flow ships.
 *
 * Everything that carries content is a Server Component. The only client code
 * is the comparison table's plan picker and the FAQ accordion.
 */
/**
 * Still no Product / Offer / AggregateOffer, for the reason documented below:
 * there is no checkout. This is a WebPage plus a breadcrumb, nothing that
 * implies the product can be bought today.
 */
const pricingGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/pricing")}#webpage`,
      url: absoluteUrl("/pricing"),
      name: title,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": SOFTWARE_ID },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Pricing", item: absoluteUrl("/pricing") },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <div className={css("ppPage")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(pricingGraph) }}
      />

      <a className={css("ppSkip")} href="#plans">
        Skip to plans
      </a>

      <RevealObserver />
      <SidebarNav />
      <MobileNav />

      <section className={css("ppHero")} aria-labelledby="pricing-title">
        <div className={css("ppHeroGlow")} aria-hidden="true" />
        <div className={css("ppGrid")} aria-hidden="true" />

        <div className={css("ppInner")}>
          <div className={css("ppHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("ppCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">Pricing</li>
              </ol>
            </nav>

            <p className={css("ppLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Pricing
            </p>

            <h1 id="pricing-title" className={css("ppTitle")}>
              <span data-reveal>Invest in your</span>
              <span data-reveal style={{ ["--mo-delay" as string]: ".09s" }}>
                <em>discipline.</em>
              </span>
            </h1>

            <p className={css("ppLede")} data-reveal style={{ ["--mo-delay" as string]: ".18s" }}>
              One bad trade costs more than a year of Edgecipline. Choose the timeframe that fits
              your journey.
            </p>
          </div>
        </div>
      </section>

      <main>
        <PlanCards />
        <PlanCompare />
        <PricingFaq />
      </main>

      <section className={css("ppCta")} aria-labelledby="pricing-cta-title">
        <div className={css("ppCtaGlow")} aria-hidden="true" />
        <div className={css("ppInner")}>
          <div className={css("ppCtaInner")}>
            <p className={css("ppLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="pricing-cta-title" data-reveal>
              Founding pricing — only for early members.
            </h2>

            <p data-reveal style={{ ["--mo-delay" as string]: ".1s" }}>
              Join the waitlist before public launch to lock in the best pricing. No credit card
              required.
            </p>

            <div
              className={css("ppCtaActions")}
              data-reveal
              style={{ ["--mo-delay" as string]: ".18s" }}
            >
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Free Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/features">
                See all 14 features
                <Sparkles aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
