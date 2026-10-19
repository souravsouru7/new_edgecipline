import type { CSSProperties } from "react";

import {
  GLOBE_CENTRE,
  GLOBE_VIEWBOX,
  MERIDIANS,
  MESH_NODES,
  MESH_RADIUS,
  PARALLELS,
} from "./globe-mesh";

/**
 * The hero planet's rotating energy mesh — see globe-mesh.ts for the geometry.
 *
 * Static markup; every bit of the rotation is CSS (section 3 of motion.css),
 * so this stays a Server Component, costs no JavaScript on the page's largest
 * element, and switches itself off under reduced motion.
 */
const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function GlobeMesh() {
  return (
    <svg
      className="globe-mesh"
      viewBox={`0 0 ${GLOBE_VIEWBOX} ${GLOBE_VIEWBOX}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* The cage. Parallels hold still as the globe turns about its axis;
          meridians sweep from a full circle to edge-on and back. */}
      <g className="globe-cage">
        {PARALLELS.map((parallel) => (
          <ellipse
            key={parallel.cy}
            cx={GLOBE_CENTRE.x}
            cy={parallel.cy}
            rx={parallel.rx}
            ry={parallel.ry}
          />
        ))}
        {MERIDIANS.map((lon) => (
          <circle
            key={lon}
            className="globe-meridian"
            cx={GLOBE_CENTRE.x}
            cy={GLOBE_CENTRE.y}
            r={MESH_RADIUS}
            style={vars({ "--lon": lon })}
          />
        ))}
      </g>

      {/* Two lights circling the equator and a mid latitude. */}
      <g className="globe-arcs">
        <ellipse
          cx={GLOBE_CENTRE.x}
          cy={PARALLELS[2].cy}
          rx={PARALLELS[2].rx}
          ry={PARALLELS[2].ry}
          pathLength={1}
          style={vars({ "--i": 0 })}
        />
        <ellipse
          cx={GLOBE_CENTRE.x}
          cy={PARALLELS[1].cy}
          rx={PARALLELS[1].rx}
          ry={PARALLELS[1].ry}
          pathLength={1}
          style={vars({ "--i": 1 })}
        />
      </g>

      {/* The network nodes, each orbiting on its own latitude. */}
      <g className="globe-nodes">
        {MESH_NODES.map((node) => (
          <circle
            key={`${node.cy}-${node.lon}`}
            cx={GLOBE_CENTRE.x}
            cy={node.cy}
            r={node.size}
            style={vars({ "--a": node.a, "--b": node.b, "--lon": node.lon })}
          />
        ))}
      </g>
    </svg>
  );
}
