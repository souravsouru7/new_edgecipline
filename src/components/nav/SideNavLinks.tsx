"use client";

import { useEffect, useState } from "react";
import { links } from "./links";

/**
 * Sidebar navigation with scroll-linked active highlighting.
 *
 * The links stay plain anchors, so click-to-scroll, keyboard focus and the URL
 * hash all keep working natively (smooth scrolling comes from `scroll-behavior`
 * in globals.css, which the reduced-motion block already turns off). The only
 * thing this component adds is which link is current, measured once per frame
 * from cached section offsets.
 */
const FOCUS_LINE = 0.35; // which part of the viewport counts as "you are here"

export function SideNavLinks() {
  const [active, setActive] = useState<string>(links[0][1]);

  useEffect(() => {
    type Section = { href: string; top: number; bottom: number };
    let sections: Section[] = [];
    let frame = 0;

    const measure = () => {
      const found: Section[] = [];
      for (const [, href] of links) {
        const el = document.getElementById(href.slice(1));
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        found.push({ href, top, bottom: top + rect.height });
      }
      sections = found.sort((a, b) => a.top - b.top);
    };

    const update = () => {
      frame = 0;
      if (!sections.length) return;
      const line = window.scrollY + window.innerHeight * FOCUS_LINE;
      let current = sections[0].href;
      for (const section of sections) {
        if (section.top <= line) current = section.href;
      }
      // At the very bottom of the page, honour the last section that has height.
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
        const last = sections.filter((s) => s.bottom > s.top).pop();
        if (last) current = last.href;
      }
      setActive(current);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update();

    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="side-nav" aria-label="Sections">
      {links.map(([label, href, Icon]) => {
        const current = href === active;
        return (
          <a
            key={label}
            href={href}
            className={current ? "nav-link active" : "nav-link"}
            aria-current={current ? "true" : undefined}
          >
            <Icon aria-hidden="true" size={20} />
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
