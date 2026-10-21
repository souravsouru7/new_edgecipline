import type { Metadata } from "next";

import { MobileNav } from "@/components/MobileNav";
import { SidebarNav } from "@/components/SidebarNav";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { FeatureExplorer } from "@/components/features/FeatureExplorer";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeaturesCta } from "@/components/features/FeaturesCta";
import { FeaturesHero } from "@/components/features/FeaturesHero";
import { features, featuresInGroup, groups } from "@/data/features";
import { BRAND_NAME, OG_IMAGE_PATH, OG_IMAGE_SIZE, SOFTWARE_ID, WEBSITE_ID, absoluteUrl, jsonLd } from "@/data/brand";
import styles from "@/components/features/Features.module.css";

const css = (name: string) => styles[name] || name;

const title = "Edgecipline Features | AI Trading Discipline Coach for Forex & India";
const description =
  "All 14 Edgecipline features: AI screenshot extraction, Forex and Indian market modes, Trading DNA, the psychology cost calculator, missions and streaks, and daily AI coaching.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/features") },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: BRAND_NAME,
    title,
    description,
    type: "website",
    url: absoluteUrl("/features"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE_PATH],
  },
};

/**
 * This page documents all fourteen capabilities, so it carries the ItemList
 * that names them and links each to its own anchor — the shape a retrieval
 * tool needs to answer "what does Edgecipline do". The Organization, WebSite,
 * Brand and SoftwareApplication nodes come from the root layout; these
 * reference them by `@id` rather than restating them.
 */
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
    <div className={css("ftPage")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(featuresGraph) }}
      />

      <a className={css("ftSkip")} href="#features">
        Skip to features
      </a>

      <RevealObserver />
      <SidebarNav />
      <MobileNav />

      <FeaturesHero />
      <FeatureExplorer />

      <main className={css("ftBody")} id="features">
        {groups.map((group, groupIndex) => {
          const inGroup = featuresInGroup(group.id);
          return (
            <section
              key={group.id}
              className={css("ftGroup")}
              id={`group-${group.id}`}
              aria-labelledby={`group-${group.id}-title`}
            >
              <header className={css("ftGroupHead")}>
                <div className={css("ftInner")}>
                  <h2 id={`group-${group.id}-title`} data-reveal="fade">
                    <b aria-hidden="true">{String(groupIndex + 1).padStart(2, "0")}</b>
                    {group.title}
                  </h2>
                  <p data-reveal>{group.intro}</p>
                  <i className={css("ftGroupRule")} data-reveal="from-left" aria-hidden="true" />
                </div>
              </header>

              {inGroup.map((feature, index) => (
                <FeatureSection
                  key={feature.id}
                  feature={feature}
                  // One waitlist link per stage rather than fourteen.
                  cta={index === inGroup.length - 1}
                />
              ))}
            </section>
          );
        })}
      </main>

      <FeaturesCta />
    </div>
  );
}
