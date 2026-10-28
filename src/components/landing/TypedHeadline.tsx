"use client";

import { useEffect, useRef, useState } from "react";

const LINES = ["SAME MARKETS.", "A DISCIPLINED", "YOU."] as const;
const TOTAL = LINES.reduce((n, l) => n + l.length, 0);
const TYPE_MS = 70;
const ERASE_MS = 32;
const HOLD_MS = 1800;
const REST_MS = 500;

type Mode = "holding" | "erasing" | "resting" | "typing";

export function TypedHeadline() {
  const [count, setCount] = useState<number>(TOTAL);
  const [mode, setMode] = useState<Mode>("holding");
  const [reduced, setReduced] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener("change", onChange);
    mounted.current = true;
    return () => m.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let t: ReturnType<typeof setTimeout>;
    if (mode === "holding") {
      t = setTimeout(() => setMode("erasing"), HOLD_MS);
    } else if (mode === "erasing") {
      if (count <= 0) t = setTimeout(() => setMode("resting"), 150);
      else t = setTimeout(() => setCount((c) => c - 1), ERASE_MS);
    } else if (mode === "resting") {
      t = setTimeout(() => setMode("typing"), REST_MS);
    } else {
      if (count >= TOTAL) t = setTimeout(() => setMode("holding"), 0);
      else t = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
    }
    return () => clearTimeout(t);
  }, [count, mode, reduced]);

  const parts: string[] = [];
  let remaining = reduced ? TOTAL : count;
  for (const line of LINES) {
    const take = Math.max(0, Math.min(remaining, line.length));
    parts.push(line.slice(0, take));
    remaining -= take;
  }

  let activeLine = 0;
  for (let i = LINES.length - 1; i >= 0; i--) {
    if (parts[i].length > 0) { activeLine = i; break; }
  }
  if (!reduced && mode === "typing" && count < TOTAL) {
    let acc = 0;
    for (let i = 0; i < LINES.length; i++) {
      acc += LINES[i].length;
      if (count < acc) { activeLine = i; break; }
    }
  }

  const renderText = (lineIndex: number, text: string) => {
    if (lineIndex === 1) {
      const plain = text.slice(0, 2);
      const emphasized = text.slice(2);
      return (
        <>
          {plain}
          {emphasized && <em>{emphasized}</em>}
        </>
      );
    }
    return text;
  };

  return (
    <>
      {LINES.map((line, i) => (
        <span key={i} className="edg-hero-line edg-hero-line-typed" aria-hidden="true">
          <span className="edg-type-live">
            {parts[i].length === 0 ? " " : renderText(i, parts[i])}
          </span>
          <span
            className="edg-type-caret"
            data-active={activeLine === i ? "" : undefined}
            aria-hidden="true"
          />
        </span>
      ))}
      <span className="sr-only">{LINES.join(" ")}</span>
    </>
  );
}
