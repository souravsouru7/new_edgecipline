import type { Metadata } from "next";

import { EdgeciplineHero } from "@/components/EdgeciplineHero";
import {
  BRAND_ID,
  BRAND_NAME,
  ORGANIZATION_ID,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SOFTWARE_ID,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "@/data/brand";
import { features } from "@/data/features";

export const metadata: Metadata = {
  // The home page is the one title that should not take the "| Edgecipline"
  // template, because the brand token already opens it.
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/") },
};

/**
 * Home-page-only nodes. The sitewide Organization / WebSite / Brand /
 * SoftwareApplication graph lives in app/layout.tsx; these point at it by
 * `@id` rather than restating it, so crawlers merge them into one entity
 * instead of seeing two companies with the same name.
 *
 * The ItemList is the useful part for AI retrieval: it names all fourteen
 * capabilities and links each to its anchor on /features, so a retrieval tool
 * reading the home page can see what the product does and where each feature
 * is documented.
 */
const homeGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/")}#webpage`,
      url: absoluteUrl("/"),
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      mentions: [{ "@id": BRAND_ID }, { "@id": SOFTWARE_ID }],
      inLanguage: "en-IN",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        ],
      },
    },
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/")}#features`,
      name: `${BRAND_NAME} features`,
      description: `The ${features.length} capabilities that make up ${BRAND_NAME}.`,
      numberOfItems: features.length,
      itemListElement: features.map((feature, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: feature.title,
        description: feature.tagline,
        url: `${absoluteUrl("/features")}#${feature.id}`,
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeGraph) }} />
      <EdgeciplineHero />
    </>
  );
}
