import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import {
  AREA_SERVED,
  BRAND_ALTERNATE_NAMES,
  BRAND_ETYMOLOGY,
  BRAND_ID,
  BRAND_NAME,
  BRAND_SLOGAN,
  CONTACT_EMAIL,
  LEGAL_NAME,
  LOGO_PATH,
  LOGO_SIZE,
  OG_IMAGE_PATH,
  OG_IMAGE_SIZE,
  ORGANIZATION_ID,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_PROFILES,
  SOFTWARE_ID,
  TWITTER_HANDLE,
  WEBSITE_ID,
  absoluteUrl,
  jsonLd,
} from "@/data/brand";
import "./globals.css";
// After globals.css on purpose: the motion layer refines those rules.
import "./motion.css";
// Last on purpose, in this order: the landing page's one continuous
// background layer and the section-level backgrounds it replaces, then the
// scroll stage that turns those sections into panels of one pinned frame.
import "./backdrop.css";
import "./stage.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Sitewide metadata.
 *
 * `metadataBase` is now unconditional, which is what makes every relative
 * canonical and Open Graph URL on the site resolve. `title.template` keeps the
 * brand token in every tab title without each page having to repeat it, and
 * `openGraph.siteName` is the field Google reads for the site name in search
 * results — both matter for a coined name that search engines currently try to
 * correct.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Page titles read "<page> | Edgecipline", so the coined token appears as a
    // proper noun on every result, not only the home page.
    template: `%s | ${BRAND_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: BRAND_NAME,
  alternates: { canonical: absoluteUrl("/") },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  authors: [{ name: LEGAL_NAME, url: SITE_URL }],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    locale: "en_IN",
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE, alt: `${BRAND_NAME} — ${BRAND_SLOGAN}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
  category: "finance",
};

/**
 * The sitewide entity graph.
 *
 * This is the piece the site was missing entirely, and the reason a coined
 * brand name gets treated as a typo: nothing told search engines that
 * Edgecipline is a named thing with a canonical URL, a logo and official
 * profiles. Four nodes, each with a stable `@id` that every page references
 * instead of declaring its own anonymous copy:
 *
 *   Organization  the company, with sameAs pointing at the real profiles
 *   WebSite       the site, publisher-linked to the Organization
 *   Brand         the name itself, carrying the etymology as a disambiguating
 *                 description — "a portmanteau of Edge and discipline… not a
 *                 misspelling" — which is the honest way to state this
 *   SoftwareApplication  the product
 *
 * Deliberately absent: `aggregateRating`, `review` and `offers`. There are no
 * ratings to report and no checkout, and inventing either is both a policy
 * violation and a misrepresentation. Pricing lives in the visible copy on
 * /pricing instead.
 */
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: LEGAL_NAME,
      alternateName: [BRAND_NAME, ...BRAND_ALTERNATE_NAMES],
      url: absoluteUrl("/"),
      email: CONTACT_EMAIL,
      slogan: BRAND_SLOGAN,
      description: SITE_DESCRIPTION,
      foundingDate: "2024",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      areaServed: [...AREA_SERVED],
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(LOGO_PATH),
        ...LOGO_SIZE,
      },
      image: absoluteUrl(OG_IMAGE_PATH),
      sameAs: SOCIAL_PROFILES,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
          areaServed: "IN",
          availableLanguage: ["en"],
        },
      ],
      brand: { "@id": BRAND_ID },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: absoluteUrl("/"),
      name: BRAND_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": ORGANIZATION_ID },
      about: { "@id": BRAND_ID },
    },
    {
      "@type": "Brand",
      "@id": BRAND_ID,
      name: BRAND_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
      // States the coined spelling plainly, without ever putting a
      // misspelling into a name field.
      description: `${BRAND_SLOGAN} ${BRAND_ETYMOLOGY}`,
      logo: absoluteUrl(LOGO_PATH),
      url: absoluteUrl("/"),
    },
    {
      "@type": "SoftwareApplication",
      "@id": SOFTWARE_ID,
      name: BRAND_NAME,
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Trading journal",
      operatingSystem: "Android, Web",
      description: SITE_DESCRIPTION,
      url: absoluteUrl("/"),
      inLanguage: "en-IN",
      publisher: { "@id": ORGANIZATION_ID },
      brand: { "@id": BRAND_ID },
      featureList: [
        "AI Screenshot Extraction",
        "Forex & Indian Market Modes",
        "Trading Journal",
        "Trading DNA & Pattern Detection",
        "Psychology Cost Calculator",
        "Risk Pattern Detection",
        "Self-Awareness Score",
        "Behavior & Performance Analytics",
        "Missions & Streaks",
        "AI Coach & Morning Mentor",
        "Weekly AI Reports",
        "Setup Checklists",
        "Native Android App",
        "Discipline & Psychology Timeline",
      ],
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph) }} />
        {children}
      </body>
    </html>
  );
}
