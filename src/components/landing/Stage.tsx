import type { ReactNode } from "react";

/**
 * The sections' shared wrapper.
 *
 * This used to be a pinned frame: all eleven sections held still in the
 * viewport and cross-faded through it, with an eleven-item progress rail
 * fixed down the right-hand edge to navigate them. Both are gone. A pinned
 * document is scroll hijacking however carefully it is built, it put a
 * crossfade between a visitor and the hero's call to action, and the rail was
 * a second permanent column of navigation competing with the navbar.
 *
 * What remains is a plain wrapper. Each section still publishes its own
 * `--mo-progress` through `StageMotion`, so every section's internal
 * scroll-linked motion works exactly as before, and `app/stage.css` gives
 * them a shared arrival. Nothing is pinned, nothing is clipped, and no
 * section waits on another.
 */
export function Stage({ children }: { children: ReactNode }) {
  return <main id="home" className="stage">{children}</main>;
}
