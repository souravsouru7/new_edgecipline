"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";

const routes = [
  ["Home", "/"],
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Blog", "/blog"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
] as const;

const metaFooterLinks = [
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
  ["Founders", "/founders"],
] as const;

function Logo() {
  return (
    <Link href="/" className="edg-logo" aria-label="Edgecipline home">
      <Image src="/brand/mark.webp" alt="" width={36} height={45} priority />
      <span><strong>EDGECIPLINE</strong><small>DISCIPLINE OVER EMOTION</small></span>
    </Link>
  );
}

export function EdgHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isCurrent = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const toggleButton = toggleRef.current;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = previous;
      toggleButton?.focus();
    };
  }, [menuOpen]);

  return (
    <div className="edg-chrome">
      <a className="edg-skip" href="#main-content">Skip to content</a>
      <header className="edg-header">
        <div className="edg-header-inner">
          <Logo />
          <nav className="edg-nav" aria-label="Main navigation">
            {routes.map(([label, href]) => (
              <Link key={label} href={href} aria-current={isCurrent(href) ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="edg-header-actions">
            <ThemeToggle />
            <Link className="edg-button edg-button-small" href="/#waitlist">
              Join Waitlist <ArrowRight size={15} />
            </Link>
          </div>
          <div className="edg-header-mobile-actions">
            <ThemeToggle />
            <button
              ref={toggleRef}
              className="edg-menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="edg-mobile-nav" aria-label="Mobile navigation">
            {routes.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <Link href="/#waitlist" className="edg-mobile-nav-cta" onClick={() => setMenuOpen(false)}>Join Waitlist →</Link>
          </nav>
        )}
      </header>
    </div>
  );
}

export function EdgFooter() {
  return (
    <div className="edg-chrome edg-chrome-footer">
      <footer className="edg-footer">
        <Logo />
        <nav aria-label="Footer navigation">
          {routes.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
          {metaFooterLinks.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </nav>
        <div className="edg-footer-social">
          <Link href="/contact" aria-label="Contact Edgecipline">✉</Link>
          <Link href="/blog" aria-label="Edgecipline blog">◉</Link>
          <Link href="/faq" aria-label="Help and FAQ">?</Link>
        </div>
        <p>© 2026 Edgecipline. All rights reserved.<br />Built for traders, worldwide.</p>
      </footer>
    </div>
  );
}
