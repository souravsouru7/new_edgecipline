"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Counts `[data-count]` elements up to their value the first time they are
 * seen, then puts the real text back.
 *
 * The final value is already in the markup, so without JavaScript — or with
 * reduced motion — the figure is simply there, correct and selectable. This
 * only replays it as a count.
 */
const DURATION = 1200;
const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({ selector = "[data-count]" }: { selector?: string }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!nodes.length) return;

    const frames = new Map<HTMLElement, number>();

    const run = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target)) return;
      const suffix = el.dataset.countSuffix ?? "";
      const final = el.textContent;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION);
        if (progress < 1) {
          el.textContent = `${Math.round(EASE(progress) * target)}${suffix}`;
          frames.set(el, requestAnimationFrame(tick));
        } else {
          // Restore the markup's own text rather than re-deriving it.
          el.textContent = final;
          frames.delete(el);
        }
      };

      el.textContent = `0${suffix}`;
      frames.set(el, requestAnimationFrame(tick));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          run(entry.target as HTMLElement);
        }
      },
      { threshold: 0.4 },
    );

    for (const node of nodes) io.observe(node);

    return () => {
      io.disconnect();
      for (const frame of frames.values()) cancelAnimationFrame(frame);
    };
  }, [reduced, selector]);

  return null;
}
