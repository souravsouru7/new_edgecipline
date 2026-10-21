/**
 * /privacy and /terms, taken verbatim from the previous site's copy deck:
 * `edgeclipine/site-content.md` -> "# Privacy Policy" and "# Terms of Service".
 *
 * Both were extracted programmatically rather than retyped. Legal text is the
 * one place on a site where a paraphrase is a liability, so not a word of it
 * is rewritten - only the page chrome (the "Legal" eyebrow, the title and the
 * "Last updated" line) is lifted out of the body and rendered around it.
 *
 * The bodies are markdown in the same small subset the blog posts use -
 * `##` headings, `- ` lists, paragraphs and `**bold**` - so they render through
 * the same `renderMarkdown` in components/blog/markdown.tsx. That also gives
 * each page a contents rail built from the real headings, with ids that match.
 *
 * Two things to keep in mind when these change:
 *   * `updated` is the date shown on the page and used as `dateModified` in
 *     the schema. It is the deck's own date, not today's - moving it is an
 *     editorial act, so it is not derived automatically.
 *   * The privacy policy names Firebase Firestore, Google Analytics and Google
 *     Tag Manager as processors. That described the previous deployment. If
 *     this site ships without them - or with something else - the policy has to
 *     be corrected before launch, because a privacy policy that misdescribes
 *     the actual data flow is worse than none.
 */

export type LegalDoc = {
  slug: "privacy" | "terms";
  title: string;
  /** Short label for the page eyebrow. */
  eyebrow: string;
  /** As written in the source, e.g. "January 2026". */
  updated: string;
  /** Meta description for the route. */
  description: string;
  /** Markdown body, verbatim. */
  body: string;
};

export const privacyPolicy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  eyebrow: "Legal",
  updated: "January 2026",
  description:
    "How Edgecipline collects, uses and safeguards your information - waitlist and contact form data, analytics, cookies, retention, third-party processors and your rights.",
  body: `## 1. Introduction

Welcome to Edgecipline ("Edgecipline", "we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at https://www.edgecipline.com and join our waitlist.

Edgecipline is currently in pre-launch mode. The primary data collection on this site is for our waitlist program. This policy governs that pre-launch data collection and will be updated when the full product launches.

## 2. Information We Collect

**Waitlist registration data:** When you join our waitlist, we collect your email address, phone number, and trading experience level. This information is required to add you to the waitlist and notify you when we launch.

**Contact form data:** If you contact us via our contact form, we collect your name, email address, the subject of your message, and the message content.

**Analytics data:** We use Google Analytics to understand how visitors interact with our website. This may include your IP address, browser type, device type, pages visited, and time spent on pages. This data is aggregated and anonymized.

**Cookies:** We use essential cookies to ensure our website functions correctly (e.g., remembering if you've already joined the waitlist). Analytics cookies are set by Google Analytics. You can opt out of analytics cookies through your browser settings or by using Google's opt-out tools.

## 3. How We Use Your Information

We use the information we collect to:

- Send you notifications when Edgecipline launches or early access becomes available
- Respond to your contact form inquiries
- Understand our user base and improve our product planning
- Analyze website traffic and user behavior to improve the website
- Comply with legal obligations

We will never sell your personal information to third parties or use it for purposes not described in this policy without your consent.

## 4. Data Storage & Security

Your waitlist and contact data is stored in Firebase Firestore, a Google Cloud service with enterprise-grade security. All data is encrypted in transit (TLS/SSL) and at rest.

We retain waitlist data until you request deletion or until 12 months after our product launches, whichever comes first. Contact form data is retained for 6 months for customer service purposes.

## 5. Third-Party Services

We use the following third-party services that may process your data:

- Google Analytics — Website analytics and usage statistics
- Firebase / Google Cloud — Data storage and hosting
- Google Tag Manager — Tag management for analytics

Each of these services has their own privacy policies. We recommend reviewing them if you have concerns about how they process your data.

## 6. Email Communications

By joining the waitlist, you consent to receive emails from Edgecipline regarding product launch updates, early access invitations, and related announcements. You can unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us at support@edgecipline.com.

We do not send marketing emails to contact form submitters unless they separately join the waitlist.

## 7. Your Rights

You have the following rights regarding your personal data:

- Access: Request a copy of the data we hold about you
- Correction: Request correction of inaccurate data
- Deletion: Request deletion of your personal data
- Opt-out: Unsubscribe from communications at any time
- Portability: Request your data in a portable format

To exercise any of these rights, email us at support@edgecipline.com. We will respond within 30 days.

## 8. Children's Privacy

Edgecipline is not intended for children under 18. We do not knowingly collect personal information from individuals under 18 years of age. If you believe we have inadvertently collected such information, please contact us immediately.

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of our website after changes constitutes acceptance of the updated policy.

## 10. Contact Us

If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

Edgecipline Technologies

Email: support@edgecipline.com

Website: https://www.edgecipline.com`,
};

export const termsOfService: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  eyebrow: "Legal",
  updated: "January 2026",
  description:
    "The terms governing use of Edgecipline, including the trading risk disclaimer, waitlist terms, acceptable use, intellectual property and limitation of liability.",
  body: `## Important Risk Disclaimer

**Trading involves substantial risk of loss.** Edgecipline is a journaling and analytics tool — it is NOT financial advice, investment advice, or a trading signal service. Past performance of any trading strategy or analysis does not guarantee future results. You are solely responsible for your own trading decisions. Never trade with money you cannot afford to lose.

## 1. Acceptance of Terms

By accessing or using the Edgecipline website at edgecipline.com and any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.

These Terms apply to all visitors, waitlist members, and any future users of the Service. Edgecipline reserves the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.

## 2. Description of Service

Edgecipline is an AI-powered trading journal and behavioral analytics platform (currently in pre-launch). The Service allows users to:

- Join a waitlist for early access to the Edgecipline platform
- Upload screenshots of trades for AI-powered data extraction (at launch)
- Track trading history, behavioral patterns, and performance analytics (at launch)
- Receive personalized AI coaching reports (at launch)

The Service is currently a pre-launch marketing website. Features described on this site are planned for future release and may change before launch.

## 3. Financial & Trading Disclaimer

**Edgecipline is NOT a financial advisor, investment advisor, or broker.** Nothing on this website or in the Edgecipline platform (when launched) constitutes financial advice, investment recommendations, or trading signals.

The behavioral analytics, AI coaching reports, and pattern detection features are educational tools to help traders understand their own behavior. They are not recommendations to buy, sell, or hold any financial instrument.

All trading decisions are made solely by you. Edgecipline and its founders, employees, and affiliates are not responsible for any trading losses incurred while using or after using the Service.

Past performance data shown in any Edgecipline analytics does not guarantee future results. All investments and trades involve risk, including the possible loss of all capital invested.

## 4. Waitlist Terms

By joining the Edgecipline waitlist, you agree to:

- Provide accurate contact information
- Receive email communications from Edgecipline regarding launch updates and early access
- Acknowledge that joining the waitlist does not guarantee access to the Service
- Acknowledge that pricing and features are subject to change before launch

Joining the waitlist is free and does not create any financial obligation. You may remove yourself from the waitlist at any time by contacting us at support@edgecipline.com.

## 5. Acceptable Use

When using the Service, you agree NOT to:

- Violate any applicable laws or regulations
- Provide false or misleading information
- Attempt to gain unauthorized access to any part of the Service
- Use the Service to distribute spam or malware
- Reverse engineer, copy, or reproduce any part of the Service
- Use the Service for any commercial purpose without written permission
- Harass or harm other users of the Service

## 6. Intellectual Property

All content on the Edgecipline website, including text, graphics, logos, and software, is the intellectual property of Edgecipline Technologies and is protected by applicable copyright, trademark, and other intellectual property laws.

The Edgecipline name and logo are trademarks of Edgecipline Technologies. You may not use our trademarks without prior written permission.

## 7. Subscriptions & Refunds

**Pre-launch note:** Edgecipline has not yet launched subscriptions. This section will be updated with full subscription terms before launch.

When subscriptions launch, we will publish a clear refund policy. Our goal is for every subscriber to find value within the first 30 days. If not, we will work to make it right.

## 8. Limitation of Liability

To the maximum extent permitted by applicable law, Edgecipline Technologies and its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

- Trading losses incurred while using or after using the Service
- Loss of profits, revenue, or data
- Business interruption
- Any damages arising from reliance on information provided by the Service

## 9. Governing Law

These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of India.

## 10. Contact

If you have questions about these Terms, please contact us:

Edgecipline Technologies

Email: support@edgecipline.com`,
};

export const legalDocs: readonly LegalDoc[] = [privacyPolicy, termsOfService];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}
