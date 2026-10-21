/**
 * The intro loader.
 *
 * Deep black → the neural field wakes → it converges on the centre → the
 * emblem resolves → the wordmark and the supporting line follow → a thin
 * progress line completes → a green-blue energy ring releases outward → the
 * landing-page hero is revealed beneath it. About 4 seconds.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * IT IS A SERVER COMPONENT, AND THAT IS THE WHOLE DESIGN.
 *
 * This markup is in the HTML the server sends, so the overlay is painted on
 * the very first frame. A client-rendered loader cannot be: the hero would
 * paint first and the loader would then drop on top of it, which is the one
 * thing an intro must never do.
 *
 * Every phase is a CSS keyframe with a delay. No JavaScript sequences it, no
 * JavaScript starts it, and — this is the part that matters — no JavaScript
 * is needed to end it: the overlay's own animation finishes at `opacity: 0;
 * visibility: hidden; pointer-events: none`. If the bundle is slow, fails, or
 * never arrives at all, the loader still clears itself and the site is usable.
 * `LoaderDone` only takes the finished element out of the layer tree
 * afterwards; it is an optimisation, not a dependency.
 *
 * The page underneath is complete and rendered the entire time — real
 * headings, real copy, real links. This is an overlay, not a splash screen
 * standing in for the document, so nothing here is hidden from a crawler and
 * no content waits on an animation.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * The whole overlay is `aria-hidden`: it is decoration over content that is
 * already in the accessibility tree, it holds nothing focusable, and the
 * brand name and tagline it shows are both announced properly by the page
 * itself a moment later. Announcing them from here would only repeat them.
 */

/**
 * The neural field, in the 0–1000 viewBox the SVG uses.
 *
 * Fixed coordinates rather than anything generated: the markup is rendered on
 * the server and hydrated on the client, and the two have to agree exactly.
 * They are placed in a ring clear of the centre, so the field frames the
 * emblem instead of sitting behind it.
 */
const NODES = [
  { x: 158, y: 232 }, { x: 322, y: 138 }, { x: 512, y: 104 }, { x: 702, y: 148 },
  { x: 858, y: 246 }, { x: 912, y: 430 }, { x: 886, y: 626 }, { x: 760, y: 790 },
  { x: 566, y: 880 }, { x: 374, y: 862 }, { x: 206, y: 752 }, { x: 112, y: 574 },
  { x: 288, y: 376 }, { x: 714, y: 364 }, { x: 742, y: 612 }, { x: 274, y: 626 },
  { x: 452, y: 268 }, { x: 572, y: 744 },
];

/** Index pairs. Short hops only, so the field reads as a mesh, not a web. */
const LINKS: ReadonlyArray<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [8, 9], [9, 10], [10, 11], [11, 0], [0, 12], [12, 16], [16, 2],
  [3, 13], [13, 5], [6, 14], [14, 7], [8, 17], [17, 10], [11, 15],
  [15, 12], [13, 14], [15, 17], [16, 13],
];

export function NeuralLoader() {
  return (
    <div className="nl" aria-hidden="true">
      {/* 1. The field. One SVG, 18 nodes and 26 links — not hundreds of DOM
             nodes, and not a canvas, because a canvas would need JavaScript
             before it could draw anything at all. */}
      <svg className="nl-net" viewBox="0 0 1000 1000" focusable="false">
        <g className="nl-links">
          {LINKS.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              pathLength={1}
            />
          ))}
        </g>
        <g className="nl-nodes">
          {NODES.map((node, i) => (
            <circle
              key={`${node.x}-${node.y}`}
              cx={node.x}
              cy={node.y}
              r={i % 5 === 0 ? 5 : 3.4}
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}
        </g>
      </svg>

      {/* 2. The release. Two rings expanding out of the emblem at the end. */}
      <span className="nl-burst" />
      <span className="nl-burst nl-burst-2" />

      {/* 3. The brand. The emblem resolves first, then the wordmark — the real
             assets at their own proportions, never redrawn or distorted. */}
      {/*
        Plain <img>, deliberately, and the two eslint warnings below are the
        reason stated rather than silenced: next/image renders these through
        /_next/image, which is a second server round-trip before the overlay
        can show anything. The whole point of this component is that it paints
        on the first frame. Both files are already WebP, already the right
        size, and together weigh about 60KB; there is nothing for the
        optimizer to do except delay them.
      */}
      <div className="nl-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="nl-mark"
          src="/brand/mark.webp"
          alt=""
          width={406}
          height={600}
          decoding="sync"
          fetchPriority="high"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="nl-word"
          src="/brand/wordmark.webp"
          alt=""
          width={900}
          height={97}
          decoding="sync"
          fetchPriority="high"
        />
        <p className="nl-line">Understanding your patterns. Building your edge.</p>
      </div>

      {/* 4. The progress line. A timeline for the intro, nothing more: it is
             not wired to asset loading, so it shows no figure and claims
             nothing. */}
      <span className="nl-progress">
        <i />
      </span>
    </div>
  );
}
