"use client";

import { useEffect } from "react";

/**
 * Flags `<html data-scrolling>` while the page is moving.
 *
 * motion.css hangs every ambient loop off `--mo-ambient-play`, which this flips
 * to `paused` during a scroll. Nobody is watching a glow breathe while they
 * scroll, and stopping them hands the whole frame budget back to scrolling —
 * which is where the page felt heavy.
 *
 * One passive listener and a timeout; no work per frame.
 */
const IDLE_AFTER = 180;

export function ScrollState() {
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;

    const settle = () => {
      timer = 0;
      root.removeAttribute("data-scrolling");
    };

    const onScroll = () => {
      if (!timer) root.setAttribute("data-scrolling", "");
      else window.clearTimeout(timer);
      timer = window.setTimeout(settle, IDLE_AFTER);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
      root.removeAttribute("data-scrolling");
    };
  }, []);

  return null;
}
