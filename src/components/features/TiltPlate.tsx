"use client";

import { useRef, type ReactNode } from "react";

/**
 * Pointer-driven 3D tilt for a feature plate.
 *
 * Writes `--ftx-rx` / `--ftx-ry` / `--ftx-mx` / `--ftx-my` and lets CSS do the
 * transform and the easing, so the only work per frame is four custom
 * properties. Children are passed through untouched and stay server-rendered.
 *
 * Coarse pointers get nothing: `(hover: hover)` gates the listener, so a touch
 * device never ends up with a plate stuck at an angle.
 */
export function TiltPlate({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty("--ftx-ry", `${(x * 7).toFixed(2)}deg`);
      node.style.setProperty("--ftx-rx", `${(-y * 5).toFixed(2)}deg`);
      node.style.setProperty("--ftx-mx", `${(x * 100 + 50).toFixed(1)}%`);
      node.style.setProperty("--ftx-my", `${(y * 100 + 50).toFixed(1)}%`);
    });
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    cancelAnimationFrame(frame.current);
    node.style.removeProperty("--ftx-ry");
    node.style.removeProperty("--ftx-rx");
    node.style.removeProperty("--ftx-mx");
    node.style.removeProperty("--ftx-my");
  };

  return (
    <div ref={ref} className={className} onPointerMove={track} onPointerLeave={reset}>
      {children}
    </div>
  );
}
