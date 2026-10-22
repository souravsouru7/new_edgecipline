import type { Metadata } from "next";

import { ReferenceLanding } from "@/components/landing/ReferenceLanding";
import { steps } from "@/components/landing/HowItWorks";
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
    /**
     * The three-step process the page shows under "How It Works", in the
     * machine-readable form.
     *
     * `HowTo` no longer produces a rich result in Google — that was retired in
     * 2023 — so this is not here for a search appearance. It is here because
     * "how does Edgecipline work" is one of the few questions an answer engine
     * will actually be asked about a pre-launch product, and a `HowTo` with
     * three named, ordered steps is the shape that answers it. Each step's
     * text comes from the rendered component, so the two cannot diverge.
     *
     * No `totalTime`, no `estimatedCost`, no `supply`: the product is not
     * launched and none of those are known.
     */
    {
      "@type": "HowTo",
      "@id": `${absoluteUrl("/")}#how-it-works`,
      name: `How ${BRAND_NAME} works`,
      description: "A simple process. A powerful shift.",
      inLanguage: "en-IN",
      step: steps.map((item, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: item.title,
        text: item.description,
        url: `${absoluteUrl("/")}#how-it-works`,
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeGraph) }} />
      <ReferenceLanding />
    </>
  );
}
