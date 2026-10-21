"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Brand } from "./Brand";
import { links, metaLinks } from "./links";

/**
 * The site's one navigation: a minimal floating bar.
 *
 * It replaced a fixed 250px sidebar that every page had to leave a gutter
 * for, and an eleven-item scroll rail pinned to the opposite edge. Two
 * permanent columns of chrome for seven routes is a lot of furniture, and on
 * the landing page they competed with each other — so there is one bar now,
 * floating clear of the content, and the content has the full width back.
 *
 * Behaviour:
 *
 *   * Transparent over the hero, then a translucent surface with a hairline
 *     once the page has been scrolled. That is a class toggle on a scroll
 *     threshold, not a per-frame style write.
 *   * Real `next/link` anchors, so the routes are crawlable links, work with
 *     middle-click and the keyboard, and prefetch.
 *   * The waitlist CTA is the one emphasised control, and it points at the
 *     same `#waitlist` anchor every other primary CTA on the site points at.
 *   * The mobile sheet is modal: `aria-modal`, Escape closes it, focus moves
 *     into it on open and back to the trigger on close, Tab cycles inside it,
 *     and the page behind it cannot be scrolled or clicked.
 *
 * The bar is `position: fixed`, so sections carry a `scroll-margin-top` of
 * its height in CSS and an anchor jump lands below it rather than under it.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  /**
   * Which route is current. Read from the path, so there is nothing to
   * measure and nothing to watch. The sheet needs no effect to close itself
   * on navigation either: every link inside it closes it on click.
   */
  const current = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  /**
   * The surface swap. A plain scroll listener with a boolean threshold: it
   * sets state only on the two frames where the threshold is crossed, so
   * scrolling the page does not re-render React.
   */
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > 24);
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, []);

  /** Modal behaviour for the sheet: scroll lock, Escape, and a focus cycle. */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const sheet = sheetRef.current;
    // Captured now rather than read in the cleanup: by the time the cleanup
    // runs the element may already have been replaced.
    const trigger = toggleRef.current;
    sheet?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !sheet) return;
      const focusable = sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      // Back to the button that opened it, so the keyboard does not land at
      // the top of the document.
      trigger?.focus();
    };
  }, [open]);

  return (
    <header className="navbar" data-scrolled={scrolled ? "" : undefined}>
      <div className="navbar-inner">
        <Brand />

        <nav className="navbar-links" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href} aria-current={current(href) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link className="waitlist navbar-cta" href="/#waitlist">
            Join Waitlist <span aria-hidden="true">→</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            ref={toggleRef}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="sheet-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            className="nav-sheet"
            id="mobile-menu"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="sheet-links" aria-label="Mobile navigation">
              {links.map(([label, href], index) => (
                <Link
                  key={label}
                  href={href}
                  aria-current={current(href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="nav-label">{label}</span>
                </Link>
              ))}
            </nav>

            <Link className="waitlist sheet-cta" href="/#waitlist" onClick={() => setOpen(false)}>
              Join Waitlist <span aria-hidden="true">→</span>
            </Link>

            <nav className="sheet-meta" aria-label="Company and legal">
              {metaLinks.map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
