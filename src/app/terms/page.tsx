import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalDateModified, termsOfService } from "@/data/legal";
import { BRAND_NAME, LEGAL_NAME, OG_IMAGE_PATH, OG_IMAGE_SIZE, absoluteUrl } from "@/data/brand";

const url = absoluteUrl;

// The root layout appends "| Edgecipline", so the title stays unbranded here.
const title = termsOfService.title;

export const metadata: Metadata = {
  title,
  description: termsOfService.description,
  alternates: { canonical: url("/terms") },
  openGraph: {
    siteName: BRAND_NAME,
    title,
    description: termsOfService.description,
    type: "article",
    url: url("/terms"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: { card: "summary", title, description: termsOfService.description },
};

/**
 * /terms
 *
 * `WebPage` schema only, for the same reason as /privacy: terms are not an
 * `Article`. `dateModified` comes from the document's own "Last updated" line.
 */
export default function TermsPage() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url("/terms")}#webpage`, url: url("/terms"),
    name: termsOfService.title,
    description: termsOfService.description,
    inLanguage: "en-IN",
    // From the document's own "Last updated" line, never today's date.
    dateModified: legalDateModified(termsOfService.updated),
    ...(url("/")
      ? { publisher: { "@type": "Organization", name: LEGAL_NAME, url: url("/") } }
      : {}),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: termsOfService.title,
          item: url("/terms"),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />
      <LegalPage doc={termsOfService} />
    </>
  );
}
