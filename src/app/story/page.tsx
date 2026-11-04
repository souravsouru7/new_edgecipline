import type { Metadata } from "next";

import { StoryExperience } from "@/components/story3d/StoryExperience";
import {
  BRAND_NAME,
  OG_IMAGE_PATH,
  OG_IMAGE_SIZE,
  OG_LOCALE,
  ORGANIZATION_ID,
  TWITTER_DEFAULTS,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "@/data/brand";

const title = "Our Story | Why We Built Edgecipline";
const description =
  "From a losing streak to an AI trading coach built around trader psychology: find your behaviour patterns and trade with discipline. Told in 3D.";

// Next replaces the parent's openGraph/twitter objects wholesale, so the
// sitewide card has to be restated here or shares of /story go out bare.
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/story") },
  openGraph: {
    siteName: BRAND_NAME,
    locale: OG_LOCALE,
    title,
    description,
    type: "website",
    url: absoluteUrl("/story"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE, alt: `${BRAND_NAME} — our story` }],
  },
  twitter: { ...TWITTER_DEFAULTS, card: "summary_large_image", title, description, images: [OG_IMAGE_PATH] },
};

const storyGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/story")}#webpage`,
      url: absoluteUrl("/story"),
      name: title,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Our Story", item: absoluteUrl("/story") },
      ],
    },
  ],
};

export default function StoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(storyGraph) }} />
      <StoryExperience />
    </>
  );
}
