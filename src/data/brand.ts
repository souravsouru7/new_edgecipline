// ─────────────────────────────────────────────────────────────────────────────
// BRAND ENTITY — single source of truth
//
// Used by: the root layout's metadata and JSON-LD graph, robots.ts,
// sitemap.ts, and every page that emits a canonical, an Open Graph tag or a
// schema node.
//
// "Edgecipline" is a coined brand name (Edge + discipline). It is NOT a
// misspelling of "discipline". Search engines stop treating a coined name as a
// typo once they consistently see one entity: the same name, URL, logo and @id
// on every page, cross-confirmed by the social profiles in SOCIAL_PROFILES.
//
//   ⚠ Never put the word "discipline" on its own in a `name` or
//     `alternateName` field. An alternateName must be a real alternative name
//     for this brand — never a competitor's name, never a deliberate
//     misspelling. Feeding a misspelling into alternateName teaches search
//     engines the opposite of what we want.
//
// This module exists because the facts below were previously restated in
// fourteen separate files. Entity recognition depends on those facts agreeing
// everywhere, so they are defined once here and imported.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Canonical origin.
 *
 * The verified www host is fixed here so staging builds cannot accidentally
 * publish staging URLs as canonicals, social URLs, or entity identifiers.
 */
export const SITE_URL = "https://www.edgecipline.com";

/** Preview deployments keep production canonicals, but must not be indexed. */
export const IS_PREVIEW_DEPLOYMENT =
  (process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production") ||
  (process.env.NEXT_PUBLIC_SITE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "") !== SITE_URL);

/** Absolute URL for a site-relative path. Always returns a string. */
export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

/** Primary name — matches the casing used in the visible site copy. */
export const BRAND_NAME = "Edgecipline";

/** The legal entity, as the contact and legal pages state it. */
export const LEGAL_NAME = "Edgecipline Private Limited";

/**
 * The year the company was incorporated. It feeds the Organization node's
 * `foundingDate` and the contact page's line, so the two can never disagree.
 * Not the same thing as the product timeline on /about, which starts earlier.
 */
export const FOUNDING_YEAR = "2026";

/** All-caps wordmark plus the product variants people actually type. */
export const BRAND_ALTERNATE_NAMES = [
  "EDGECIPLINE",
  "Edgecipline App",
  "Edgecipline Trading Journal",
];

/** WebSite alternates feed Google's "site name" — keep them short. */
export const SITE_ALTERNATE_NAMES = ["EDGECIPLINE", "edgecipline.com"];

/**
 * Default <title>. It opens with the exact coined token followed by a pipe, so
 * it reads as a proper noun rather than a query to spell-correct.
 */
export const SITE_TITLE =
  "Edgecipline | AI Trading Journal & Discipline Coach";

/** Shown on the home page, in OG tags and as the WebSite description. */
export const SITE_DESCRIPTION =
  "Edgecipline is a pre-launch AI trading journal for Forex and Indian market traders, built to reveal behavior patterns and strengthen trading discipline.";

/**
 * The brand slogan, as it appears in the footer and on the Open Graph card.
 * This is the approved wording; BRAND_PROMISE below is the longer positioning
 * line, which is a description rather than a slogan.
 */
export const BRAND_SLOGAN = "Trade Disciplined · Live Freer";

export const BRAND_PROMISE = "Not just a journal — a discipline coach.";

export const BRAND_ETYMOLOGY =
  "Edgecipline is a coined brand name, a portmanteau of 'Edge' and 'discipline'. It is spelled E-D-G-E-C-I-P-L-I-N-E and is not a misspelling of 'discipline'.";

export const CONTACT_EMAIL = "support@edgecipline.com";
export const TWITTER_HANDLE = "@edgecipline";

/**
 * The brand mark the Organization node points at.
 *
 * The supplied stacked lockup with its black plate lifted off, so the same
 * artwork serves the page, the schema graph and anything that embeds it.
 * /brand/mark.webp is the angular E on its own, for places too small for the
 * wordmark.
 */
export const LOGO_PATH = "/brand/logo.webp";
export const LOGO_SIZE = { width: 1200, height: 1377 } as const;
export const MARK_PATH = "/brand/mark.webp";

/** The generated Open Graph card served at /opengraph-image. */
export const OG_IMAGE_PATH = "/opengraph-image";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Profiles listed in schema `sameAs`. Only list profiles that exist, are
 * public, and link back here — a dead or unrelated profile weakens entity
 * matching instead of helping it. These are the four the site itself links to
 * from the contact page.
 */
export const SOCIAL_PROFILES = [
  "https://twitter.com/edgecipline",
  "https://www.linkedin.com/company/edgecipline",
  "https://www.instagram.com/edgecipline",
  "https://www.youtube.com/@edgecipline",
];

/** Markets the product is built for, used in schema `areaServed`/`audience`. */
export const AREA_SERVED = ["IN", "Worldwide"] as const;

// Stable JSON-LD node ids. Every page references these instead of declaring a
// fresh anonymous Organization, so crawlers merge everything into one entity.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BRAND_ID = `${SITE_URL}/#brand`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

/** `@id` of a founder's Person node — the one both /founders and /about use. */
export function personId(slug: string) {
  return `${absoluteUrl(`/founders/${slug}`)}#person`;
}

/**
 * Serialises JSON-LD for `dangerouslySetInnerHTML`, escaping `<` so a string
 * in the data can never terminate the script element early.
 */
export function jsonLd(graph: unknown) {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
