import type { MetadataRoute } from "next";

import { BRAND_NAME, BRAND_SLOGAN, SITE_DESCRIPTION } from "@/data/brand";

/**
 * The web app manifest, served at /manifest.webmanifest.
 *
 * Why a marketing site has one: the manifest is a second machine-readable
 * declaration of the same entity. `name`, `short_name` and `description` here
 * have to agree with the `<title>`, the Open Graph tags and the Organization
 * node, because a coined brand name is recognised by consistency and nothing
 * else — so every field below comes from `brand.ts` rather than being typed
 * out again.
 *
 * `display: "browser"` rather than `"standalone"`: this is a website, not an
 * installable app, and the product's Android app is distributed separately.
 * Claiming standalone display would invite an install prompt for
 * something that is a set of marketing pages.
 *
 * Only the two genuinely square icons are listed. The brand artwork in
 * `/public/brand` is portrait — the mark is 406×600 and the lockup 1200×1377 —
 * and a manifest icon declared at a `sizes` its file does not have gets
 * letterboxed or rejected, so neither belongs here. `icon.png` (512×512) and
 * `apple-icon.png` (180×180) are the real squares the app directory already
 * generates.
 *
 * Both are `any` rather than `maskable`: neither has the safe-zone padding a
 * maskable icon requires, and declaring one that does not would crop the mark.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} — ${BRAND_SLOGAN}`,
    short_name: BRAND_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "en-IN",
    dir: "ltr",
    categories: ["finance", "education", "productivity"],
    background_color: "#050914",
    theme_color: "#050914",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
