"use client";

import { useEffect, useRef, useState } from "react";

import { getOpenerPhase, setOpenerPhase } from "./openerState";

/** Minimum time the opener is on screen, measured from first paint. */
const MIN_VISIBLE_MS = 6000;
const EXIT_DURATION = 900;
/** Exit starts 5.2s after first paint, so the opener is on screen for 6.1s. */
const EXIT_AT_MS = MIN_VISIBLE_MS + 100 - EXIT_DURATION;
/** Read by the pre-paint script in app/layout.tsx to skip a replay on Back. */
const SEEN_KEY = "edg-opener-seen";

/**
 * True when the homepage is reached by client-side navigation after the
 * opener has already played this session. A full load of "/" is marked by the
 * pre-paint script (edgLoading, or edgOpener="skip"), and must render the
 * opener exactly as the server did, so it never counts here.
 */
function playedBeforeClientNav() {
  if (typeof document === "undefined") return false;
  if (getOpenerPhase() === "done") return true;
  const root = document.documentElement;
  if ("edgLoading" in root.dataset || root.dataset.edgOpener === "skip") return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function LandingLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Decided before the first render so a skipped opener never flashes.
  const [alreadyPlayed] = useState(playedBeforeClientNav);

  useEffect(() => {
    const overlay = overlayRef.current;
    const root = document.documentElement;
    if (!overlay || alreadyPlayed || getOpenerPhase() === "done" || root.dataset.edgOpener === "skip") {
      if (overlay) overlay.hidden = true;
      delete root.dataset.edgLoading;
      setOpenerPhase("done");
      return;
    }

    // Set by the pre-paint script on a full load, so the server-rendered
    // overlay was on screen from first paint. Absent after a client navigation.
    const paintedOnLoad = "edgLoading" in root.dataset;
    root.dataset.edgLoading = "";
    setOpenerPhase("playing");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      overlay.hidden = true;
      delete root.dataset.edgLoading;
      // Never leave focus on a control that has just disappeared; the next
      // Tab then starts from the top of the page ("Skip to content").
      if (document.activeElement instanceof HTMLElement && overlay.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setOpenerPhase("done");
    };
    const exit = () => {
      if (finished || overlay.classList.contains("is-out")) return;
      overlay.classList.add("is-out");
      setOpenerPhase("exiting");
      timers.push(window.setTimeout(finish, EXIT_DURATION));
    };

    if (reducedMotion) {
      timers.push(window.setTimeout(exit, 50));
    } else {
      // The CSS timeline starts when the overlay is first painted, so the exit
      // is timed from that moment rather than from when this script ran. A
      // slow load no longer stretches the opener, and it never runs short.
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
      const shownAt = paintedOnLoad && fcp !== undefined ? fcp : performance.now();
      const after = (ms: number) => Math.max(0, shownAt + ms - performance.now());
      timers.push(window.setTimeout(exit, after(EXIT_AT_MS)));
    }

    return () => {
      timers.forEach(window.clearTimeout);
      delete root.dataset.edgLoading;
      if (!finished) setOpenerPhase("pending");
    };
  }, [alreadyPlayed]);

  return (
    <div
      ref={overlayRef}
      className="edg-cinema"
      hidden={alreadyPlayed || undefined}
      role="status"
      aria-label="Edgecipline introduction: from emotional reaction to disciplined execution."
    >
      <div className="edg-cinema__wash" aria-hidden="true" />
      <div className="edg-cinema__grid" aria-hidden="true" />

      <header className="edg-cinema__hud" aria-hidden="true">
        <span>EDG / SIGNAL 01</span>
        <span>BEHAVIOURAL SYSTEM</span>
        <span>07.2 SEC</span>
      </header>

      <div className="edg-cinema__scope" aria-hidden="true">
        <span className="edg-cinema__orbit edg-cinema__orbit--one" />
        <span className="edg-cinema__orbit edg-cinema__orbit--two" />
        <span className="edg-cinema__orbit edg-cinema__orbit--three" />
        <span className="edg-cinema__crosshair" />
        <span className="edg-cinema__core" />
        <svg className="edg-cinema__signal" viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
          <path className="edg-cinema__signal-ghost" d="M0 139 L55 136 L82 66 L113 210 L148 98 L186 173 L222 48 L260 199 L301 82 L340 151 L374 119 L410 142 L449 111 L488 132 L530 116 L574 129 L618 113 L663 122 L709 109 L754 116 L800 101" />
          <path className="edg-cinema__signal-hot" d="M0 139 L55 136 L82 66 L113 210 L148 98 L186 173 L222 48 L260 199 L301 82 L340 151 L374 119 L410 142 L449 111 L488 132 L530 116 L574 129 L618 113 L663 122 L709 109 L754 116 L800 101" />
          <path className="edg-cinema__signal-calm" d="M0 156 C90 151 132 166 206 148 S330 139 401 132 S512 128 588 112 S704 103 800 77" />
        </svg>
        <span className="edg-cinema__scan" />
      </div>

      <div className="edg-cinema__story" aria-hidden="true">
        <section className="edg-cinema__chapter edg-cinema__chapter--one"><small>01 / IMPULSE</small><div>THE MARKET MOVES FAST.</div></section>
        <section className="edg-cinema__chapter edg-cinema__chapter--two"><small>02 / EMOTION</small><div>YOUR MIND MOVES FASTER.</div></section>
        <section className="edg-cinema__chapter edg-cinema__chapter--three"><small>03 / AWARENESS</small><div>THE PATTERN BECOMES VISIBLE.</div></section>
        <section className="edg-cinema__chapter edg-cinema__chapter--four"><small>04 / DISCIPLINE</small><div>CHANGE THE NEXT DECISION.</div></section>
      </div>

      <footer className="edg-cinema__footer" aria-hidden="true"><span>EMOTION</span><i><b /></i><span>DISCIPLINE</span></footer>
    </div>
  );
}
