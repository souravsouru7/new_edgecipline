"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Brand, links } from "./SidebarNav";
import { metaLinks } from "./nav/links";

/**
 * The mobile header and its drawer.
 *
 * The drawer mirrors the sidebar's route index — same number, icon tile and
 * label — so the site reads the same on a phone as on a desktop rather than
 * degrading to a plain list of text links.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="mobile-header">
      <Brand />
      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>

      {open && (
        <>
          <button className="drawer-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <nav className="mobile-drawer" id="mobile-menu" aria-label="Mobile navigation">
            <p className="side-eyebrow">
              <span>Navigate</span>
              <i aria-hidden="true" />
            </p>

            {links.map(([label, href, Icon], index) => (
              <Link
                key={label}
                href={href}
                aria-current={
                  (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined
                }
                onClick={() => setOpen(false)}
              >
                <span className="nav-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="nav-icon" aria-hidden="true">
                  <Icon size={17} />
                </span>
                <span className="nav-label">{label}</span>
              </Link>
            ))}

            <Link className="waitlist" href="/#waitlist" onClick={() => setOpen(false)}>
              Join Waitlist <span aria-hidden="true">→</span>
            </Link>

            <nav className="side-meta" aria-label="Company and legal">
              {metaLinks.map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          </nav>
        </>
      )}
    </header>
  );
}
