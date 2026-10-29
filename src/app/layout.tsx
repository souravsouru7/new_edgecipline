import type { Metadata, Viewport } from "next";
import { Doto, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";

import { WebVitals } from "@/components/WebVitals";
import { WaitlistDialog } from "@/components/waitlist/WaitlistDialog";
import {
  AREA_SERVED,
  BRAND_ALTERNATE_NAMES,
  BRAND_ETYMOLOGY,
  BRAND_ID,
  BRAND_NAME,
  BRAND_SLOGAN,
  CONTACT_EMAIL,
  FOUNDING_YEAR,
  HEADQUARTERS,
  LEGAL_NAME,
  IS_PREVIEW_DEPLOYMENT,
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
// The shell still owns the global .waitlist / .demo button classes and the
// data-reveal motion helpers used by the other routes.
import "./shell.css";
import "./motion.css";
// The landing page's design system: paper + green palette, Doto + Inter type,
// and the dark theme toggle layer.
import "./reference-landing.css";
import "./reference-motion.css";
import "./reference-polish.css";
import "./reference-theme.css";
import "./reference-loader.css";
// Shared chrome (header + footer) and the sitewide paper re-skin, applied to
// every non-landing route so the whole site reads as one visual system.
import "./edg-chrome.css";
import "./edg-reskin.css";

/**
 * The hybrid type system: a geometric display face for headings, a highly
 * readable text face for copy, and a monospace reserved for labels, step
 * numbers and chart metadata. Only the weights actually used are requested —
 * `next/font` self-hosts the files and inlines the `@font-face` rules, so
 * there is no connection to a font CDN on the critical path and no swap.
 */
const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const text = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
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
  alternates: {
    canonical: absoluteUrl("/"),
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
  robots: IS_PREVIEW_DEPLOYMENT
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : {
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
  manifest: "/manifest.webmanifest",
  /**
   * Search-engine ownership tokens, from the environment so a token is never
   * committed and a fork never claims someone else's property. Each key is
   * omitted entirely when its variable is unset — an empty `content` attribute
   * is a failed verification rather than an absent one.
   *
   * `NEXT_PUBLIC_` is correct here despite these rendering server-side: they
   * are public by definition, since the whole point is that they appear in the
   * HTML every visitor can read.
   */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
};

/**
 * The viewport, which is a separate export from `metadata` — `themeColor` and
 * `colorScheme` moved here, and setting them on `metadata` is deprecated.
 *
 * The site has one palette: the deep navy canvas `--bg` in globals.css. Both
 * theme colours are therefore the same value, declared per scheme anyway so a
 * light-mode browser tints its chrome to the page rather than to white. And
 * `colorScheme: "dark"` is what stops a browser painting a white canvas for
 * the fraction of a second before the stylesheet applies — the one flash a
 * dark site cannot style its way out of.
 *
 * No `maximumScale` or `userScalable`: pinch-zoom stays available. Disabling
 * it is an accessibility failure, and it is never worth the tidier layout.
 */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#050914" },
    { media: "(prefers-color-scheme: dark)", color: "#050914" },
  ],
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
 * ratings to report and no public checkout on this site, and inventing either is both a policy
 * violation and a misrepresentation. Pricing lives in the visible copy on
 * /pricing instead.
 */
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      // `name` is the entity name Google shows and matches on, so it is the
      // brand; the registered company name goes in `legalName`.
      name: BRAND_NAME,
      legalName: LEGAL_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
      url: absoluteUrl("/"),
      email: CONTACT_EMAIL,
      slogan: BRAND_SLOGAN,
      description: SITE_DESCRIPTION,
      foundingDate: FOUNDING_YEAR,
      address: { "@type": "PostalAddress", ...HEADQUARTERS },
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
      operatingSystem: ["Web", "Android"],
      description: SITE_DESCRIPTION,
      url: absoluteUrl("/"),
      inLanguage: "en-IN",
      publisher: { "@id": ORGANIZATION_ID },
      brand: { "@id": BRAND_ID },
      // Uncomment once the Android app is public on Google Play.
      // sameAs: ["PLAY_STORE_URL_HERE"],
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
      className={`${display.variable} ${text.variable} ${mono.variable} ${doto.variable} h-full antialiased`}
      // The pre-paint script below sets the theme and homepage loading state on
      // <html> before React hydrates. Both mutations are intentionally scoped
      // to this suppressed element; descendants remain strict hydration checks.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Resolve the homepage's light/dark choice before first paint so the
            theme never flashes. Reads the saved preference, else the OS one,
            and sets it on <html>; the dark palette in reference-theme.css is
            keyed off this attribute. Only the homepage (.edg-page) reacts to
            it, so it is a no-op on every other route. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('edg-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.edgTheme=t;}catch(e){}" +
              // CSS reads this attribute to lock the viewport. Mutating <html>
              // is safe because that is the element whose hydration warning is
              // suppressed; mutating <body style> caused a React mismatch.
              "if(window.location.pathname==='/'){document.documentElement.dataset.edgLoading='';}",
          }}
        />
        {/* rel=me links for entity verification */}
        {SOCIAL_PROFILES.map((href) => (
          <link key={href} rel="me" href={href} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph) }} />
        {children}
        <WaitlistDialog />
        {/* The dark-navy NeuralLoader was retired: every route now uses the
            paper landing palette, so a navy intro overlay no longer fits.
            The landing has its own LandingLoader; other routes load straight
            into the paper chrome. */}
        {/* Renders nothing; subscribes to the Core Web Vitals the browser
            reports, so the loader's real-world cost is measurable rather than
            argued about. */}
        <WebVitals />
      </body>
    </html>
  );
}
