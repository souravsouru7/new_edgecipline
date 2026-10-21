"use client";

import { useEffect, useRef } from "react";

import { onScrollFrame, onViewportResize, requestScrollFrame } from "./motion/scroll-driver";

/**
 * The page's one background.
 *
 * Every section used to carry its own opaque colour, its own full-bleed
 * photograph and its own veil, so scrolling the page meant crossing ten hard
 * rectangular boundaries. That was replaced by one fixed layer — and then,
 * for a while, by one fixed layer plus a photograph per section, cross-faded
 * as that section came round. Nine mountain and nebula photographs are still
 * nine different backgrounds, they are a landscape aesthetic rather than a
 * futuristic one, and they were nine image downloads below the fold.
 *
 * What is here instead is an environment rather than a picture: a deep navy
 * field, a faint data grid, and two slow auras of brand light that move as the
 * page is scrolled. It is all gradients, so the whole background is a handful
 * of compositor layers with nothing to download and nothing to decode.
 *
 * It is rendered as a sibling of `.site-shell`, not a child, so no clipping or
 * stacking context on the shell can cut into it. `position: fixed` keeps it
 * still while the document scrolls normally; nothing about the page's own
 * scrolling changes, and the layer is `pointer-events: none` throughout, so it
 * cannot swallow a click or a touch.
 *
 * Two values drive it, and neither costs a React render:
 *
 *   --sky-p    how far the document has been scrolled, 0..1, written here.
 *   --stage-p  how far through the eleven sections the page has travelled,
 *              written by StageMotion. The auras drift with it, so the
 *              environment changes with the content without any one section
 *              owning a background of its own.
 */
export function PageSky() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cached: the scroll handler never reads layout.
    let travel = 1;
    let last = -1;

    const measure = () => {
      travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const write = () => {
      const raw = window.scrollY / travel;
      const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      // Below this the drift moves a fraction of a pixel — not worth a style
      // invalidation.
      if (Math.abs(progress - last) < 0.002) return;
      last = progress;
      el.style.setProperty("--sky-p", progress.toFixed(3));
    };

    measure();
    write();

    const remeasure = () => {
      measure();
      last = -1;
    };

    // Reveals and late-loading imagery both change the document height, which
    // changes the mapping.
    const ro = new ResizeObserver(() => {
      remeasure();
      requestScrollFrame();
    });
    ro.observe(document.documentElement);

    const offScroll = onScrollFrame(write);
    const offResize = onViewportResize(remeasure);

    return () => {
      ro.disconnect();
      offScroll();
      offResize();
      el.style.removeProperty("--sky-p");
    };
  }, []);

  return (
    <div className="page-sky" ref={ref} aria-hidden="true">
      {/* The navy field, and the faint grid that gives it a sense of being a
          data space rather than a flat colour. */}
      <div className="page-sky-field" />
      <div className="page-sky-grid" />
      {/* Two auras of brand light, drifting with the scroll. */}
      <div className="page-sky-aura" />
      {/* Edge falloff, plus the extra depth the sections below the hero need
          to read at full contrast. */}
      <div className="page-sky-vignette" />
    </div>
  );
}
