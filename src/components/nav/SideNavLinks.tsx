"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { links } from "./links";

/**
 * Sidebar navigation for a multi-page site.
 *
 * Which link is current comes from the route, so there is nothing to measure
 * and nothing to watch: no scroll listener, no cached section offsets, no work
 * per frame. (This replaced a scroll spy from when the whole site was one
 * long page — see git history if that behaviour is ever wanted back.)
 *
 * Each link is an index, an icon tile and a label. The tile carries the active
 * state — it fills with the brand gradient, while the number and the rail on
 * the left edge mark position in the list. All of it is colour and shadow,
 * never the box model, so marking a route current cannot shift the layout.
 *
 * `next/link`, so navigation is client-side and the next page is prefetched,
 * while keyboard, middle-click and the URL all behave natively.
 */
export function SideNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="side-nav" aria-label="Pages">
      {links.map(([label, href, Icon], index) => {
        const current = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={current ? "nav-link active" : "nav-link"}
            aria-current={current ? "page" : undefined}
          >
            <span className="nav-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="nav-icon" aria-hidden="true">
              <Icon size={17} />
            </span>
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
