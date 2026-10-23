/**
 * /contact content, taken from the previous site's copy deck:
 * `edgeclipine/site-content.md` → "# Contact Page", with the form's field
 * labels, placeholders and topic list from its `ContactClient.tsx`.
 *
 * ── How the form submits, and why ───────────────────────────────────────────
 * The form posts to `/api/contact`, which validates the submission before
 * writing it to the Firestore `contacts` collection.
 */

import { FOUNDING_YEAR, HEADQUARTERS_DISPLAY, LEGAL_NAME } from "./brand";

export const CONTACT_EMAIL = "support@edgecipline.com";
export const RESPONSE_TIME = "We respond within 24–48 hours on business days.";

export const INTRO =
  "Questions about Edgecipline, the waitlist, features, or partnerships — reach out and we’ll respond within 24–48 hours.";

/** Topics, exactly as the old select offered them. */
export const topics = [
  "General question",
  "Waitlist & early access",
  "Product features",
  "Pricing",
  "Partnership / collaboration",
  "Press / media",
  "Other",
] as const;

export type SocialId = "x" | "linkedin" | "instagram" | "youtube";

/**
 * The four profiles the old site linked and listed in its schema `sameAs`.
 * Handles are from the copy deck; the URLs are from the old `lib/brand.ts`.
 */
export const socials: readonly { id: SocialId; label: string; handle: string; href: string }[] = [
  { id: "x", label: "Twitter / X", handle: "@edgecipline", href: "https://twitter.com/edgecipline" },
  { id: "linkedin", label: "LinkedIn", handle: "edgecipline", href: "https://www.linkedin.com/company/edgecipline" },
  { id: "instagram", label: "Instagram", handle: "@edgecipline", href: "https://www.instagram.com/edgecipline" },
  { id: "youtube", label: "YouTube", handle: "@edgecipline", href: "https://www.youtube.com/@edgecipline" },
] as const;

export const company = {
  name: LEGAL_NAME,
  country: HEADQUARTERS_DISPLAY,
  note: `Founded ${FOUNDING_YEAR} · Building in public`,
} as const;
