"use client";

import { useEffect } from "react";

import { useReducedMotion } from "./reduced-motion";
import { addTicker, onScrollFrame, onViewportResize, requestScrollFrame } from "./scroll-driver";

/**
 * The landing page's scroll stage.
 *
 * Every section of the page is a panel of one pinned frame. The frame holds
 * still while the document scrolls, and the panels cross-fade through it one
 * at a time over the shared background, so a section's content arrives and
 * leaves rather than scrolling past.
 *
 * This island renders nothing. Like the other islands here it only publishes
 * state for the stylesheets to act on:
 *
 *   on `.stage` and `.page-sky`
 *     --stage-p        0..1 across the whole sequence
 *     --stage-count    how many panels there are
 *   on `.stage` only
 *     data-stage-pinned  present only while the frame is actually pinned
 *
 *   on each panel
 *     --i              its index, written once
 *     --mo-progress    0..1 across that panel's own life, so every section's
 *                      existing motion keeps working unchanged
 *     data-stage-active  the one panel in the frame
 *     data-mo-scene / data-mo-live  the idling flags motion.css already uses
 *
 * `--stage-p` goes to `.page-sky` as well as `.stage` because the background
 * layer crossfades each section's own backdrop as that section takes the
 * frame, and it sits outside `.site-shell` where it cannot inherit anything
 * from the stage. Both are small elements, so the two writes are cheap; what
 * would not be cheap is putting this on `<html>`, where every scroll frame
 * would invalidate the style of the entire page.
 *
 * `--stage-p` is a two-frame eased follow of the scroll position rather than
 * the scroll position itself — see FOLLOW_TAU. It is still scroll-driven and
 * still fully reversible; it only stops a single wheel notch, which is a
 * seventh of a section, from landing as one step of the crossfade. It is
 * deliberately far too short to be felt as lag.
 *
 * Five behaviours beyond publishing, all of them there to keep a pinned page
 * behaving like a normal one:
 *
 *   * In-page links. Inside the pin every panel sits at the same place on
 *     screen, so `#waitlist` has no scroll position of its own. A click on a
 *     link pointing into a panel becomes a scroll to that panel's place on the
 *     stage, which is what the visitor meant by it.
 *
 *   * Focus. Tabbing can reach a form or a link in a panel that is not in the
 *     frame. Rather than making those panels `inert` — which would take their
 *     text out of the accessibility tree, and the whole point is that every
 *     section stays readable — the stage follows focus to the panel that owns
 *     it. Keyboard navigation walks the page in order and the view keeps up.
 *
 *   * Entrance replay. The reveal and sequence animations in motion.css fire
 *     on `data-inview`, which RevealObserver sets once, the first time an
 *     element is seen. In a pinned frame every panel is technically on screen
 *     from the start, so all eleven sections would "arrive" at once and none
 *     would ever arrive again. While pinned, the stage owns that flag instead:
 *     a panel's reveals are set when it takes the frame and cleared when it
 *     leaves, so each section plays its own entrance every time it comes
 *     round, in both scroll directions.
 *
 *   * Falling back. The pin needs a viewport it can fit a whole section into.
 *     Below that, and whenever the visitor has asked for reduced motion,
 *     nothing is pinned: the page scrolls normally, each panel gets the
 *     ordinary "travelling through the viewport" progress, and RevealObserver
 *     keeps its flag.
 */

/**
 * Where the frame is pinned.
 *
 * The width is the sidebar's breakpoint, not an arbitrary "desktop": below it
 * the sidebar is replaced by the mobile header, which is not part of the frame
 * and would scroll away out of reach. The height is the smallest window a
 * section still reads in.
 */
const PINNABLE = "(min-width: 1101px) and (min-height: 680px)";

/** Smallest change in a panel's progress worth a style invalidation. */
const EPSILON = 0.002;

/**
 * Time constant of the crossfade's follow, in seconds.
 *
 * Scroll does not arrive smoothly: one notch of a mouse wheel is 100px, which
 * is a seventh of a section, so a crossfade driven straight off `scrollY` is
 * sampled four or five times across a handover and steps rather than
 * dissolves. The published progress eases towards the scroll-derived target
 * so each notch plays out over a few frames instead of landing in one.
 *
 * Two frames, not five. The first version used 75ms, which is long enough to
 * feel: the fade visibly trailed the scroll, which is worse than a step,
 * because a step at least answers immediately. This is short enough that it
 * reads as the same motion the scroll is making and only removes the
 * quantisation. If the crossfade ever feels detached from the wheel again,
 * this number is the first thing to lower.
 */
const FOLLOW_TAU = 0.028;

/** Below this the follow has arrived; stop ticking. */
const SETTLED = 0.0015;

/**
 * Where panels that are out of the crossfade's reach are parked, in panels of
 * distance. Any value beyond --stage-span renders them at zero opacity; what
 * matters is that it is constant, so they stop being re-styled every frame.
 */
const PARKED = 9;

/**
 * How far behind the real scroll position the follow may ever fall, in panels.
 *
 * Easing alone is only safe for scroll-sized deltas. Dragging the scrollbar,
 * holding Page Down, or clicking a link that jumps ten sections moves the
 * target faster than an exponential follow can close, and the crossfade ends
 * up seconds behind the page — it was still sweeping through section two when
 * the document had already arrived at section eleven. The lag is clamped
 * instead, so a jump lands with the scroll while a wheel notch (about a
 * seventh of a panel, far inside this) still eases.
 */
const MAX_LAG = 0.25;

type StageMotionProps = {
  /** Number of panels, for the effect's dependency list. */
  count: number;
};

export function StageMotion({ count }: StageMotionProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>(".stage");
    const pin = stage?.querySelector<HTMLElement>(".stage-pin");
    if (!stage || !pin) return;

    // Only the sections are panels. Anything else inside the frame — the
    // backdrop layer, for instance — is scenery.
    const panels = Array.from(pin.querySelectorAll<HTMLElement>(":scope > main, :scope > section"));
    if (panels.length < 2) return;

    const sky = document.querySelector<HTMLElement>(".page-sky");
    const rail = stage.querySelector<HTMLElement>(".stage-rail");
    const last = panels.length - 1;
    const progress = panels.map(() => -1);
    /**
     * Last published `--stage-d` per panel, so an unchanged one is skipped.
     * Infinity, never NaN: the guard below is `Math.abs(d - distance[i]) >=
     * EPSILON`, and every comparison against NaN is false, so a NaN here
     * silently skips the write forever — which leaves every panel at the
     * property's initial value and renders all eleven sections stacked.
     */
    const distance = panels.map(() => Number.POSITIVE_INFINITY);
    /** The reveal/sequence elements inside each panel, looked up once. */
    const reveals = panels.map((panel) =>
      Array.from(panel.querySelectorAll<HTMLElement>("[data-reveal], [data-sequence]")),
    );
    let active = -1;

    panels.forEach((panel, index) => {
      panel.style.setProperty("--i", String(index));
      panel.setAttribute("data-stage-panel", "");
      panel.setAttribute("data-mo-scene", "");
    });
    for (const el of [rail, sky]) el?.style.setProperty("--stage-count", String(panels.length));

    // --- geometry, measured on resize only -----------------------------------
    let stageTop = 0;
    let travel = 1;
    const tops = panels.map(() => 0);
    const heights = panels.map(() => 1);

    const media = window.matchMedia(PINNABLE);
    let pinned = false;

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      stageTop = rect.top + window.scrollY;
      travel = Math.max(1, rect.height - window.innerHeight);
      if (pinned) return;
      panels.forEach((panel, index) => {
        const box = panel.getBoundingClientRect();
        tops[index] = box.top + window.scrollY;
        heights[index] = box.height || 1;
      });
    };

    /** Where the document has to be for panel `index` to be in the frame. */
    const anchorOf = (index: number) =>
      pinned ? stageTop + (travel * index) / last : tops[index];

    const writePanel = (index: number, value: number) => {
      if (Math.abs(value - progress[index]) < EPSILON) return;
      progress[index] = value;
      panels[index].style.setProperty("--mo-progress", value.toFixed(3));
    };

    /**
     * `--stage-p` goes to the rail and the background layer, and deliberately
     * not to `.stage`: it is an inherited property, and on the stage it would
     * invalidate the style of every element on the page on every frame.
     */
    const writeStage = (t: number) => {
      const p = (t / last).toFixed(4);
      rail?.style.setProperty("--stage-p", p);
      sky?.style.setProperty("--stage-p", p);
    };

    const setActive = (index: number) => {
      if (index === active) return;
      if (active >= 0) {
        delete panels[active].dataset.stageActive;
        if (pinned) for (const node of reveals[active]) delete node.dataset.inview;
      }
      active = index;
      panels[index].dataset.stageActive = "";
      if (pinned) for (const node of reveals[index]) node.dataset.inview = "true";
      // Ambient loops run in the panel in the frame and its two neighbours —
      // the ones a crossfade can put on screen — and stand down everywhere
      // else, which is the budget motion.css already assumed.
      panels.forEach((panel, i) => {
        panel.toggleAttribute("data-mo-live", Math.abs(i - index) <= 1);
      });
    };

    // --- the eased follow ----------------------------------------------------
    let targetT = 0;
    let shownT = 0;
    let stopTicker: (() => void) | undefined;
    let snapNext = false;

    /** Write one position of the stage out to the DOM. */
    const publish = (t: number) => {
      writeStage(t);
      const step = Math.round(t);
      const current = step < 0 ? 0 : step > last ? last : step;

      for (let i = 0; i < panels.length; i += 1) {
        const near = Math.abs(i - current) <= 1;
        // A panel two or more steps from the frame is always further than
        // --stage-span away, so its opacity is already zero and nothing it
        // could be told would change what is on screen. It is parked at a
        // fixed distance instead of being driven, which lets the compositor
        // drop its layer rather than keep eleven full-viewport layers alive
        // and updating. Measured on a 60Hz integrated-GPU laptop: driving all
        // eleven dropped 60% of frames, three dropped 44%, one dropped 26%.
        const d = near ? t - i : PARKED;
        // `--stage-d` does not inherit, so this invalidates the panel and
        // nothing inside it.
        if (Math.abs(d - distance[i]) >= EPSILON) {
          distance[i] = d;
          panels[i].style.setProperty("--stage-d", d.toFixed(3));
        }
        // `--mo-progress` does inherit — every section's own motion reads it —
        // so it is only published for the panel in the frame and its two
        // neighbours. Those are the only ones that can be seen, and the only
        // ones whose internal parallax can therefore matter.
        if (!near) continue;
        const local = (d + 1) / 2;
        writePanel(i, local < 0 ? 0 : local > 1 ? 1 : local);
      }

      setActive(current);
    };

    const tick = (dt: number) => {
      const gap = targetT - shownT;
      if (gap > MAX_LAG) shownT = targetT - MAX_LAG;
      else if (gap < -MAX_LAG) shownT = targetT + MAX_LAG;
      shownT += (targetT - shownT) * (1 - Math.exp(-dt / FOLLOW_TAU));
      if (Math.abs(targetT - shownT) < SETTLED) {
        shownT = targetT;
        stopTicker?.();
        stopTicker = undefined;
      }
      publish(shownT);
    };

    /** Arrive immediately — first paint, a resize, a jump to a panel. */
    const snap = () => {
      shownT = targetT;
      stopTicker?.();
      stopTicker = undefined;
      publish(shownT);
    };

    const write = () => {
      if (pinned) {
        const raw = (window.scrollY - stageTop) / travel;
        const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        targetT = p * last;
        if (snapNext) {
          snapNext = false;
          snap();
          return;
        }
        // The ticker is self-stopping, so a settled page costs nothing.
        if (!stopTicker) stopTicker = addTicker(tick);
        return;
      }

      // Not pinned: the ordinary mapping, 0 as a section enters the bottom of
      // the viewport and 1 as it leaves the top.
      const scrollY = window.scrollY;
      const view = window.innerHeight;
      const middle = scrollY + view / 2;
      let t = 0;
      for (let i = 0; i < panels.length; i += 1) {
        const raw = (scrollY + view - tops[i]) / (heights[i] + view);
        writePanel(i, raw < 0 ? 0 : raw > 1 ? 1 : raw);
        // Which section the middle of the viewport is in, and how far: the
        // same 0..count-1 the pinned branch produces, so the background's
        // scene crossfade is driven identically in both modes.
        if (middle >= tops[i]) t = i + Math.min(1, (middle - tops[i]) / heights[i]);
      }
      writeStage(Math.min(last, t));
      setActive(Math.min(last, Math.round(t)));
    };

    const applyMode = () => {
      const next = media.matches && !reduced;
      if (next !== pinned && active >= 0 && pinned) {
        // Leaving pinned mode: hand the reveal flag back, fully shown.
        for (const node of reveals[active]) node.dataset.inview = "now";
      }
      pinned = next;
      snapNext = true;
      stopTicker?.();
      stopTicker = undefined;
      stage.toggleAttribute("data-stage-pinned", pinned);
      if (pinned) {
        // Everything not in the frame starts hidden again.
        for (const list of reveals) for (const node of list) delete node.dataset.inview;
      } else {
        for (const list of reveals) for (const node of list) node.dataset.inview = "now";
      }
      for (let i = 0; i < progress.length; i += 1) {
        progress[i] = -1;
        distance[i] = Number.POSITIVE_INFINITY;
      }
      active = -1;
      measure();
      write();
    };

    applyMode();

    // --- in-page links and focus ---------------------------------------------
    const panelOf = (node: Element | null | undefined) => {
      const panel = node?.closest?.<HTMLElement>("[data-stage-panel]");
      return panel ? panels.indexOf(panel) : -1;
    };

    const goTo = (index: number, behavior: ScrollBehavior) => {
      // A jump is not a scroll gesture: the follow would otherwise spend its
      // easing sliding through every section in between.
      if (behavior === "instant") snapNext = true;
      window.scrollTo({ top: Math.round(anchorOf(index)), behavior });
    };

    const onClick = (event: MouseEvent) => {
      if (!pinned || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      let target: Element | null = null;
      try {
        target = document.querySelector(hash);
      } catch {
        return;
      }
      const index = panelOf(target);
      if (index < 0) return;
      event.preventDefault();
      goTo(index, "smooth");
      history.replaceState(null, "", hash);
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!pinned) return;
      const index = panelOf(event.target as Element | null);
      // Only when focus has genuinely left the panel in the frame: moving
      // between controls inside it must never move the page.
      if (index < 0 || index === active) return;
      // Instant, not smooth: following focus is not a journey the visitor
      // asked to watch, and animating it would leave what they just tabbed to
      // off screen for the length of the scroll.
      goTo(index, "instant");
    };

    document.addEventListener("click", onClick);
    stage.addEventListener("focusin", onFocusIn);

    // --- wiring ---------------------------------------------------------------
    const remeasure = () => {
      measure();
      snapNext = true;
      for (let i = 0; i < progress.length; i += 1) progress[i] = -1;
    };

    const ro = new ResizeObserver(() => {
      remeasure();
      requestScrollFrame();
    });
    ro.observe(stage);

    const offScroll = onScrollFrame(write);
    const offResize = onViewportResize(remeasure);
    media.addEventListener("change", applyMode);

    return () => {
      media.removeEventListener("change", applyMode);
      document.removeEventListener("click", onClick);
      stage.removeEventListener("focusin", onFocusIn);
      ro.disconnect();
      offScroll();
      offResize();
      stopTicker?.();
      stage.removeAttribute("data-stage-pinned");
      sky?.style.removeProperty("--stage-p");
      sky?.style.removeProperty("--stage-count");
      rail?.style.removeProperty("--stage-p");
      rail?.style.removeProperty("--stage-count");
      panels.forEach((panel) => {
        panel.style.removeProperty("--i");
        panel.style.removeProperty("--stage-d");
        panel.style.removeProperty("--mo-progress");
        panel.removeAttribute("data-stage-panel");
        panel.removeAttribute("data-stage-active");
        panel.removeAttribute("data-mo-scene");
        panel.removeAttribute("data-mo-live");
      });
    };
  }, [count, reduced]);

  return null;
}
