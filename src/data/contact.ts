/**
 * /contact content, taken from the previous site's copy deck:
 * `edgeclipine/site-content.md` → "# Contact Page", with the form's field
 * labels, placeholders and topic list from its `ContactClient.tsx`.
 *
 * ── How the form submits, and why ───────────────────────────────────────────
 * The old form POSTed to `/api/contact`, which wrote to Firestore through
 * firebase-admin. This project has no Firebase dependency, no service account
 * and no API routes, so that path does not exist here.
 *
 * Rather than ship a form that silently discards what people type — or one
 * that shows "Message sent!" when nothing was sent — the form composes a
 * prefilled email draft from the fields and hands it to the visitor's mail
 * client. It needs no backend, no secrets and no configuration, it cannot
 * fail quietly, and the button says exactly what it does.
 *
 * The old deck's success and error strings ("Message sent!", "Something went
 * wrong…") describe a server round-trip that no longer happens, so they are
 * not reproduced. The substance of the error line — email us directly — is
 * instead always visible as the primary channel.
 *
 * To restore real server-side submission, give the project a delivery target
 * (a Resend/Postmark key, a webhook URL, or Firebase credentials) and add an
 * `/api/contact` route; the form fields below already carry everything it
 * would need.
 */

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
  name: "Edgecipline Technologies",
  country: "India",
  note: "Founded 2024 · Building in public",
} as const;
