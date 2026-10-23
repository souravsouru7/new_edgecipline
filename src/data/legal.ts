/**
 * /privacy and /terms, taken verbatim from the previous site's copy deck:
 * `edgeclipine/site-content.md` -> "# Privacy Policy" and "# Terms of Service".
 *
 * These policies describe the current product and its confirmed data flow.
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
 *   * Processor, retention, subscription, and access facts must be updated
 *     here whenever the implementation changes.
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
  updated: "October 2026",
  description:
    "How Edgecipline collects, uses and safeguards account, trade, screenshot, waitlist and contact data, including retention, deletion, service providers and your rights.",
  body: `## 1. Introduction

Welcome to Edgecipline ("Edgecipline", "we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, retain, and delete information when you visit https://www.edgecipline.com, request an invitation, register, or use the Edgecipline web or Android product.

Registration is open, while product access is currently invite-only.

## 2. Information We Collect

**Invitation and waitlist data:** When you request access, we collect your name, email address, optional phone number, and trading experience level so we can manage your request and contact you about access.

**Account data:** When you register, we collect information needed to authenticate and manage your account, such as your email address, profile preferences, market mode, trial status, and subscription status.

**Trade and product data:** When you use Edgecipline, we process the trade details, journal entries, setup rules, checklist responses, psychology tags, reflections, reports, coaching history, and related analytics you choose to provide or generate.

**Screenshots and OCR data:** Uploaded trade screenshots are stored in Cloudinary. Extracted text and structured trade data are processed to create and maintain your journal. Screenshots and raw OCR data remain associated with your active account until you delete the account.

**Contact form data:** If you contact us via our contact form, we collect your name, email address, the subject of your message, and the message content.

**Technical data:** The product may process device, diagnostic, notification-delivery, security, and error information required to operate, protect, and troubleshoot the service.

**Cookies:** We use essential cookies and similar storage needed for authentication, security, preferences, and core product functionality. We do not currently use Google Analytics or Google Tag Manager.

## 3. How We Use Your Information

We use the information we collect to:

- Process registration and invitation requests
- Provide and secure your Edgecipline account
- Extract trade information from screenshots and maintain your journal
- Generate your requested analytics, reports, coaching, missions, and Trading DNA
- Process trials, subscriptions, and payments
- Deliver service notifications according to your preferences
- Respond to your contact form inquiries
- Diagnose errors and improve product reliability
- Comply with legal obligations

We will never sell your personal information to third parties or use it for purposes not described in this policy without your consent.

## 4. Data Storage & Security

Waitlist and contact-form submissions are stored in Firebase Firestore. Account, trade, journal, analytics, and related product data is stored in MongoDB Atlas. Uploaded screenshots are stored in Cloudinary. We use encrypted network connections when data is transmitted between your device and our services.

Screenshots and raw OCR text remain associated with an active account. When you delete your account, Edgecipline permanently deletes the associated account information, trades, screenshots, OCR data, analytics, reports, and coaching history. You may also request deletion by emailing support@edgecipline.com. Contact form data is retained for up to 6 months for customer service purposes.

## 5. Third-Party Services

We use the following third-party services that may process your data:

- MongoDB Atlas — Account, trade, journal, and product data storage
- Cloudinary — Uploaded screenshot storage and delivery
- Firebase — Waitlist and contact-form storage, authentication, and Android push notifications
- Google Gemini and Google Cloud Vision — Screenshot extraction and requested AI features
- Razorpay — Subscription payment processing
- Resend — Transactional email delivery
- Sentry — Product error monitoring and diagnostics

Each of these services has their own privacy policies. We recommend reviewing them if you have concerns about how they process your data.

## 6. Email Communications

By joining the waitlist, you consent to receive emails from Edgecipline regarding invitations, access updates, and related announcements. You can unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us at support@edgecipline.com.

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

Edgecipline Private Limited

Email: support@edgecipline.com

Website: https://www.edgecipline.com`,
};

export const termsOfService: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  eyebrow: "Legal",
  updated: "October 2026",
  description:
    "The terms governing use of Edgecipline, including the trading risk disclaimer, waitlist terms, acceptable use, intellectual property and limitation of liability.",
  body: `## Important Risk Disclaimer

**Trading involves substantial risk of loss.** Edgecipline is a journaling and analytics tool — it is NOT financial advice, investment advice, or a trading signal service. Past performance of any trading strategy or analysis does not guarantee future results. You are solely responsible for your own trading decisions. Never trade with money you cannot afford to lose.

## 1. Acceptance of Terms

By accessing or using the Edgecipline website at edgecipline.com and any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.

These Terms apply to all visitors, waitlist members, registered users, and subscribers of the Service. Edgecipline reserves the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.

## 2. Description of Service

Edgecipline is an AI-powered trading journal and behavioral analytics platform. Registration is open, while product access is currently invite-only. The Service allows users to:

- Request an invitation and register for the Edgecipline platform
- Upload screenshots of trades for AI-powered data extraction
- Track trading history, behavioral patterns, and performance analytics
- Receive personalized AI coaching reports

The product is complete on web and Android. An iOS release is planned for the future. Access, features, and availability may still change as the invite-only product is improved.

## 3. Financial & Trading Disclaimer

**Edgecipline is NOT a financial advisor, investment advisor, or broker.** Nothing on this website or in the Edgecipline platform constitutes financial advice, investment recommendations, or trading signals.

The behavioral analytics, AI coaching reports, and pattern detection features are educational tools to help traders understand their own behavior. They are not recommendations to buy, sell, or hold any financial instrument.

All trading decisions are made solely by you. Edgecipline and its founders, employees, and affiliates are not responsible for any trading losses incurred while using or after using the Service.

Past performance data shown in any Edgecipline analytics does not guarantee future results. All investments and trades involve risk, including the possible loss of all capital invested.

## 4. Waitlist Terms

By joining the Edgecipline waitlist, you agree to:

- Provide accurate contact information
- Receive email communications from Edgecipline regarding invitations and access updates
- Acknowledge that joining the waitlist does not guarantee access to the Service
- Acknowledge that pricing, invitations, and features may change during invite-only access

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

All content on the Edgecipline website, including text, graphics, logos, and software, is the intellectual property of Edgecipline Private Limited and is protected by applicable copyright, trademark, and other intellectual property laws.

The Edgecipline name and logo are trademarks of Edgecipline Private Limited. You may not use our trademarks without prior written permission.

## 7. Subscriptions & Refunds

New accounts receive a 7-day premium trial. After the trial, a free account is limited to two saved trades. Paid plans, prices, billing periods, and included features are shown on the Pricing page and during checkout. Payments are processed through Razorpay.

For current cancellation and refund terms, review the information shown during checkout or contact support@edgecipline.com before subscribing.

## 8. Limitation of Liability

To the maximum extent permitted by applicable law, Edgecipline Private Limited and its founders, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

- Trading losses incurred while using or after using the Service
- Loss of profits, revenue, or data
- Business interruption
- Any damages arising from reliance on information provided by the Service

## 9. Governing Law

These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of India.

## 10. Contact

If you have questions about these Terms, please contact us:

Edgecipline Private Limited

Email: support@edgecipline.com`,
};

export const legalDocs: readonly LegalDoc[] = [privacyPolicy, termsOfService];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((doc) => doc.slug === slug);
}

/**
 * "January 2026" → "2026-01-01".
 *
 * Both legal pages print a month-granularity "Last updated" line, and both
 * their `dateModified` in schema and their sitemap entry have to agree with
 * it. Parsing the printed line is what guarantees that: the date can only be
 * wrong in one place now instead of three, and it can never silently become
 * "today" the way a hardcoded literal eventually does.
 *
 * Returns undefined rather than guessing if the line is not in that form, so
 * a malformed date is omitted instead of being invented.
 */
const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

export function legalDateModified(updated: string): string | undefined {
  const [month, year] = updated.trim().toLowerCase().split(/\s+/);
  const index = MONTH_NAMES.indexOf(month ?? "");
  if (index < 0 || !/^\d{4}$/.test(year ?? "")) return undefined;
  return `${year}-${String(index + 1).padStart(2, "0")}-01`;
}
