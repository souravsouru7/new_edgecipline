import type { ReactNode } from "react";
import Link from "next/link";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import styles from "./Status.module.css";

const css = (name: string) => styles[name] || name;

/**
 * The shell shared by `not-found.tsx` and `error.tsx`.
 *
 * Both are pages a visitor lands on by accident, and the single most useful
 * thing either can do is offer the way onward. So this is the full site shell
 * — real navbar, real footer, real internal links — rather than a bare
 * apology on an empty document.
 *
 * That matters for crawling too. An unknown `/blog/<typo>` returns a genuine
 * 404 (see `proxy.ts`), and Next injects `noindex` on it, so the page itself
 * is never indexed; but the links below keep a crawler that arrived on a
 * stale URL from hitting a dead end.
 *
 * It takes `children` rather than props for the body so the error boundary can
 * put a retry button where the 404 puts its links. A Server Component by
 * default; `error.tsx` is a Client Component and renders this through its
 * own tree, which is fine — nothing here holds state.
 */

/** Where to go instead. Short, and only routes that exist. */
const DESTINATIONS = [
  ["/features", "Features", "All fourteen capabilities, in detail."],
  ["/pricing", "Pricing", "Three plans, every feature in each."],
  ["/faq", "FAQ", "Twenty-eight questions, answered plainly."],
  ["/blog", "Blog", "Trading psychology, journaling and risk."],
  ["/about", "About", "Why Edgecipline is being built."],
  ["/contact", "Contact", "Reach the team directly."],
] as const;

export function StatusPage({
  code,
  title,
  lede,
  children,
  showLinks = true,
}: {
  /** The status label in the pill — "404", "Error". */
  code: string;
  title: string;
  lede: string;
  /** The actions row: buttons, a retry, whatever the state calls for. */
  children?: ReactNode;
  showLinks?: boolean;
}) {
  return (
    <div className={css("stPage")}>
      <Navbar />

      <main className={css("stMain")} id="main">
        <div className={css("stInner")}>
          <p className={css("stCode")}>
            <span className={css("stDot")} aria-hidden="true" />
            {code}
          </p>

          <h1 className={css("stTitle")}>{title}</h1>
          <p className={css("stLede")}>{lede}</p>

          <div className={css("stActions")}>{children}</div>

          {showLinks ? (
            <nav className={css("stLinks")} aria-labelledby="status-links-title">
              <h2 className={css("stLinksTitle")} id="status-links-title">
                Try one of these
              </h2>
              <ul className={css("stGrid")}>
                {DESTINATIONS.map(([href, label, blurb]) => (
                  <li key={href}>
                    <Link href={href}>
                      <strong>{label}</strong>
                      <span>{blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export { css as statusCss, styles as statusStyles };
