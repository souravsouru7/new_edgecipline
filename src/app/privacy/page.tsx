import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalDateModified, privacyPolicy } from "@/data/legal";
import { BRAND_NAME, OG_IMAGE_PATH, OG_IMAGE_SIZE, absoluteUrl } from "@/data/brand";

const url = absoluteUrl;

// The root layout appends "| Edgecipline", so the title stays unbranded here.
const title = privacyPolicy.title;

export const metadata: Metadata = {
  title,
  description: privacyPolicy.description,
  alternates: { canonical: url("/privacy") },
  openGraph: {
    siteName: BRAND_NAME,
    title,
    description: privacyPolicy.description,
    type: "article",
    url: url("/privacy"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: { card: "summary", title, description: privacyPolicy.description },
};

/**
 * /privacy
 *
 * `WebPage` schema only. A privacy policy is not an `Article` — no author, no
 * byline, no publication intent — and `dateModified` comes from the document
 * own "Last updated" line rather than today's date.
 */
export default function PrivacyPage() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url("/privacy")}#webpage`, url: url("/privacy"),
    name: privacyPolicy.title,
    description: privacyPolicy.description,
    inLanguage: "en-IN",
    // From the document's own "Last updated" line, never today's date.
    dateModified: legalDateModified(privacyPolicy.updated),
    ...(url("/")
      ? { publisher: { "@type": "Organization", name: "Edgecipline Technologies", url: url("/") } }
      : {}),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: privacyPolicy.title,
          item: url("/privacy"),
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
      <LegalPage doc={privacyPolicy} />
    </>
  );
}
