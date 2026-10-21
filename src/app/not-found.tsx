import type { Metadata } from "next";
import Link from "next/link";

import { StatusPage, statusStyles } from "@/components/status/StatusPage";

/**
 * The 404.
 *
 * It serves two different arrivals. `proxy.ts` rewrites an unknown
 * `/blog/<slug>` or `/founders/<slug>` here with a real 404 status, and the
 * root `not-found` also catches any URL the app does not route at all.
 *
 * The `robots` field is not optional here, which is worth spelling out
 * because it looks redundant. Next does inject
 * `<meta name="robots" content="noindex" />` on any page returning 404 — but
 * this page also inherits the root layout's `index, follow`, and both tags
 * end up in the same head. Verified against the built output: before this
 * field was set, the 404 shipped `noindex` and `index, follow` together.
 * Google resolves a conflict by taking the most restrictive directive, so the
 * page was never at real risk of being indexed, but shipping two contradictory
 * instructions and trusting the tie-break is not a thing to leave in place.
 *
 * `follow: true` is the deliberate half: the page should never be indexed, but
 * the eight internal links on it should absolutely still be crawled. A 404 is
 * often where a crawler lands on a stale URL, and "noindex, follow" is what
 * keeps that visit useful instead of terminal.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist on Edgecipline. Browse the features, pricing, FAQ or blog instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <StatusPage
      code="404 — not found"
      title="That page isn't here."
      lede="The link may be out of date, or the address mistyped. Nothing is broken — the rest of the site is where you left it."
    >
      <Link className={statusStyles.stPrimary} href="/">
        Back to home
      </Link>
      <Link className={statusStyles.stGhost} href="/contact">
        Report a broken link
      </Link>
    </StatusPage>
  );
}
