"use client";

/**
 * One scroll listener, one rAF, one resize listener for the whole page.
 *
 * Before this, every motion island owned its own `scroll` handler and its own
 * `requestAnimationFrame`: ten scenes plus the sidebar spy plus the scroll flag
 * meant the browser woke ~14 handlers and scheduled up to a dozen separate
 * frame callbacks per scroll event. They all did the same thing — read
 * `scrollY`, write a few custom properties — so they are pooled here instead
 * and run back to back inside a single frame.
 *
 * The scroll flag lives here too (`<html data-scrolling>`), because the flag
 * and the frame share the same timer.
 */

type Task = () => void;
type Ticker = (dt: number) => void;

const scrollTasks = new Set<Task>();
const resizeTasks = new Set<Task>();
const tickers = new Set<Ticker>();

/** How long after the last scroll event the page counts as settled. */
const SETTLE_MS = 140;

let scrollFrame = 0;
let settleTimer = 0;
let bound = false;

let tickFrame = 0;
let lastTick = 0;

function runScroll() {
  scrollFrame = 0;
  for (const task of scrollTasks) task();
}

/** Coalesces every caller in a frame into one callback. */
export function requestScrollFrame() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(runScroll);
}

function settle() {
  settleTimer = 0;
  document.documentElement.removeAttribute("data-scrolling");
}

function onScroll() {
  if (settleTimer) window.clearTimeout(settleTimer);
  else document.documentElement.setAttribute("data-scrolling", "");
  settleTimer = window.setTimeout(settle, SETTLE_MS);
  requestScrollFrame();
}

function onResize() {
  for (const task of resizeTasks) task();
  requestScrollFrame();
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function unbindIfIdle() {
  if (!bound || scrollTasks.size || resizeTasks.size) return;
  bound = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  if (settleTimer) {
    window.clearTimeout(settleTimer);
    settleTimer = 0;
  }
  if (scrollFrame) {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }
  document.documentElement.removeAttribute("data-scrolling");
}

/** Run `task` at most once per frame while the page is scrolling. */
export function onScrollFrame(task: Task) {
  scrollTasks.add(task);
  bind();
  return () => {
    scrollTasks.delete(task);
    unbindIfIdle();
  };
}

/** Run `task` on resize, before the next scroll frame. */
export function onViewportResize(task: Task) {
  resizeTasks.add(task);
  bind();
  return () => {
    resizeTasks.delete(task);
    unbindIfIdle();
  };
}

function runTick(now: number) {
  if (!tickers.size) {
    tickFrame = 0;
    return;
  }
  tickFrame = requestAnimationFrame(runTick);
  const dt = Math.min(0.05, (now - lastTick) / 1000) || 1 / 60;
  lastTick = now;
  for (const ticker of tickers) ticker(dt);
}

/**
 * A continuous frame loop, shared and self-stopping: it only runs while at
 * least one ticker is registered, so an idle pointer costs nothing.
 */
export function addTicker(ticker: Ticker) {
  tickers.add(ticker);
  if (!tickFrame) {
    lastTick = performance.now();
    tickFrame = requestAnimationFrame(runTick);
  }
  return () => {
    tickers.delete(ticker);
  };
}
