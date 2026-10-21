import type { CSSProperties } from "react";

/**
 * Section 04's neural wave paths, taken from the supplied editable artwork
 * (4/Edgecipline_Built_By_Traders_4K/assets/08_neural_wavepaths_editable.svg)
 * and split into one coloured strand per transformation stage:
 *
 *   dim blue    -> the emotional struggles
 *   electric blue -> awareness
 *   cyber green -> growth and discipline
 *
 * The three read as a progression from unlit to lit to resolved, which is the
 * arc the section's copy describes. The struggles strand used to be purple,
 * which is not a colour this site has.
 *
 * Each strand is drawn three times: a blurred halo, a crisp core, and a dotted
 * copy whose dash offset animates, which reads as small lights travelling the
 * line without adding a single extra DOM node per particle. The portrait itself
 * is never touched or distorted — these are overlay paths behind it.
 */
const STRANDS = [
  { id: "struggles", color: "#1e6f9f", d: "M 0 60 Q 330 -35 650 85 T 1440 60" },
  { id: "awareness", color: "#38bdf8", d: "M 0 170 Q 330 75 650 195 T 1440 170" },
  { id: "growth", color: "#39ff88", d: "M 0 280 Q 330 185 650 305 T 1440 280" },
] as const;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function NeuralOverlay() {
  return (
    <svg
      className="story-neural"
      viewBox="0 0 1440 360"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="story-neural-glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {STRANDS.map((strand, index) => (
        <g
          key={strand.id}
          className="story-strand"
          data-strand={strand.id}
          style={vars({ "--i": index, "--strand": strand.color })}
        >
          <path className="story-strand__halo" d={strand.d} filter="url(#story-neural-glow)" />
          <path className="story-strand__core" d={strand.d} pathLength="1" />
          <path className="story-strand__spark" d={strand.d} />
        </g>
      ))}
    </svg>
  );
}
