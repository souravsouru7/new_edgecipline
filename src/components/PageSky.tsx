"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { onScrollFrame, onViewportResize, requestScrollFrame } from "./motion/scroll-driver";

/**
 * Each section's own backdrop, in the order the sections take the frame.
 *
 * These are the photographs the sections used to paint themselves, and they
 * are still here — but they are layers of the one background rather than nine
 * separate opaque panels. As a section comes into the frame its backdrop
 * dissolves in over the hero's landscape and dissolves out again behind the
 * next one, so the artwork changes with the content while the background
 * itself never cuts, restarts or exposes an edge.
 *
 * `null` is a section that takes no artwork of its own: the hero, whose
 * landscape is the base layer everything else dissolves over, and the FAQ,
 * which is the quietest moment on the page by design. Index order must match
 * the panels in EdgeciplineHero.
 */
const SCENES: ReadonlyArray<{ src: string; position: string } | null> = [
  null, // 01 home — the landscape below is the hero's own
  { src: "/loop/mountains.webp", position: "center bottom" }, // 02 emotional loop
  { src: "/chart-story/mountains.webp", position: "center bottom" }, // 03 chart story
  { src: "/built-by-traders/nebula.webp", position: "center" }, // 04 built by traders
  { src: "/images/how-it-works/background-scene.webp", position: "center 72%" }, // 05 how it works
  { src: "/images/trading-dna/particle-background.webp", position: "center" }, // 06 trading DNA
  { src: "/loop/mountains.webp", position: "center 30%" }, // 07 weekly reflection
  { src: "/images/how-it-works/background-scene.webp", position: "center 58%" }, // 08 journey
  { src: "/chart-story/mountains.webp", position: "center 22%" }, // 09 pricing
  null, // 10 faq — the calm one
  { src: "/loop/mountains.webp", position: "center 72%" }, // 11 final CTA
];

/**
 * The landing page's one and only background.
 *
 * Every section used to carry its own opaque colour, its own full-bleed
 * photograph and its own veil, so scrolling the page meant crossing ten hard
 * rectangular boundaries. All of that is gone: the hero's background — the
 * deep ink gradient, `/hero/landscape.webp`, the turquoise aura and the
 * left-to-right legibility scrim — is this one fixed layer, the sections
 * above it are transparent (see app/backdrop.css), and each section's own
 * artwork is a scene that dissolves through `.page-sky-scenes` as that
 * section takes the frame.
 *
 * It is rendered as a sibling of `.site-shell`, not a child, so no clipping or
 * stacking context on the shell can ever cut into it. `position: fixed` keeps
 * it still while the document scrolls normally; nothing about the page's own
 * scrolling changes, and the layer is `pointer-events: none` throughout, so it
 * cannot swallow a click or a touch.
 *
 * Two values drive it, and neither costs a React render:
 *
 *   --sky-p    how far the document has been scrolled, 0..1, written here.
 *              backdrop.css uses it for a slow drift of the landscape — well
 *              inside the layer's own 8% overscan, so no edge is ever exposed.
 *   --stage-p  which section is in the frame, written by StageMotion, which
 *              drives the scene crossfade above.
 */
export function PageSky() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cached: the scroll handler never reads layout.
    let travel = 1;
    let last = -1;

    const measure = () => {
      travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const write = () => {
      const raw = window.scrollY / travel;
      const progress = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      // Below this the drift moves a fraction of a pixel — not worth a style
      // invalidation.
      if (Math.abs(progress - last) < 0.002) return;
      last = progress;
      el.style.setProperty("--sky-p", progress.toFixed(3));
    };

    measure();
    write();

    const remeasure = () => {
      measure();
      last = -1;
    };

    // The stage, reveals and late-loading imagery all change the document
    // height, which changes the mapping.
    const ro = new ResizeObserver(() => {
      remeasure();
      requestScrollFrame();
    });
    ro.observe(document.documentElement);

    const offScroll = onScrollFrame(write);
    const offResize = onViewportResize(remeasure);

    return () => {
      ro.disconnect();
      offScroll();
      offResize();
      el.style.removeProperty("--sky-p");
    };
  }, []);

  return (
    <div className="page-sky" ref={ref} aria-hidden="true">
      {/* The landscape and its ink gradient — the hero's background, now the
          page's, and the base every scene below dissolves over. */}
      <div className="page-sky-land" />

      {/* The sections' own artwork, cross-faded by --stage-p. */}
      <div className="page-sky-scenes">
        {SCENES.map((scene, index) =>
          scene ? (
            <div
              key={`${index}-${scene.src}`}
              className="page-sky-scene"
              style={{ "--i": index } as React.CSSProperties}
            >
              <Image
                src={scene.src}
                alt=""
                fill
                sizes="100vw"
                style={{ objectPosition: scene.position }}
              />
            </div>
          ) : null,
        )}
      </div>

      {/* The turquoise aura and the left-to-right legibility scrim the hero
          already had, stacked in one element. */}
      <div className="page-sky-air" />
      {/* Transparent through the hero, then deepens, so the content sections
          read at full contrast over the same landscape. Opacity only — one
          compositor property, no repaint. */}
      <div className="page-sky-shade" />
    </div>
  );
}
