"use client";

import { useEffect, useRef } from "react";

import { onScrollFrame } from "../motion/scroll-driver";

/**
 * The hero planet, drawn as a rotating point cloud on a canvas.
 *
 * Replaces the 541KB `globe.webp` plus the SVG mesh that used to sit on top of
 * it: one canvas renders the dots, the graticule and the orbit rings together,
 * so the sphere actually turns instead of being a still image with an animated
 * overlay.
 *
 * Adapted rather than copied, in four ways that matter here:
 *
 *   * No animation library. The page deliberately ships none — the motion
 *     system is CSS plus a shared rAF — so this drives itself from that same
 *     shared frame.
 *   * Colours come from the brand custom properties (`--mint`, `--cyan`),
 *     read once, instead of being sniffed out of throwaway DOM nodes.
 *   * No telemetry readout. The original showed latitude, altitude and signal
 *     strength; those are invented numbers, and this product has no such data.
 *   * Dots are drawn in batched passes rather than one save/restore per dot,
 *     which is the difference between ~2,000 canvas state changes a frame and
 *     about a dozen.
 *
 * It stands down completely when off screen, while the page is scrolling, and
 * under reduced motion — the same rules every other ambient loop on the site
 * follows.
 */

type Dot = { x: number; y: number; z: number; accent: boolean; jitter: number };

/** Fibonacci sphere: even coverage without clustering at the poles. */
function makeSphere(count: number): Dot[] {
  const points: Dot[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      accent: i % 13 === 0,
      jitter: 0.6 + ((i * 37) % 10) / 16,
    });
  }
  return points;
}

/** Depth is quantised into this many alpha bands so dots can be batch-filled. */
const BANDS = 7;

const LAT_LINES = [-60, -30, 0, 30, 60];
const LON_LINES = [0, 30, 60, 90, 120, 150];

function readVar(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** "#00efb3" → "0, 239, 179" so alpha can be varied per draw. */
function toRgbTriplet(colour: string) {
  const hex = colour.replace("#", "");
  if (hex.length === 6 && /^[0-9a-f]{6}$/i.test(hex)) {
    const n = parseInt(hex, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }
  const parts = colour.match(/[\d.]+/g);
  return parts && parts.length >= 3 ? parts.slice(0, 3).join(", ") : "0, 239, 179";
}

export function GlobeCanvas() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const root = document.documentElement;
    const mint = toRgbTriplet(readVar("--mint", "#00efb3"));
    const cyan = toRgbTriplet(readVar("--cyan", "#31e6f1"));
    const silver = toRgbTriplet(readVar("--silver", "#d0dce1"));

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineQuery = window.matchMedia("(pointer: fine) and (min-width: 1024px)");

    // Half a device pixel ratio above 2 buys nothing visible and costs fill rate.
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frame = 0;
    let visible = false;
    let running = false;
    let spin = 0.7;
    let tiltTarget = 0;
    let turnTarget = 0;
    let tilt = 0;
    let turn = 0;
    let last = 0;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(200, rect.width);
      height = Math.max(200, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Fewer points on small canvases: the dots would overlap anyway.
      dots = makeSphere(width < 460 ? 460 : 820);
    };

    const draw = (spinY: number, tiltX: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.34;
      const cosY = Math.cos(spinY);
      const sinY = Math.sin(spinY);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      ctx.clearRect(0, 0, width, height);

      // Atmosphere.
      const glow = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 1.7);
      glow.addColorStop(0, `rgba(${mint}, 0.16)`);
      glow.addColorStop(0.55, `rgba(${cyan}, 0.06)`);
      glow.addColorStop(1, `rgba(${cyan}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Graticule. Back-facing segments are skipped so the sphere reads solid.
      ctx.lineWidth = 1;
      for (const lat of LAT_LINES) {
        const phi = (lat * Math.PI) / 180;
        const ring = Math.cos(phi);
        const yy = Math.sin(phi);
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 72; i += 1) {
          const lam = (i / 72) * Math.PI * 2;
          const x = ring * Math.cos(lam);
          const z = ring * Math.sin(lam);
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          const y2 = yy * cosX - z1 * sinX;
          const z2 = yy * sinX + z1 * cosX;
          if (z2 < -0.05) {
            started = false;
            continue;
          }
          const sx = cx + x1 * R;
          const sy = cy + y2 * R;
          if (started) ctx.lineTo(sx, sy);
          else {
            ctx.moveTo(sx, sy);
            started = true;
          }
        }
        ctx.strokeStyle = lat === 0 ? `rgba(${mint}, 0.42)` : `rgba(${cyan}, 0.18)`;
        ctx.stroke();
      }

      for (const lon of LON_LINES) {
        const lam = (lon * Math.PI) / 180;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= 72; i += 1) {
          const phi = -Math.PI / 2 + (i / 72) * Math.PI;
          const x = Math.cos(phi) * Math.cos(lam);
          const y = Math.sin(phi);
          const z = Math.cos(phi) * Math.sin(lam);
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;
          if (z2 < 0) {
            started = false;
            continue;
          }
          const sx = cx + x1 * R;
          const sy = cy + y2 * R;
          if (started) ctx.lineTo(sx, sy);
          else {
            ctx.moveTo(sx, sy);
            started = true;
          }
        }
        ctx.strokeStyle = `rgba(${cyan}, 0.14)`;
        ctx.stroke();
      }

      // Dots, batched by depth band. One fillStyle and one path per band
      // instead of a save/restore pair per dot.
      const scale = R / 190;
      for (let band = 0; band < BANDS; band += 1) {
        const lo = band / BANDS;
        const hi = (band + 1) / BANDS;
        const mid = (lo + hi) / 2;
        const alpha = 0.06 + Math.pow(mid, 1.8) * 0.9;

        for (const accent of [false, true]) {
          ctx.beginPath();
          let drew = false;
          for (let i = 0; i < dots.length; i += 1) {
            const d = dots[i];
            if (d.accent !== accent) continue;
            const x1 = d.x * cosY + d.z * sinY;
            const z1 = -d.x * sinY + d.z * cosY;
            const y2 = d.y * cosX - z1 * sinX;
            const z2 = d.y * sinX + z1 * cosX;
            const depth = (z2 + 1) / 2;
            if (depth < lo || depth >= hi) continue;
            const radius = Math.max(0.45, (0.7 + depth * 1.25 * d.jitter) * scale);
            const sx = cx + x1 * R;
            const sy = cy + y2 * R;
            ctx.moveTo(sx + radius, sy);
            ctx.arc(sx, sy, radius, 0, Math.PI * 2);
            drew = true;
          }
          if (!drew) continue;
          ctx.fillStyle = accent
            ? `rgba(${mint}, ${Math.min(1, alpha + 0.12).toFixed(3)})`
            : `rgba(${silver}, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // Limb.
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.004, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${cyan}, 0.3)`;
      ctx.stroke();

      // Two inertial orbit rings with a travelling marker on each.
      const rings = [
        { radius: R * 1.3, tiltR: 0.42, skew: 0.28, speed: 0.22, colour: mint },
        { radius: R * 1.14, tiltR: -0.55, skew: -0.6, speed: -0.17, colour: cyan },
      ];

      for (const ring of rings) {
        // The rings are ellipses in screen space rather than fully projected
        // circles: tilt only needs to squash the minor axis, so cos is enough.
        const cT = Math.cos(ring.tiltR);
        const cS = Math.cos(ring.skew);
        const sS = Math.sin(ring.skew);

        const point = (angle: number) => {
          let ox = Math.cos(angle) * ring.radius;
          let oy = Math.sin(angle) * ring.radius * cT;
          const rx = ox * cS - oy * sS;
          const ry = ox * sS + oy * cS;
          ox = rx;
          oy = ry;
          return { sx: cx + ox, sy: cy + oy };
        };

        ctx.beginPath();
        for (let i = 0; i <= 96; i += 1) {
          const p = point((i / 96) * Math.PI * 2);
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        }
        ctx.strokeStyle = `rgba(${ring.colour}, 0.3)`;
        ctx.stroke();

        const marker = point(spin * ring.speed * 6);
        ctx.beginPath();
        ctx.arc(marker.sx, marker.sy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ring.colour}, 0.95)`;
        ctx.fill();
      }
    };

    const render = () => draw(spin + turn, 0.38 + tilt);

    const tick = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000) || 1 / 60;
      last = now;
      spin += dt * 0.16;
      tilt += (tiltTarget - tilt) * 0.06;
      turn += (turnTarget - turn) * 0.06;
      render();
    };

    const start = () => {
      if (running || reduceQuery.matches) return;
      // Nothing ambient runs while the page is moving — the same rule the CSS
      // loops follow, and the reason scrolling stays smooth.
      if (root.hasAttribute("data-scrolling")) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    measure();
    render();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(host);

    const ro = new ResizeObserver(() => {
      measure();
      render();
    });
    ro.observe(host);

    // Resume once the scroll settles; the driver removes the attribute then.
    const offScroll = onScrollFrame(() => {
      if (root.hasAttribute("data-scrolling")) stop();
      else if (visible) start();
    });

    const onPointerMove = (event: PointerEvent) => {
      if (!fineQuery.matches) return;
      const rect = host.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      turnTarget = Math.max(-0.5, Math.min(0.5, nx * 0.4));
      tiltTarget = Math.max(-0.35, Math.min(0.35, ny * 0.28));
    };

    const onPointerLeave = () => {
      turnTarget = 0;
      tiltTarget = 0;
    };

    // Pointer tilt is desktop-only on purpose: on a touch screen the globe
    // fills much of the hero, and capturing drags there would fight the page
    // scroll.
    const hero = host.closest<HTMLElement>(".hero") ?? host;
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);

    const onReduce = () => {
      stop();
      render();
      if (!reduceQuery.matches && visible) start();
    };
    reduceQuery.addEventListener("change", onReduce);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      offScroll();
      reduceQuery.removeEventListener("change", onReduce);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="globe-canvas" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
