import Link from "next/link";

import { BRAND_SLOGAN, CONTACT_EMAIL, LEGAL_NAME } from "@/data/brand";
import { Brand } from "./nav/Brand";
import { metaLinks } from "./nav/links";

/**
 * The site footer.
 *
 * The sidebar used to carry the legal links, the slogan and a column of
 * social icons. Two of those belong at the end of a page rather than beside
 * it, so they are here; the social icons are not, because they pointed at
 * `#podcast`, `#youtube` and `#instagram` — three fragments that exist
 * nowhere on the site. The real profiles are linked from /contact, and the
 * footer links to that instead of to three dead anchors.
 *
 * Deliberately compact: a hairline, one row of links and the slogan. The page
 * above it already ends on the waitlist form, and closing it with another
 * full-height block would bury the thing the page is for.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          {/* The supplied stacked lockup. It carries "Discipline over
              emotion" itself, so the slogan is not repeated beside it. */}
          <Brand className="footer-logo" variant="stacked" />
          <p className="footer-slogan">{BRAND_SLOGAN}</p>
        </div>

        <nav className="footer-links" aria-label="Company and legal">
          {metaLinks.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
          <Link href="/contact">Contact</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </nav>

        <p className="footer-legal">© {LEGAL_NAME}</p>
      </div>
    </footer>
  );
}
