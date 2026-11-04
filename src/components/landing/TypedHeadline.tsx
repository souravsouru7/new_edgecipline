"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { getOpenerPhase, subscribeOpener } from "./openerState";

const LINES = ["SAME MARKETS.", "A DISCIPLINED", "YOU."] as const;
const TOTAL = LINES.reduce((n, l) => n + l.length, 0);
const TYPE_MS = 70;
const ERASE_MS = 32;
const HOLD_MS = 1800;
const REST_MS = 500;

type Mode = "holding" | "erasing" | "resting" | "typing";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const m = window.matchMedia(REDUCED_QUERY);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const isOpenerDone = () => getOpenerPhase() === "done";
const serverFalse = () => false;

export function TypedHeadline() {
  const [count, setCount] = useState<number>(TOTAL);
  const [mode, setMode] = useState<Mode>("holding");
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, serverFalse);
  // The full line holds behind the opener; the cycle starts once it is gone,
  // so the reveal never lands on a half-typed headline.
  const openerDone = useSyncExternalStore(subscribeOpener, isOpenerDone, serverFalse);

  useEffect(() => {
    if (reduced || !openerDone) return;
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
  }, [count, mode, reduced, openerDone]);

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

  // The animated letters are drawn from data-text by CSS (::before), so they
  // are not text in the document. The h1's only copy of the slogan is the
  // sr-only line below, which crawlers and screen readers both read once.
  const renderText = (lineIndex: number, text: string) => {
    if (lineIndex === 1) {
      const plain = text.slice(0, 2);
      const emphasized = text.slice(2);
      return (
        <>
          <span className="edg-type-glyphs" data-text={plain} />
          {emphasized && <em className="edg-type-glyphs" data-text={emphasized} />}
        </>
      );
    }
    return <span className="edg-type-glyphs" data-text={text} />;
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
