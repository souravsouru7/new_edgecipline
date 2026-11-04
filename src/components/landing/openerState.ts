/**
 * Shared state for the homepage cinematic opener (LandingLoader).
 *
 *   pending → playing → exiting → done
 *
 * "pending" covers the moments before LandingLoader's effect runs, so anything
 * that must wait for the opener treats it as still running. The state lives at
 * module level, so it survives client-side navigation: once the opener has
 * played in this document, returning to the homepage skips it.
 *
 * Consumers:
 *   - ReferenceLanding keeps the page behind the opener `inert` until "exiting".
 *   - InteractiveTerrain defers its WebGL scene until "exiting".
 *   - TypedHeadline starts typing at "done", so the reveal shows a full line.
 */
export type OpenerPhase = "pending" | "playing" | "exiting" | "done";

let phase: OpenerPhase = "pending";
const listeners = new Set<() => void>();

export function getOpenerPhase() {
  return phase;
}

export function setOpenerPhase(next: OpenerPhase) {
  if (next === phase) return;
  phase = next;
  listeners.forEach((listener) => listener());
}

export function subscribeOpener(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True while the opener still covers the page (or is about to). */
export const openerCoversPage = (value: OpenerPhase = phase) => value === "pending" || value === "playing";

/** The server always renders the opener, so it always starts "pending". */
export const getServerOpenerPhase = (): OpenerPhase => "pending";

/**
 * Calls `callback` once the opener reaches one of `phases` (immediately if it
 * already has). Returns an unsubscribe function.
 */
export function whenOpener(phases: readonly OpenerPhase[], callback: () => void) {
  if (phases.includes(phase)) {
    callback();
    return () => {};
  }
  const unsubscribe = subscribeOpener(() => {
    if (!phases.includes(phase)) return;
    unsubscribe();
    callback();
  });
  return unsubscribe;
}
