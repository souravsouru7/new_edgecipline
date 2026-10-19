/**
 * Prints the two @keyframes tables that drive the hero globe's rotating mesh.
 *
 * A meridian is a great circle through the poles: as the globe turns it
 * projects to an ellipse that goes from a full circle (facing us) to a vertical
 * line (edge-on) and back, which is the matrix below. A node orbits its own
 * latitude, so its screen position is a cosine across and a sine up/down — the
 * second scaled by the tilt — while its size and brightness follow its depth.
 *
 * Both tables have the tilt baked into their numbers, so rerun this whenever
 * GLOBE_TILT in src/components/hero/globe-mesh.ts changes and paste the output
 * over the matching blocks in src/app/motion.css:
 *
 *   node scripts/make-globe-keyframes.mjs
 */
const TILT_DEGREES = 18;
/** Keyframe stops per turn. 24 keeps the linear interpolation error under 1%. */
const STOPS = 24;

const tilt = (TILT_DEGREES * Math.PI) / 180;
const sinT = Math.sin(tilt);
const cosT = Math.cos(tilt);
const n = (value, places = 4) => Number(value.toFixed(places));

let meridian = "";
let node = "";

for (let step = 0; step <= STOPS; step += 1) {
  const lambda = (2 * Math.PI * step) / STOPS;
  const percent = (100 * step) / STOPS;
  const at = percent === 0 ? "0%" : percent === 100 ? "100%" : `${n(percent, 3)}%`;

  const cos = n(Math.cos(lambda));
  const sin = n(Math.sin(lambda));

  meridian += `  ${at} { transform: matrix(${cos}, ${n(Math.sin(lambda) * sinT)}, 0, ${n(-cosT)}, 0, 0); }\n`;

  // Depth runs from -1 (far side) to 1 (near side).
  const depth = Math.sin(lambda);
  const opacity = n(0.14 + 0.86 * Math.max(0, (depth + 0.25) / 1.25), 3);
  const scale = n(0.62 + 0.48 * ((depth + 1) / 2), 3);
  node +=
    `  ${at} { transform: translate(calc(var(--a) * ${cos} * 1px), ` +
    `calc(var(--b) * ${sin} * 1px)) scale(${scale}); opacity: ${opacity}; }\n`;
}

console.log(`/* tilt ${TILT_DEGREES}deg — sin ${n(sinT)}, cos ${n(cosT)} */`);
console.log(`@keyframes mo-globe-meridian {\n${meridian}}\n`);
console.log(`@keyframes mo-globe-node {\n${node}}`);
