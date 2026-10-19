"use client";

import { useEffect } from "react";

/**
 * Drives every `data-reveal` and `data-sequence` element on the page.
 *
 * `data-reveal` opts an element into the fade-and-rise in motion.css;
 * `data-sequence` only asks for the in-view signal, for sections that start a
 * keyframe sequence of their own without being hidden first.
 *
 * The hidden state in motion.css is scoped to `html.motion-ready`, which this
 * island adds on mount. Without JavaScript the markup therefore stays fully
 * visible instead of being stuck at opacity 0 — the reveal is an enhancement,
 * not a prerequisite for reading the page.
 *
 * Anything already on screen when the island mounts is marked `data-inview="now"`
 * (shown, no animation) so nothing that the visitor is already looking at can
 * flicker or replay.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], [data-sequence]"),
    );
    const pending: HTMLElement[] = [];
    const viewport = window.innerHeight;

    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      if (rect.top < viewport * 0.95 && rect.bottom > 0) {
        node.dataset.inview = "now";
      } else {
        pending.push(node);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.inview = "true";
          io.unobserve(entry.target);
        }
      },
      // A little past the bottom edge, so a reveal has finished by the time the
      // element is comfortably in frame.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    for (const node of pending) io.observe(node);

    return () => {
      io.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
