"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

const STRENGTH = 0.16;
const MAX_PX = 7;

/**
 * Desktop-only magnetic pull for the hero call-to-action pair.
 *
 * A listener per button group writes `--mo-mx/--mo-my` in pixels; the easing is
 * a plain CSS transition on the button, so the pull costs no animation frames
 * and the buttons keep their real click, focus and keyboard behaviour.
 */
export function Magnetic({ group = "[data-magnet-group]" }: { group?: string }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const groups = Array.from(document.querySelectorAll<HTMLElement>(group));
    if (!groups.length) return;

    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    let detach: Array<() => void> = [];

    const attach = () => {
      for (const off of detach) off();
      detach = [];
      if (!fine.matches) return;

      for (const container of groups) {
        const targets = Array.from(container.querySelectorAll<HTMLElement>("[data-magnetic]"));
        if (!targets.length) continue;

        const reset = () => {
          for (const el of targets) {
            el.style.setProperty("--mo-mx", "0px");
            el.style.setProperty("--mo-my", "0px");
          }
        };

        const onMove = (event: PointerEvent) => {
          for (const el of targets) {
            const rect = el.getBoundingClientRect();
            const dx = (event.clientX - (rect.left + rect.width / 2)) * STRENGTH;
            const dy = (event.clientY - (rect.top + rect.height / 2)) * STRENGTH;
            const clamp = (v: number) => Math.max(-MAX_PX, Math.min(MAX_PX, v));
            el.style.setProperty("--mo-mx", `${clamp(dx).toFixed(2)}px`);
            el.style.setProperty("--mo-my", `${clamp(dy).toFixed(2)}px`);
          }
        };

        container.addEventListener("pointermove", onMove, { passive: true });
        container.addEventListener("pointerleave", reset);
        detach.push(() => {
          container.removeEventListener("pointermove", onMove);
          container.removeEventListener("pointerleave", reset);
          reset();
        });
      }
    };

    attach();
    fine.addEventListener("change", attach);
    return () => {
      fine.removeEventListener("change", attach);
      for (const off of detach) off();
    };
  }, [group, reduced]);

  return null;
}
