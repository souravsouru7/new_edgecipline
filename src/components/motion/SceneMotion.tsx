"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useSpring } from "motion/react";

/**
 * Behaviour island for one scene.
 *
 * It renders nothing. It attaches to an already server-rendered section and
 * publishes two things on it as custom properties, which motion.css consumes:
 *
 *   --mo-progress  how far the section has travelled through the viewport, 0..1
 *                  (see `mode` for the two mappings)
 *   --mo-px/--mo-py  spring-smoothed pointer offset from the section centre, -1..1
 *
 * Keeping the maths here and the displacement in CSS means every layer's depth
 * stays tunable in one stylesheet, and nothing in the markup has to become a
 * Client Component.
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

const POINTER_SPRING = { stiffness: 70, damping: 20, mass: 0.6 } as const;

export function SceneMotion({
  target,
  scroll = true,
  mode = "cover",
  pointer = false,
  pointerMinWidth = 1024,
}: SceneMotionProps) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement | null>(null);
  const px = useSpring(0, POINTER_SPRING);
  const py = useSpring(0, POINTER_SPRING);

  // The springs emit once per frame while the pointer is moving, so the element
  // is looked up once and kept rather than queried on every tick.
  useMotionValueEvent(px, "change", (value) => {
    section.current?.style.setProperty("--mo-px", value.toFixed(4));
  });
  useMotionValueEvent(py, "change", (value) => {
    section.current?.style.setProperty("--mo-py", value.toFixed(4));
  });

  // --- scroll progress -------------------------------------------------------
  useEffect(() => {
    if (!scroll) return;
    const el = document.getElementById(target);
    if (!el) return;

    // Geometry is cached and only re-measured on resize or when the section's own
    // box changes (late-loading imagery, breakpoint switches), so the scroll
    // handler never reads layout and never thrashes.
    let top = 0;
    let height = 1;
    let visible = true;
    let frame = 0;
    let last = -1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height || 1;
    };

    const write = () => {
      frame = 0;
      const travel = mode === "exit" ? height : height + window.innerHeight;
      const reach =
        mode === "exit"
          ? window.scrollY - top
          : window.scrollY + window.innerHeight - top;
      const raw = reach / travel;
      const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      if (Math.abs(progress - last) < 0.0005) return;
      last = progress;
      el.style.setProperty("--mo-progress", progress.toFixed(4));
    };

    const schedule = () => {
      if (!visible || frame) return;
      frame = requestAnimationFrame(write);
    };

    const onResize = () => {
      measure();
      last = -1;
      schedule();
    };

    measure();
    write();

    // Pause the work entirely while the section is far from the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        el.toggleAttribute("data-mo-live", visible);
        if (visible) {
          measure();
          schedule();
        }
      },
      { rootMargin: "25% 0px" },
    );
    io.observe(el);

    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode, scroll, target]);

  // --- pointer depth ---------------------------------------------------------
  useEffect(() => {
    if (!pointer || reduced) return;
    const el = document.getElementById(target);
    if (!el) return;

    section.current = el;
    const fine = window.matchMedia(`(pointer: fine) and (min-width: ${pointerMinWidth}px)`);
    let detach: (() => void) | undefined;

    const attach = () => {
      detach?.();
      detach = undefined;
      if (!fine.matches) {
        px.jump(0);
        py.jump(0);
        return;
      }

      // Pointer events can outpace the frame rate, so the section box is read
      // at most once per scroll or resize rather than once per move.
      let box: DOMRect | null = null;
      const invalidate = () => {
        box = null;
      };

      const onMove = (event: PointerEvent) => {
        box ??= el.getBoundingClientRect();
        px.set(((event.clientX - box.left) / box.width) * 2 - 1);
        py.set(((event.clientY - box.top) / box.height) * 2 - 1);
      };
      const onLeave = () => {
        px.set(0);
        py.set(0);
      };

      el.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", onLeave);
      window.addEventListener("scroll", invalidate, { passive: true });
      window.addEventListener("resize", invalidate);
      detach = () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", invalidate);
        window.removeEventListener("resize", invalidate);
      };
    };

    attach();
    fine.addEventListener("change", attach);
    return () => {
      fine.removeEventListener("change", attach);
      detach?.();
      section.current = null;
      el.style.removeProperty("--mo-px");
      el.style.removeProperty("--mo-py");
    };
  }, [pointer, pointerMinWidth, px, py, reduced, target]);

  return null;
}
