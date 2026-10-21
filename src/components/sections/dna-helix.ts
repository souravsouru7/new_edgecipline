/**
 * Geometry for the Trading DNA helix.
 *
 * The supplied artwork ships both a 629KB WebP and its vector source
 * (6/Edgecipline_Trading_DNA_4K_WEBP/vectors/01_glowing_dna_helix.svg). The
 * vector turns out to be a plain parametric double helix, so it is rebuilt here
 * instead of shipping the bitmap: the strands can then be stroked on, carry a
 * travelling light, and stay crisp at any size.
 *
 * Fitted against the supplied vector, the strands are exactly
 *
 *     x = 500 ± 160 · sin(y / 126)      for y in [30, 1749]
 *
 * (max deviation 0.07 units across all 192 of its sample points), and the rungs
 * sit every 32 units from y = 35. Palette and stroke weights are the artwork's.
 */

export const HELIX_VIEWBOX = { width: 1000, height: 1800 } as const;

const CENTRE = 500;
const AMPLITUDE = 160;
/** Radians of twist per unit of y — one full turn every 2π · 126 ≈ 792 units. */
const TWIST = 1 / 126;
const Y_START = 30;
const Y_END = 1749;
/** Sampling step. At 18 the straight segments deviate under half a unit. */
const Y_STEP = 18;

const RUNG_START = 35;
const RUNG_STEP = 32;
const RUNG_COUNT = 54;

export const HELIX_COLORS = {
  strandCoreA: "url(#dna-strand-gradient)",
  strandCoreB: "#9bf6c4",
  strandGlowA: "#39ff88",
  strandGlowB: "#38bdf8",
  rung: "#7dd3fc",
} as const;

const offsetAt = (y: number) => AMPLITUDE * Math.sin(y * TWIST);

/** One strand, as an SVG path. `side` is +1 for the front strand, -1 for the back. */
function strandPath(side: 1 | -1): string {
  const points: string[] = [];
  for (let y = Y_START; y <= Y_END; y += Y_STEP) {
    points.push(`${(CENTRE + side * offsetAt(y)).toFixed(1)} ${y}`);
  }
  if ((Y_END - Y_START) % Y_STEP !== 0) {
    points.push(`${(CENTRE + side * offsetAt(Y_END)).toFixed(1)} ${Y_END}`);
  }
  return `M${points.join(" L")}`;
}

export const STRAND_FRONT = strandPath(1);
export const STRAND_BACK = strandPath(-1);

export type Rung = { y: number; x1: number; x2: number };

export const RUNGS: Rung[] = Array.from({ length: RUNG_COUNT }, (_, index) => {
  const y = RUNG_START + index * RUNG_STEP;
  const offset = offsetAt(y);
  return {
    y,
    x1: Number((CENTRE + offset).toFixed(1)),
    x2: Number((CENTRE - offset).toFixed(1)),
  };
});

/**
 * The artwork scatters 520 specks around the helix. That many nodes buys very
 * little once the section's own particle backdrop is behind it — and random
 * coordinates compress badly — so a much smaller set is generated here.
 * Deterministic, so the server and client markup always match.
 */
const PARTICLE_COLORS = ["#39ff88", "#0284c7", "#bae6fd"] as const;
const PARTICLE_COUNT = 96;

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Particle = { cx: number; cy: number; r: number; fill: string; opacity: number };

export const PARTICLES: Particle[] = (() => {
  const random = mulberry32(0x0d9a5eed);
  return Array.from({ length: PARTICLE_COUNT }, () => {
    // Two samples summed gives a triangular spread, which clusters the specks
    // around the strands the way the artwork does instead of dusting the box
    // evenly.
    const bias = random() + random() - 1;
    return {
      cx: Math.round(500 + bias * 430),
      cy: Math.round(20 + random() * 1760),
      r: 1 + Math.round(random() * 3),
      fill: PARTICLE_COLORS[Math.floor(random() * PARTICLE_COLORS.length)],
      opacity: Number((0.24 + random() * 0.48).toFixed(2)),
    };
  });
})();
