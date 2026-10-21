"use client";

import { useEffect } from "react";

import { onScrollFrame, onViewportResize, requestScrollFrame } from "./scroll-driver";

/**
 * Per-section scroll progress for the landing page.
 *
 * This island renders nothing. Like the others here it only publishes state
 * for the stylesheets to act on:
 *
 *   on each section
 *     --i              its index, written once
 *     --mo-progress    0..1 across its travel through the viewport — 0 as it
 *                      enters the bottom, 1 as it leaves the top. Every
 *                      section's internal scroll-linked motion is tuned
 *                      against this mapping.
 *     --mo-enter       0..1 across a fixed ARRIVAL of the viewport height,
 *                      counted from the moment the section's top crosses the
 *                      bottom of the viewport. Deliberately NOT a fraction of
 *                      --mo-progress: that is a fraction of the section's own
 *                      travel, so on a section three viewports tall a fade
 *                      over "the first 28% of progress" lasts more than a
 *                      full viewport of scrolling and the visitor reads the
 *                      opening paragraph at half opacity. This is the same
 *                      distance for every section, short or tall.
 *     data-mo-scene    marks it as a scene motion.css can animate inside
 *     data-mo-live     set on the section on screen and its two neighbours,
 *                      so ambient loops only run where they can be seen
 *   on `.page-sky`
 *     --stage-p        0..1 across the whole sequence, which the background
 *                      layer uses to drift its ambient light
 *
 * It used to do a great deal more: it pinned the whole page in one frame,
 * cross-faded eleven sections through it, intercepted in-page link clicks,
 * followed focus between panels, and replayed each section's entrance every
 * time it came round. All of that existed to make a hijacked scroll behave
 * like a normal one. The page scrolls normally now, so none of it is needed —
 * the browser handles anchors and focus, and RevealObserver owns the in-view
 * flag again.
 *
 * Two things keep this cheap:
 *
 *   * Geometry is measured on resize and on a ResizeObserver, never in the
 *     scroll handler, so a scroll frame reads `scrollY` and writes a few
 *     custom properties without touching layout.
 *   * `--mo-progress` is only published when it has moved by more than
 *     EPSILON, and `data-mo-live` only flips when the section on screen
 *     changes rather than once per frame.
 */

/** Smallest change in a section's progress worth a style invalidation. */
const EPSILON = 0.004;

/** How far a section travels while arriving, as a fraction of the viewport. */
const ARRIVAL = 0.3;

export function StageMotion({ count }: { count: number }) {
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".stage");
    if (!stage) return;

    const sections = Array.from(stage.querySelectorAll<HTMLElement>(":scope > main, :scope > section"));
    if (sections.length < 2) return;

    const sky = document.querySelector<HTMLElement>(".page-sky");
    const last = sections.length - 1;
    const progress = sections.map(() => -1);
    const entered = sections.map(() => -1);
    let active = -1;

    sections.forEach((section, index) => {
      section.style.setProperty("--i", String(index));
      section.setAttribute("data-stage-panel", "");
      section.setAttribute("data-mo-scene", "");
    });

    // --- geometry, measured on resize only -----------------------------------
    const tops = sections.map(() => 0);
    const heights = sections.map(() => 1);

    const measure = () => {
      sections.forEach((section, index) => {
        const box = section.getBoundingClientRect();
        tops[index] = box.top + window.scrollY;
        heights[index] = box.height || 1;
      });
    };

    const setActive = (index: number) => {
      if (index === active) return;
      active = index;
      // Ambient loops run in the section on screen and its two neighbours,
      // and stand down everywhere else — the budget motion.css assumes.
      sections.forEach((section, i) => {
        section.toggleAttribute("data-mo-live", Math.abs(i - index) <= 1);
      });
    };

    const write = () => {
      const scrollY = window.scrollY;
      const view = window.innerHeight;
      const middle = scrollY + view / 2;
      let reached = 0;

      const arrival = Math.max(1, view * ARRIVAL);

      for (let i = 0; i < sections.length; i += 1) {
        const raw = (scrollY + view - tops[i]) / (heights[i] + view);
        const value = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        if (Math.abs(value - progress[i]) >= EPSILON) {
          progress[i] = value;
          sections[i].style.setProperty("--mo-progress", value.toFixed(3));
        }

        const rawEnter = (scrollY + view - tops[i]) / arrival;
        const enter = rawEnter < 0 ? 0 : rawEnter > 1 ? 1 : rawEnter;
        if (Math.abs(enter - entered[i]) >= EPSILON) {
          entered[i] = enter;
          sections[i].style.setProperty("--mo-enter", enter.toFixed(3));
        }
        // Which section the middle of the viewport is in, and how far into it.
        if (middle >= tops[i]) reached = i + Math.min(1, (middle - tops[i]) / heights[i]);
      }

      const t = Math.min(last, reached);
      sky?.style.setProperty("--stage-p", (t / last).toFixed(4));
      setActive(Math.min(last, Math.round(t)));
    };

    const remeasure = () => {
      measure();
      for (let i = 0; i < progress.length; i += 1) {
        progress[i] = -1;
        entered[i] = -1;
      }
    };

    measure();
    write();

    // Reveals and late-loading imagery both change section heights, which
    // changes the mapping.
    const ro = new ResizeObserver(() => {
      remeasure();
      requestScrollFrame();
    });
    ro.observe(stage);

    const offScroll = onScrollFrame(write);
    const offResize = onViewportResize(remeasure);

    return () => {
      ro.disconnect();
      offScroll();
      offResize();
      sky?.style.removeProperty("--stage-p");
      sections.forEach((section) => {
        section.style.removeProperty("--i");
        section.style.removeProperty("--mo-progress");
        section.style.removeProperty("--mo-enter");
        section.removeAttribute("data-stage-panel");
        section.removeAttribute("data-mo-scene");
        section.removeAttribute("data-mo-live");
      });
    };
  }, [count]);

  return null;
}
