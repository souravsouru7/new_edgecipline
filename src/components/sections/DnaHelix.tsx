import type { CSSProperties } from "react";

import {
  HELIX_COLORS,
  HELIX_VIEWBOX,
  PARTICLES,
  RUNGS,
  STRAND_BACK,
  STRAND_FRONT,
} from "./dna-helix";

/**
 * The glowing double helix, drawn as real SVG from the supplied vector artwork
 * (see dna-helix.ts). Every strand is stroked twice — a wide translucent copy
 * for the halo and a crisp copy on top — which gives the artwork's glow without
 * a Gaussian blur filter that would have to be re-rasterised on every frame of
 * the breathe animation.
 *
 * A Server Component: static markup, with all motion in motion.css.
 */
const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function DnaHelix() {
  return (
    <svg
      className="dnaHelixArt"
      viewBox={`0 0 ${HELIX_VIEWBOX.width} ${HELIX_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="dna-helix-title"
      focusable="false"
    >
      <title id="dna-helix-title">
        Glowing DNA helix representing trading behavior patterns.
      </title>

      <defs>
        <linearGradient id="dna-strand-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#39ff88" />
          <stop offset=".52" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      <g className="dnaParticles" aria-hidden="true">
        {PARTICLES.map((particle, index) => (
          <circle
            key={`${particle.cx}-${particle.cy}-${index}`}
            cx={particle.cx}
            cy={particle.cy}
            r={particle.r}
            fill={particle.fill}
            opacity={particle.opacity}
          />
        ))}
      </g>

      {/* Halo copies first, so the crisp strands and rungs sit on top of them. */}
      <g className="dnaGlow" aria-hidden="true">
        <path d={STRAND_FRONT} fill="none" stroke={HELIX_COLORS.strandGlowA} strokeWidth="24" opacity=".3" />
        <path d={STRAND_BACK} fill="none" stroke={HELIX_COLORS.strandGlowB} strokeWidth="25" opacity=".34" />
      </g>

      <g className="dnaRungs" aria-hidden="true">
        {RUNGS.map((rung, index) => (
          <line
            key={rung.y}
            x1={rung.x1}
            y1={rung.y}
            x2={rung.x2}
            y2={rung.y}
            stroke={HELIX_COLORS.rung}
            strokeWidth="5"
            opacity=".54"
            style={vars({ "--i": index })}
          />
        ))}
      </g>

      <g className="dnaStrands" aria-hidden="true">
        <path
          className="dnaStrand"
          d={STRAND_BACK}
          pathLength={1}
          fill="none"
          stroke={HELIX_COLORS.strandCoreB}
          strokeWidth="10"
          style={vars({ "--i": 0 })}
        />
        <path
          className="dnaStrand"
          d={STRAND_FRONT}
          pathLength={1}
          fill="none"
          stroke={HELIX_COLORS.strandCoreA}
          strokeWidth="11"
          style={vars({ "--i": 1 })}
        />
      </g>

      {/* The light that keeps travelling down each strand. */}
      <g className="dnaSparks" aria-hidden="true">
        <path className="dnaSpark" d={STRAND_BACK} pathLength={1} fill="none" style={vars({ "--i": 0 })} />
        <path className="dnaSpark" d={STRAND_FRONT} pathLength={1} fill="none" style={vars({ "--i": 1 })} />
      </g>
    </svg>
  );
}
