"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".edg-section, .edg-stats, .edg-final";
const NAV_SELECTOR = '.edg-nav a[href^="#"]';

type CountFormat = "thousands" | "rating" | "integer";

function formatCount(value: number, format: CountFormat) {
  if (format === "thousands") return `${Math.round(value)}K+`;
  if (format === "rating") return `${value.toFixed(1)}/5`;
  return `${Math.round(value)}+`;
}

/** Motion is progressive enhancement: server markup and CSS stay readable without it. */
export function HomepageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".edg-page");
    if (!root || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(pointer: fine) and (min-width: 801px)");
    const sections = [...root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)];
    const stats = root.querySelector<HTMLElement>(".edg-stats");
    const heroArt = root.querySelector<HTMLElement>(".edg-hero-art");
    const navLinks = [...root.querySelectorAll<HTMLAnchorElement>(NAV_SELECTOR)];
    const countFrames = new Set<number>();
    let scrollFrame = 0;
    let pointerFrame = 0;
    let measureFrame = 0;

    // Measure each hero headline line so the typewriter in reference-motion.css
    // clips from 0 to exactly the text width (the display font is not
    // monospace, so a fixed value would over- or under-shoot). scrollWidth
    // reports the full text even while the wrapper is clipped to width 0.
    const typeLines = [...root.querySelectorAll<HTMLElement>(".edg-hero-line .edg-type")];
    const measureType = () => {
      for (const line of typeLines) {
        const width = line.scrollWidth;
        if (width) line.style.setProperty("--edg-type-w", `${width}px`);
      }
    };
    measureType();
    if (document.fonts?.ready) void document.fonts.ready.then(measureType);
    const onResizeMeasure = () => {
      if (!measureFrame) measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        measureType();
      });
    };
    window.addEventListener("resize", onResizeMeasure, { passive: true });
    let countsStarted = false;
    let currentLink = "";

    const finishCounts = () => {
      stats?.querySelectorAll<HTMLElement>("[data-edg-count]").forEach((item) => {
        item.textContent = item.dataset.edgFinal ?? item.textContent;
      });
    };

    const startCounts = () => {
      if (countsStarted || !stats) return;
      countsStarted = true;
      if (reduced.matches || document.hidden) {
        finishCounts();
        return;
      }
      stats.querySelectorAll<HTMLElement>("[data-edg-count]").forEach((item) => {
        const target = Number(item.dataset.edgCount);
        const format = item.dataset.edgFormat as CountFormat;
        if (!Number.isFinite(target)) return;
        const started = performance.now();
        const duration = 1050;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          item.textContent = progress < 1
            ? formatCount(target * eased, format)
            : item.dataset.edgFinal ?? formatCount(target, format);
          if (progress < 1 && !document.hidden && !reduced.matches) {
            const frame = requestAnimationFrame(tick);
            countFrames.add(frame);
          } else {
            item.textContent = item.dataset.edgFinal ?? item.textContent;
          }
        };
        const frame = requestAnimationFrame(tick);
        countFrames.add(frame);
      });
    };

    // Mark visible sections before enabling hidden-to-visible CSS. This avoids
    // a first-frame flash when hydration finishes while a section is on screen.
    const viewport = window.innerHeight;
    for (const section of sections) {
      const box = section.getBoundingClientRect();
      if (box.top < viewport * 0.93 && box.bottom > 0) {
        section.setAttribute("data-edg-inview", "");
        if (section === stats) startCounts();
      }
    }
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const section = entry.target as HTMLElement;
        section.setAttribute("data-edg-inview", "");
        if (section === stats) startCounts();
        observer.unobserve(section);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    sections.forEach((section) => {
      if (!section.hasAttribute("data-edg-inview")) revealObserver.observe(section);
    });
    if (!reduced.matches) root.dataset.edgMotion = "ready";

    const liveObserver = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) heroArt?.setAttribute("data-edg-live", "");
      else heroArt?.removeAttribute("data-edg-live");
    }, { rootMargin: "15% 0px 15% 0px" });
    if (heroArt) liveObserver.observe(heroArt);

    const updateScroll = () => {
      scrollFrame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--edg-scroll-progress", String(Math.min(1, Math.max(0, window.scrollY / max))));
      // A separate 0→1 value over the first viewport of scroll, used only for
      // the hero's parallax. The CSS that reads it is gated to desktop and
      // motion-safe, so this stays a no-op everywhere else.
      root.style.setProperty("--edg-hero-scroll", String(Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9))));

      let active = "#home";
      const boundary = window.innerHeight * 0.42;
      for (const link of navLinks) {
        const href = link.getAttribute("href");
        if (!href || href === "#home") continue;
        const target = root.querySelector<HTMLElement>(href);
        if (target && target.getBoundingClientRect().top <= boundary) active = href;
      }
      if (active !== currentLink || navLinks.some((link) =>
        (link.getAttribute("aria-current") === "location") !== (link.getAttribute("href") === active))) {
        currentLink = active;
        for (const link of navLinks) {
          if (link.getAttribute("href") === active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const onPointerMove = (event: PointerEvent) => {
      if (!heroArt || !pointer.matches || reduced.matches || document.hidden) return;
      const box = heroArt.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width - 0.5) * 14;
      const y = ((event.clientY - box.top) / box.height - 0.5) * 10;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        heroArt.style.setProperty("--edg-pointer-x", `${x.toFixed(1)}px`);
        heroArt.style.setProperty("--edg-pointer-y", `${y.toFixed(1)}px`);
      });
    };
    const resetPointer = () => {
      heroArt?.style.setProperty("--edg-pointer-x", "0px");
      heroArt?.style.setProperty("--edg-pointer-y", "0px");
    };
    heroArt?.addEventListener("pointermove", onPointerMove, { passive: true });
    heroArt?.addEventListener("pointerleave", resetPointer);

    const tactileCards = [...root.querySelectorAll<HTMLElement>(
      ".edg-step-cards article, .edg-loop-grid li, .edg-dna-traits > div, .edg-feature-grid > div, " +
        ".edg-coach-messages article, .edg-journey-list li, .edg-moment-list > div, " +
        ".edg-story-values > div, .edg-plan",
    )];
    const cardMove = (event: PointerEvent) => {
      if (!pointer.matches || reduced.matches || document.hidden) return;
      const card = event.currentTarget as HTMLElement;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--edg-tilt-x", `${(-y * 5).toFixed(2)}deg`);
      card.style.setProperty("--edg-tilt-y", `${(x * 5).toFixed(2)}deg`);
      card.style.setProperty("--edg-glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--edg-glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    };
    const cardLeave = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.removeProperty("--edg-tilt-x");
      card.style.removeProperty("--edg-tilt-y");
      card.style.removeProperty("--edg-glow-x");
      card.style.removeProperty("--edg-glow-y");
    };
    tactileCards.forEach((card) => {
      card.addEventListener("pointermove", cardMove, { passive: true });
      card.addEventListener("pointerleave", cardLeave);
    });

    const onVisibility = () => {
      if (document.hidden) {
        root.setAttribute("data-edg-paused", "");
        if (countsStarted) finishCounts();
      } else root.removeAttribute("data-edg-paused");
    };
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    const onReducedMotion = () => {
      if (reduced.matches) {
        root.removeAttribute("data-edg-motion");
        resetPointer();
        if (countsStarted) finishCounts();
      } else root.dataset.edgMotion = "ready";
    };
    reduced.addEventListener("change", onReducedMotion);

    const onFocus = (event: FocusEvent) => {
      const section = (event.target as HTMLElement).closest<HTMLElement>(REVEAL_SELECTOR);
      section?.setAttribute("data-edg-inview", "");
    };
    root.addEventListener("focusin", onFocus);

    return () => {
      revealObserver.disconnect();
      liveObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", onResizeMeasure);
      cancelAnimationFrame(measureFrame);
      heroArt?.removeEventListener("pointermove", onPointerMove);
      heroArt?.removeEventListener("pointerleave", resetPointer);
      tactileCards.forEach((card) => {
        card.removeEventListener("pointermove", cardMove);
        card.removeEventListener("pointerleave", cardLeave);
        card.style.removeProperty("--edg-tilt-x");
        card.style.removeProperty("--edg-tilt-y");
        card.style.removeProperty("--edg-glow-x");
        card.style.removeProperty("--edg-glow-y");
      });
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedMotion);
      root.removeEventListener("focusin", onFocus);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);
      countFrames.forEach(cancelAnimationFrame);
      finishCounts();
      root.removeAttribute("data-edg-motion");
    };
  }, []);

  return null;
}
