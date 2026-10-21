import Image from "next/image";
import Link from "next/link";

import { links, metaLinks, socials } from "./nav/links";
import { SideNavLinks } from "./nav/SideNavLinks";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Edgecipline home">
      <Image src="/hero/logo.webp" alt="Edgecipline" width={440} height={330} priority />
    </Link>
  );
}

/**
 * The fixed left sidebar.
 *
 * With a short route list, a bare column of links reads as unfinished, so the
 * column is composed rather than stacked: a brand mark, a labelled rule
 * introducing the index, the routes themselves, and a foot that carries the
 * one action worth taking. The early-access card is what makes the bottom of
 * the column deliberate instead of empty — the call to action now sits inside
 * something, with its own status line, rather than floating above the quote.
 *
 * A Server Component; only the route index below it is a client island.
 */
export function SidebarNav() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      {/* A hairline of brand light down the sidebar's own edge. */}
      <span className="side-rail" aria-hidden="true" />

      <Brand />

      <p className="side-eyebrow">
        <span>Navigate</span>
        <i aria-hidden="true" />
      </p>

      <SideNavLinks />

      <div className="side-foot">
        <div className="side-live">
          <p className="side-live-head">
            <i aria-hidden="true" />
            Early access open
          </p>
          <p>Join the waitlist to get in before launch.</p>
          <Link className="waitlist side-waitlist" href="/#waitlist">
            Join Waitlist <span aria-hidden="true">→</span>
          </Link>
        </div>

        <nav className="side-meta" aria-label="Company and legal">
          {metaLinks.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="side-quote">
          <blockquote>&ldquo;Discipline creates freedom.&rdquo;</blockquote>
          <i aria-hidden="true" />
          <ul className="side-socials">
            {socials.map(([label, href, Icon]) => (
              <li key={label}>
                <a href={href} aria-label={label}>
                  <Icon aria-hidden="true" size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export { links };
