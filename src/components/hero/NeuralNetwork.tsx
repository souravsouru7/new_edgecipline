"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "../motion/reduced-motion";
import { addTicker, onViewportResize } from "../motion/scroll-driver";

/**
 * The hero's neural network.
 *
 * A field of connected nodes with signals travelling along the links between
 * them: connections forming, a pattern being recognised. It stands for
 * behavioural pattern recognition, which is what the product does, and it is
 * deliberately not a price chart, a ticker or a candle — none of which this
 * page is selling.
 *
 * One `<canvas>`, no 3D runtime and no animation library. The whole scene is
 * a few dozen points, the lines between the near ones, and a handful of
 * pulses, which is well inside what 2D canvas draws without effort. A WebGL
 * context, a particle framework or a video would all have cost more than the
 * thing they drew.
 *
 * What keeps it off the critical path and off a slow device's main thread:
 *
 *   * It is a decorative sibling of the copy, never the LCP element. The
 *     headline paints first; this starts after mount.
 *   * Node count and device pixel ratio are chosen per device, so a phone
 *     draws roughly a third of the geometry at a lower resolution.
 *   * It shares the page's one rAF loop (`addTicker`) rather than opening a
 *     second one.
 *   * An IntersectionObserver stops the loop the moment the hero leaves the
 *     viewport, and `visibilitychange` stops it on a background tab. A
 *     settled page costs nothing: `addTicker` stops the frame loop itself
 *     once the last ticker leaves.
 *   * `prefers-reduced-motion: reduce` draws exactly one frame and never
 *     starts the loop. The composition is still there, it simply holds still.
 *
 * Nothing here is required to read the hero or use its buttons. The canvas is
 * `aria-hidden`, the CSS gradient underneath it stands in if a context cannot
 * be obtained at all, and no layout depends on it.
 */

/** Brand green and electric blue, as RGB triples for per-pulse alpha. */
const GREEN = [57, 255, 136] as const;
const BLUE = [56, 189, 248] as const;

/** Where the composition brightens. Right of centre, clear of the headline. */
const FOCUS = { x: 0.68, y: 0.42 };

type Node = {
  /** Home position in 0..1 of the canvas box. */
  hx: number;
  hy: number;
  /** Current position, in CSS pixels. */
  x: number;
  y: number;
  /** Drift phase and radius. */
  phase: number;
  speed: number;
  swing: number;
  /** 0..1, how close to the focal point; drives size and brightness. */
  weight: number;
};

type Link = { a: number; b: number; strength: number };

type Pulse = { link: number; t: number; speed: number; hue: 0 | 1 };

/** A small deterministic generator, so the layout is stable across resizes. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Scene size for this device. The node count drives everything else — links
 * are found among the nodes, pulses are a fraction of the links — so this is
 * the single knob for how much work a frame is.
 */
function sceneSize(width: number) {
  if (width < 600) return { nodes: 26, reach: 0.3, dpr: 1.5, pulses: 7 };
  if (width < 1100) return { nodes: 40, reach: 0.26, dpr: 1.75, pulses: 11 };
  return { nodes: 62, reach: 0.22, dpr: 2, pulses: 16 };
}

export function NeuralNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    // No 2D context — an ancient browser, or a blocked canvas. The CSS
    // gradient behind it is the hero visual in that case.
    if (!ctx) return;

    let nodes: Node[] = [];
    let links: Link[] = [];
    let pulses: Pulse[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    /** Lay the scene out again for the current box size. */
    const build = () => {
      const box = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(box.width));
      height = Math.max(1, Math.round(box.height));

      const size = sceneSize(width);
      dpr = Math.min(window.devicePixelRatio || 1, size.dpr);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Jittered grid rather than uniform random: random placement clumps,
      // and a clump reads as a smudge instead of a network.
      const random = rng(0x9e3779b9);
      const columns = Math.ceil(Math.sqrt(size.nodes * 1.6));
      const rows = Math.ceil(size.nodes / columns);
      nodes = [];
      for (let i = 0; i < size.nodes; i += 1) {
        const column = i % columns;
        const row = Math.floor(i / columns);
        const hx = (column + 0.5 + (random() - 0.5) * 0.85) / columns;
        const hy = (row + 0.5 + (random() - 0.5) * 0.85) / rows;
        const near = Math.hypot(hx - FOCUS.x, (hy - FOCUS.y) * 0.8);
        nodes.push({
          hx,
          hy,
          x: hx * width,
          y: hy * height,
          phase: random() * Math.PI * 2,
          speed: 0.08 + random() * 0.12,
          swing: 6 + random() * 12,
          weight: Math.max(0, 1 - near / 0.62) ** 1.6,
        });
      }

      // Links between nodes that are near each other in normalised space, so
      // the mesh does not change density with the aspect ratio.
      links = [];
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const d = Math.hypot(nodes[i].hx - nodes[j].hx, nodes[i].hy - nodes[j].hy);
          if (d > size.reach) continue;
          links.push({ a: i, b: j, strength: 1 - d / size.reach });
        }
      }

      pulses = [];
      if (links.length) {
        for (let i = 0; i < size.pulses; i += 1) {
          pulses.push({
            link: Math.floor(random() * links.length),
            t: random(),
            speed: 0.1 + random() * 0.22,
            hue: random() > 0.45 ? 1 : 0,
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Node drift. Small and slow: the mesh should breathe, not swim.
      for (const node of nodes) {
        const t = time * node.speed + node.phase;
        node.x = node.hx * width + Math.cos(t) * node.swing;
        node.y = node.hy * height + Math.sin(t * 1.3) * node.swing * 0.7;
      }

      // Links first, so the nodes sit on top of them.
      ctx.lineWidth = 1;
      for (const link of links) {
        const a = nodes[link.a];
        const b = nodes[link.b];
        const weight = (a.weight + b.weight) / 2;
        const alpha = 0.05 + link.strength * 0.1 + weight * 0.16;
        ctx.strokeStyle = `rgba(${BLUE[0]},${BLUE[1]},${BLUE[2]},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Signals travelling the mesh. Each is a short bright head with a
      // drawn-out tail, which is what makes it read as a direction of travel
      // rather than a moving dot.
      for (const pulse of pulses) {
        const link = links[pulse.link];
        if (!link) continue;
        const a = nodes[link.a];
        const b = nodes[link.b];
        const [r, g, bl] = pulse.hue ? BLUE : GREEN;
        const hx = a.x + (b.x - a.x) * pulse.t;
        const hy = a.y + (b.y - a.y) * pulse.t;
        const tail = Math.max(0, pulse.t - 0.34);
        const tx = a.x + (b.x - a.x) * tail;
        const ty = a.y + (b.y - a.y) * tail;

        const gradient = ctx.createLinearGradient(tx, ty, hx, hy);
        gradient.addColorStop(0, `rgba(${r},${g},${bl},0)`);
        gradient.addColorStop(1, `rgba(${r},${g},${bl},.62)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.fillStyle = `rgba(${r},${g},${bl},.9)`;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.lineWidth = 1;

      // Nodes. Brighter and larger towards the focal point, which is what
      // gives the scene somewhere to look without competing with the
      // headline on the other side of the composition.
      for (const node of nodes) {
        const radius = 1.1 + node.weight * 2.2;
        const breath = 0.78 + Math.sin(time * 0.6 + node.phase) * 0.22;
        const alpha = (0.2 + node.weight * 0.62) * breath;
        // The focal nodes glow; the rest are flat dots, because a shadow on
        // every node is the one thing in here expensive enough to matter.
        if (node.weight > 0.35) {
          ctx.shadowBlur = 12 * node.weight;
          ctx.shadowColor = `rgba(${GREEN[0]},${GREEN[1]},${GREEN[2]},${(0.5 * node.weight).toFixed(3)})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillStyle = `rgba(${226 - node.weight * 60},${248},${255 - node.weight * 40},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const tick = (dt: number) => {
      time += dt;
      for (const pulse of pulses) {
        pulse.t += pulse.speed * dt;
        if (pulse.t <= 1) continue;
        // Re-seed onto another link rather than looping on the same one, so
        // the traffic across the mesh keeps changing.
        pulse.t = 0;
        pulse.link = Math.floor(Math.random() * links.length);
        pulse.speed = 0.1 + Math.random() * 0.22;
      }
      draw();
    };

    build();
    draw();

    // --- running only when it is worth running -----------------------------
    let stop: (() => void) | undefined;
    let visible = false;

    const sync = () => {
      const run = visible && !document.hidden && !reduced;
      if (run && !stop) stop = addTicker(tick);
      else if (!run && stop) {
        stop();
        stop = undefined;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      // A little margin, so the scene is already moving by the time it is on
      // screen rather than starting from a standstill.
      { rootMargin: "120px" },
    );
    observer.observe(canvas);

    document.addEventListener("visibilitychange", sync);

    const offResize = onViewportResize(() => {
      build();
      draw();
    });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      offResize();
      stop?.();
    };
  }, [reduced]);

  return <canvas className="neural-canvas" ref={ref} aria-hidden="true" />;
}
