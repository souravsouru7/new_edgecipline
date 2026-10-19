/**
 * The glowing journey line for Section 07.
 *
 * The curve is generated through fixed waypoints rather than hand-written, so
 * the four milestones are guaranteed to sit exactly on it: the milestone points
 * below are both the spline's knots and the positions the markup uses to place
 * the pins. Everything lives in one 1200 x 260 box; the markup positions the
 * pins as percentages of it, so the line and the pins stay locked together at
 * any width.
 */

export const JOURNEY_BOX = { width: 1200, height: 260 } as const;

/** How far above the line each pin floats, in box units. */
export const PIN_RISE = 50;

type Point = { x: number; y: number };

/** Knots: the two outer ones run the line off the edges of the section. */
const KNOTS: Point[] = [
  { x: -60, y: 198 },
  { x: 56, y: 190 }, // Awareness
  { x: 200, y: 214 },
  { x: 348, y: 178 }, // Better Habits
  { x: 520, y: 150 },
  { x: 672, y: 138 }, // More Discipline
  { x: 850, y: 172 },
  { x: 1008, y: 150 }, // A Stronger You
  { x: 1260, y: 104 },
];

/** Indices of the knots that carry a milestone. */
const MILESTONE_KNOTS = [1, 3, 5, 7];

/** Catmull-Rom through the knots, written out as cubic Béziers. */
function spline(points: Point[]): string {
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export const JOURNEY_LINE = spline(KNOTS);

export type MilestonePlacement = {
  /** Percentage positions for the pin and for its dot on the line. */
  left: string;
  pinTop: string;
  dotTop: string;
  /** Height of the stem between the two, as a percentage of the box. */
  stem: string;
};

export const MILESTONE_PLACEMENTS: MilestonePlacement[] = MILESTONE_KNOTS.map((index) => {
  const knot = KNOTS[index];
  return {
    left: `${((knot.x / JOURNEY_BOX.width) * 100).toFixed(3)}%`,
    pinTop: `${(((knot.y - PIN_RISE) / JOURNEY_BOX.height) * 100).toFixed(3)}%`,
    dotTop: `${((knot.y / JOURNEY_BOX.height) * 100).toFixed(3)}%`,
    stem: `${((PIN_RISE / JOURNEY_BOX.height) * 100).toFixed(3)}%`,
  };
});

/** The milestone knots in box coordinates, for the stems and dots drawn in the SVG. */
export const MILESTONE_POINTS: Point[] = MILESTONE_KNOTS.map((index) => KNOTS[index]);

/** Where along the line each milestone sits, 0..1 — used to time its reveal. */
export const MILESTONE_PROGRESS = MILESTONE_KNOTS.map((index) =>
  Number(((KNOTS[index].x - KNOTS[0].x) / (KNOTS[KNOTS.length - 1].x - KNOTS[0].x)).toFixed(3)),
);
