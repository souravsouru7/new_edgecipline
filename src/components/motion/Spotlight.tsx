"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Pointer spotlight + tilt for the step cards.
 *
 * One delegated listener on the list drives `--mo-sx/--mo-sy` (pointer position
 * inside the hovered card, 0..1) and `--mo-tx/--mo-ty` (-1..1 for the tilt).
 * Everything else — the radial highlight, the 3deg rotation, the border lift —
 * lives in CSS, so a coarse pointer or reduced-motion visitor simply never gets
 * the variables and keeps the plain card.
 */
export function Spotlight({
  target,
  item = "[data-spotlight]",
}: {
  target: string;
  item?: string;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = document.getElementById(target);
    if (!root) return;

    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    let active: HTMLElement | null = null;
    let detach: (() => void) | undefined;

    const clear = () => {
      if (!active) return;
      active.removeAttribute("data-hover");
      active.style.removeProperty("--mo-sx");
      active.style.removeProperty("--mo-sy");
      active.style.removeProperty("--mo-tx");
      active.style.removeProperty("--mo-ty");
      active = null;
    };

    const attach = () => {
      detach?.();
      detach = undefined;
      clear();
      if (!fine.matches) return;

      const onMove = (event: PointerEvent) => {
        const card = (event.target as Element | null)?.closest<HTMLElement>(item) ?? null;
        if (card !== active) {
          clear();
          active = card;
          card?.setAttribute("data-hover", "");
        }
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--mo-sx", `${(x * 100).toFixed(2)}%`);
        card.style.setProperty("--mo-sy", `${(y * 100).toFixed(2)}%`);
        card.style.setProperty("--mo-tx", (x * 2 - 1).toFixed(3));
        card.style.setProperty("--mo-ty", (y * 2 - 1).toFixed(3));
      };

      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", clear);
      detach = () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", clear);
      };
    };

    attach();
    fine.addEventListener("change", attach);
    return () => {
      fine.removeEventListener("change", attach);
      detach?.();
      clear();
    };
  }, [item, reduced, target]);

  return null;
}
