import type { Metadata } from "next";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeaturesCta } from "@/components/features/FeaturesCta";
import { FeaturesHero } from "@/components/features/FeaturesHero";
import { StageHeader } from "@/components/features/StageHeader";
import { features, featuresInGroup, groups } from "@/data/features";
import { BRAND_NAME, OG_LOCALE, TWITTER_DEFAULTS, SOFTWARE_ID, WEBSITE_ID, absoluteUrl, jsonLd } from "@/data/brand";
import styles from "@/components/features/Features.module.css";

const css = (name: string) => styles[name] || name;

const title = "Edgecipline Features | AI Trading Discipline Coach for Forex & India";
const description =
  "All 14 Edgecipline features: AI screenshot extraction, Forex and Indian market modes, Trading DNA, the psychology cost calculator, missions and streaks, and daily AI coaching.";

  /* No `images` here on purpose: `opengraph-image.tsx` in this segment
     generates the card, and an explicit `images` in metadata would override
     the file convention and put the generic sitewide card back. Twitter has
     no separate `twitter-image` because the crop is identical — 1200x630,
     summary_large_image — and X falls back to og:image, so a second file
     would be the same picture generated twice. */
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/features") },
  openGraph: {
    siteName: BRAND_NAME,
    locale: OG_LOCALE,
    title,
    description,
    type: "website",
    url: absoluteUrl("/features"),
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    card: "summary_large_image",
    title,
    description,
  },
};

/**
 * This page documents all fourteen capabilities, so it carries the ItemList
 * that names them and links each to its own anchor — the shape a retrieval
 * tool needs to answer "what does Edgecipline do". The Organization, WebSite,
 * Brand and SoftwareApplication nodes come from the root layout; these
 * reference them by `@id` rather than restating them.
 *
 * It also carries the glossary. "Trading DNA", "Psychology Cost" and
 * "Self-Awareness Score" are coined product concepts, and an answer engine
 * asked what Trading DNA is has no way to tell a defined term from a marketing
 * phrase unless the page says so. A `DefinedTermSet` says so, and each term
 * points at the feature section that defines it — so the definition a model
 * retrieves is the one on the page, not one it invented.
 *
 * Only these three are listed. The other eleven features are ordinary product
 * capabilities with self-explanatory names; defining "Trading Journal" as a
 * term of art would be noise.
 */

/**
 * The coined terms, each tied to the feature that defines it. The definition
 * text is the feature's own `solution` line — one source, so the glossary can
 * never describe the term differently from the section beneath it.
 */
const GLOSSARY_IDS = ["trading-dna", "psychology", "self-awareness"] as const;

const glossaryTerms = GLOSSARY_IDS.map((id) => {
  const feature = features.find((item) => item.id === id);
  if (!feature) throw new Error(`Glossary term "${id}" is not a known feature id.`);

  return {
    "@type": "DefinedTerm",
    "@id": `${absoluteUrl("/features")}#term-${feature.id}`,
    name: feature.title,
    description: feature.solution,
    url: `${absoluteUrl("/features")}#${feature.id}`,
    inDefinedTermSet: `${absoluteUrl("/features")}#glossary`,
  };
});
const featuresGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/features")}#webpage`,
      url: absoluteUrl("/features"),
      name: title,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": SOFTWARE_ID },
      inLanguage: "en-IN",
    },
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/features")}#features`,
      name: `${BRAND_NAME} features`,
      numberOfItems: features.length,
      itemListElement: features.map((feature, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: feature.title,
        description: feature.tagline,
        url: `${absoluteUrl("/features")}#${feature.id}`,
      })),
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${absoluteUrl("/features")}#glossary`,
      name: `${BRAND_NAME} glossary`,
      description: `Concepts coined by ${BRAND_NAME} and defined on this page.`,
      url: absoluteUrl("/features"),
      inLanguage: "en-IN",
      hasDefinedTerm: glossaryTerms,
    },
    ...glossaryTerms,
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
      ],
    },
  ],
};

/**
 * /features — the fourteen features, in the source's own order and under the
 * source's own anchors.
 *
 * Everything that carries content is a Server Component, so the page is static
 * HTML with a complete heading outline. The only client code is the explorer's
 * filter, the three interactive demos, and the shared reveal observer — all of
 * them islands that render no content of their own.
 */
export default function FeaturesPage() {
  return (
    <div className={css("ftxPage")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(featuresGraph) }}
      />

      <a className={css("ftxSkip")} href="#features">
        Skip to features
      </a>

      <RevealObserver />
      <Navbar />

      <FeaturesHero />

      <main className={css("ftxBody")} id="features">
        {groups.map((group, groupIndex) => {
          const inGroup = featuresInGroup(group.id);
          return (
            <section key={group.id} className={css("ftxStageGroup")} aria-labelledby={`group-${group.id}-title`}>
              <StageHeader group={group} index={groupIndex} total={groups.length} />
              {inGroup.map((feature, index) => (
                <FeatureSection
                  key={feature.id}
                  feature={feature}
                  stage={group.title}
                  // One waitlist link per stage rather than fourteen.
                  cta={index === inGroup.length - 1}
                />
              ))}
            </section>
          );
        })}
      </main>

      <FeaturesCta />
      <SiteFooter />
    </div>
  );
}
