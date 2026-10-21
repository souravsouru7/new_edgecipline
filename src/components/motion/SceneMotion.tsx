"use client";

import { useEffect } from "react";

import { useReducedMotion } from "./reduced-motion";
import { addTicker, onScrollFrame, onViewportResize, requestScrollFrame } from "./scroll-driver";

/**
 * Behaviour island for one scene.
 *
 * It renders nothing. It attaches to an already server-rendered section and
 * publishes two things on it as custom properties, which motion.css consumes:
 *
 *   --mo-progress  how far the section has travelled through the viewport, 0..1
 *                  (see `mode` for the two mappings)
 *   --mo-px/--mo-py  smoothed pointer offset from the section centre, -1..1
 *
 * Keeping the maths here and the displacement in CSS means every layer's depth
 * stays tunable in one stylesheet, and nothing in the markup has to become a
 * Client Component.
 *
 * All ten scenes share the page's single scroll listener and single frame
 * callback (see scroll-driver.ts), and only the ones actually on screen do any
 * work in it.
 */
type SceneMotionProps = {
  /** id of the section to drive, without the `#`. */
  target: string;
  /** Publish --mo-progress. */
  scroll?: boolean;
  /**
   * How --mo-progress is measured.
   *
   *   "cover" (default) 0 as the section enters the viewport bottom, 1 as it
   *           leaves the top — right for sections that scroll in from below.
   *   "exit"  0 while the section's top is at the viewport top, 1 once it has
   *           scrolled fully past — right for the hero, which is already in
   *           view on first paint.
   */
  mode?: "cover" | "exit";
  /** Publish --mo-px / --mo-py (skipped for coarse pointers and reduced motion). */
  pointer?: boolean;
  /** Minimum viewport width that gets pointer tracking. */
  pointerMinWidth?: number;
};

/**
 * Writing a custom property re-styles the section's whole subtree, so a step
 * smaller than this is spent for nothing: at 1/1000 of the travel no layer on
 * the page moves even a visible fraction of a pixel.
 */
const PROGRESS_EPSILON = 0.001;

/** Time constant of the pointer follow, in seconds. Lower = snappier. */
const POINTER_TAU = 0.085;

export function SceneMotion({
  target,
  scroll = true,
  mode = "cover",
  pointer = false,
  pointerMinWidth = 1024,
}: SceneMotionProps) {
  const reduced = useReducedMotion();

  // --- scroll progress -------------------------------------------------------
  useEffect(() => {
    if (!scroll) return;
    const el = document.getElementById(target);
    if (!el) return;

    // Marks the section as a motion scene. motion.css pairs this with
    // `data-mo-live` below to stand every ambient loop in the section down
    // while it is off screen, which is most of the page most of the time.
    el.setAttribute("data-mo-scene", "");

    // Geometry is cached and only re-measured on resize or when the section's own
    // box changes (late-loading imagery, breakpoint switches), so the scroll
    // handler never reads layout and never thrashes.
    let top = 0;
    let height = 1;
    let visible = true;
    let last = -1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height || 1;
    };

    const write = () => {
      if (!visible) return;
      const travel = mode === "exit" ? height : height + window.innerHeight;
      const reach =
        mode === "exit"
          ? window.scrollY - top
          : window.scrollY + window.innerHeight - top;
      const raw = reach / travel;
      const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      if (Math.abs(progress - last) < PROGRESS_EPSILON) return;
      last = progress;
      el.style.setProperty("--mo-progress", progress.toFixed(3));
    };

    measure();
    write();

    // Pause the work entirely while the section is off screen. The margin is
    // kept tight on purpose: every extra scene left live is another subtree
    // re-styled on every frame of the scroll.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        el.toggleAttribute("data-mo-live", visible);
        if (!visible) return;
        measure();
        last = -1;
        write();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);

    const remeasure = () => {
      measure();
      last = -1;
    };

    const ro = new ResizeObserver(() => {
      remeasure();
      requestScrollFrame();
    });
    ro.observe(el);

    const offScroll = onScrollFrame(write);
    const offResize = onViewportResize(remeasure);

    return () => {
      io.disconnect();
      ro.disconnect();
      offScroll();
      offResize();
      el.removeAttribute("data-mo-scene");
      el.removeAttribute("data-mo-live");
      el.style.removeProperty("--mo-progress");
    };
  }, [mode, scroll, target]);

  // --- pointer depth ---------------------------------------------------------
  useEffect(() => {
    if (!pointer || reduced) return;
    const el = document.getElementById(target);
    if (!el) return;

    const fine = window.matchMedia(`(pointer: fine) and (min-width: ${pointerMinWidth}px)`);
    let detach: (() => void) | undefined;

    const attach = () => {
      detach?.();
      detach = undefined;
      el.style.removeProperty("--mo-px");
      el.style.removeProperty("--mo-py");
      if (!fine.matches) return;

      // The follow is an exponential ease towards the pointer, run from the
      // page's shared frame loop. It only ticks while there is distance left
      // to cover, so a still pointer costs nothing at all.
      let targetX = 0;
      let targetY = 0;
      let x = 0;
      let y = 0;
      let stop: (() => void) | undefined;

      const tick = (dt: number) => {
        const k = 1 - Math.exp(-dt / POINTER_TAU);
        x += (targetX - x) * k;
        y += (targetY - y) * k;
        const done = Math.abs(targetX - x) < 0.002 && Math.abs(targetY - y) < 0.002;
        if (done) {
          x = targetX;
          y = targetY;
        }
        el.style.setProperty("--mo-px", x.toFixed(3));
        el.style.setProperty("--mo-py", y.toFixed(3));
        if (done) {
          stop?.();
          stop = undefined;
        }
      };

      const start = () => {
        if (!stop) stop = addTicker(tick);
      };

      // Pointer events can outpace the frame rate, so the section box is read
      // at most once per scroll or resize rather than once per move.
      let box: DOMRect | null = null;
      const invalidate = () => {
        box = null;
      };

      const onMove = (event: PointerEvent) => {
        box ??= el.getBoundingClientRect();
        targetX = ((event.clientX - box.left) / box.width) * 2 - 1;
        targetY = ((event.clientY - box.top) / box.height) * 2 - 1;
        start();
      };
      const onLeave = () => {
        targetX = 0;
        targetY = 0;
        start();
      };

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      const offScroll = onScrollFrame(invalidate);
      const offResize = onViewportResize(invalidate);
      detach = () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        offScroll();
        offResize();
        stop?.();
      };
    };

    attach();
    fine.addEventListener("change", attach);
    return () => {
      fine.removeEventListener("change", attach);
      detach?.();
      el.style.removeProperty("--mo-px");
      el.style.removeProperty("--mo-py");
    };
  }, [pointer, pointerMinWidth, reduced, target]);

  return null;
}
