/**
 * Geometry for the hero globe's rotating energy mesh.
 *
 * `globe.webp` is a flat front-view render, so the planet itself cannot turn.
 * What this adds is the layer that *can*: a spherical graticule and a field of
 * network nodes, orthographically projected and rotating about the planet's
 * axis, blended over the artwork with `screen`. The bright, moving elements are
 * the ones the eye tracks, so the globe reads as rotating while the artwork
 * underneath stays exactly as it was.
 *
 * The sphere's circle was measured off the artwork itself (a circle fit to its
 * limb, within half a percent): centre 840,835 and radius 660 in the asset's
 * own 1600 x 1600 box.
 */

export const GLOBE_VIEWBOX = 1600;
export const GLOBE_CENTRE = { x: 840, y: 835 } as const;
export const GLOBE_RADIUS = 660;

/**
 * How far the mesh sits inside the limb. The outer few percent of the artwork
 * is atmosphere glow, not surface, so the mesh stops short of it.
 */
export const MESH_RADIUS = Math.round(GLOBE_RADIUS * 0.955);

/**
 * Tilt of the pole towards the viewer, in degrees — the globe is seen slightly
 * from above, as in the artwork.
 *
 * IMPORTANT: the `mo-globe-meridian` and `mo-globe-node` keyframes in motion.css
 * have this baked into their numbers. Change it here and those tables have to be
 * regenerated (see docs/MOTION.md).
 */
export const GLOBE_TILT = 18;

const RAD = Math.PI / 180;
const SIN_T = Math.sin(GLOBE_TILT * RAD);
const COS_T = Math.cos(GLOBE_TILT * RAD);

/**
 * Meridians. Each is drawn as a circle centred on the sphere and squashed by an
 * animated matrix, which is exactly how a great circle through the poles
 * projects as the globe turns: full circle when it faces us, a vertical line
 * when it is edge-on. A meridian covers both sides of the sphere, so eight of
 * them span the full 360°.
 */
export const MERIDIANS = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5];

export type Parallel = { cy: number; rx: number; ry: number };

/**
 * Parallels do not change shape as the globe spins about its own axis, so these
 * are plain static ellipses.
 */
export const PARALLELS: Parallel[] = [-55, -30, 0, 30, 55].map((deg) => {
  const phi = deg * RAD;
  return {
    cy: Number((GLOBE_CENTRE.y - MESH_RADIUS * Math.sin(phi) * COS_T).toFixed(1)),
    rx: Number((MESH_RADIUS * Math.cos(phi)).toFixed(1)),
    ry: Number((MESH_RADIUS * Math.cos(phi) * SIN_T).toFixed(1)),
  };
});

/** Latitude / longitude pairs for the network nodes, with a size in viewBox units. */
const NODE_SEEDS: ReadonlyArray<[lat: number, lon: number, size: number]> = [
  [52, 10, 9], [46, 140, 7], [38, 65, 13], [34, 215, 9], [30, 300, 11],
  [22, 25, 8], [18, 170, 13], [12, 95, 7], [8, 250, 11], [4, 330, 9],
  [0, 50, 13], [-6, 200, 9], [-10, 125, 11], [-16, 285, 7], [-22, 15, 11],
  [-28, 240, 9], [-34, 80, 12], [-40, 160, 7], [-46, 320, 9], [-52, 45, 10],
  [26, 195, 8], [-14, 355, 9],
];

export type MeshNode = {
  /** Base position: x is the sphere centre, y is fixed by the node's latitude. */
  cy: number;
  /** Horizontal swing, in viewBox units. */
  a: number;
  /** Vertical swing — the same orbit seen under the tilt. */
  b: number;
  /** Longitude, which becomes the animation's phase. */
  lon: number;
  size: number;
};

export const MESH_NODES: MeshNode[] = NODE_SEEDS.map(([lat, lon, size]) => {
  const phi = lat * RAD;
  const swing = MESH_RADIUS * Math.cos(phi);
  return {
    cy: Number((GLOBE_CENTRE.y - MESH_RADIUS * Math.sin(phi) * COS_T).toFixed(1)),
    a: Number(swing.toFixed(1)),
    b: Number((swing * SIN_T).toFixed(1)),
    lon,
    size,
  };
});
