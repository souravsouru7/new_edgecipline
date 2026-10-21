import type { CSSProperties } from "react";

/**
 * The living layer around the hero planet.
 *
 * The planet itself is drawn on a canvas (GlobeCanvas); these are the CSS
 * layers around it, kept in CSS because they composite and cost no frames:
 *
 *  - `.globe-aura` is a pulsing atmospheric glow behind the planet;
 *  - `.globe-sheen` is a slow cyan/purple light sweep, masked to a circle that
 *    matches the drawn sphere so the light travels across the planet only;
 *  - `.globe-motes` are a fixed, deliberately small set of floating particles.
 *
 * Positions are hard-coded rather than random so the server and client markup
 * always match, and the count is halved on small screens from motion.css.
 */
const MOTES = [
  { x: 12, y: 24, size: 3, delay: 0, duration: 15 },
  { x: 78, y: 16, size: 2, delay: 2.4, duration: 18 },
  { x: 92, y: 52, size: 3, delay: 1.1, duration: 13 },
  { x: 34, y: 8, size: 2, delay: 3.6, duration: 20 },
  { x: 60, y: 88, size: 3, delay: 0.8, duration: 16 },
  { x: 7, y: 66, size: 2, delay: 4.2, duration: 19 },
  { x: 48, y: 42, size: 2, delay: 5.5, duration: 14 },
  { x: 84, y: 78, size: 3, delay: 1.9, duration: 17 },
  { x: 24, y: 84, size: 2, delay: 6.1, duration: 21 },
  { x: 68, y: 30, size: 2, delay: 3.1, duration: 15 },
  { x: 40, y: 70, size: 3, delay: 7.3, duration: 18 },
  { x: 96, y: 34, size: 2, delay: 2.7, duration: 16 },
] as const;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function PlanetAtmosphere() {
  return (
    <>
      <span className="globe-aura" />
      <span className="globe-sheen" />
      <span className="globe-motes">
        {MOTES.map((mote) => (
          <span
            key={`${mote.x}-${mote.y}`}
            style={vars({
              "--x": `${mote.x}%`,
              "--y": `${mote.y}%`,
              "--size": `${mote.size}px`,
              "--delay": `${mote.delay}s`,
              "--duration": `${mote.duration}s`,
            })}
          />
        ))}
      </span>
    </>
  );
}
