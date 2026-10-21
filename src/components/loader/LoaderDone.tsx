"use client";

import { useEffect } from "react";

/**
 * Retires the intro overlay once it has finished.
 *
 * This island renders nothing and the loader does not depend on it. The
 * overlay's own CSS animation ends at `opacity: 0; visibility: hidden`, so it
 * clears itself whether or not this ever runs — which is what keeps a slow or
 * failed bundle from leaving a permanent sheet over the site. All this does
 * is set `data-loader-done` on `<html>` afterwards, which `display: none`s an
 * element that is already invisible, so the compositor stops carrying its
 * layers and the GPU work of the intro ends with the intro.
 *
 * It is in the root layout, which does not remount on a client-side
 * navigation, so the intro plays once per document load and never replays on
 * an ordinary route change. The flag is set on `<html>` rather than held in
 * React state for the same reason: a remount — React's development Strict
 * Mode runs effects twice — finds the attribute already there and does
 * nothing, so a second overlay can never appear.
 *
 * A timer rather than `animationend`: `animationend` does not fire if the
 * element is display:none'd by a media query, if the animation is skipped, or
 * on a backgrounded tab, and a loader that never gets cleaned up because the
 * tab was in the background is exactly the kind of loose end worth avoiding.
 * The timer is cleared on unmount.
 */

/** Comfortably past the end of the timeline in loader.css, including the
 *  4s duration plus its exit. */
const SETTLE_MS = 4500;

export function LoaderDone() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute("data-loader-done")) return;

    const done = () => root.setAttribute("data-loader-done", "");

    // Someone arriving on a reduced-motion setting has already seen the whole
    // of their (much shorter) intro by now.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(done, reduced ? 600 : SETTLE_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
