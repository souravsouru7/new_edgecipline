import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export { RoundedBoxGeometry };

/** The story's palette, as hex numbers for three.js. */
export const COLOR = {
  bg: 0x040706,
  green: 0x39ff88,
  deep: 0x27865b,
  red: 0xff4d5e,
  fear: 0x8b7cff,
  greed: 0xffc53d,
  fomo: 0xff8a3d,
  revenge: 0xff4d5e,
  calm: 0x39ff88,
  ink: 0xe9f2ec,
} as const;

export const CSS = {
  green: "#39ff88",
  deep: "#27865b",
  red: "#ff4d5e",
  ink: "#e9f2ec",
  muted: "#7f8f86",
  panel: "rgba(8, 18, 13, 0.92)",
} as const;

export const EMOTIONS = [
  { name: "FEAR", color: COLOR.fear },
  { name: "GREED", color: COLOR.greed },
  { name: "FOMO", color: COLOR.fomo },
  { name: "REVENGE", color: COLOR.revenge },
  { name: "CALM", color: COLOR.calm },
] as const;

/** One chapter of the world: its group, and a per-frame update. */
export type Chapter = {
  group: THREE.Group;
  /** `local` runs 0..1 while the chapter's section crosses the viewport. */
  update(local: number, time: number): void;
};

/** Collects everything that owns GPU memory so the page can release it. */
export class Bin {
  private items: { dispose(): void }[] = [];
  add<T extends { dispose(): void }>(item: T): T {
    this.items.push(item);
    return item;
  }
  dispose() {
    for (const item of this.items) item.dispose();
    this.items = [];
  }
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smoothstep of x between edges a and b. */
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Deterministic pseudo-random, so every visit builds the same world. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const scratch = {
  m: new THREE.Matrix4(),
  q: new THREE.Quaternion(),
  e: new THREE.Euler(),
  p: new THREE.Vector3(),
  s: new THREE.Vector3(),
};

/** Writes one instance's transform. */
export function place(
  mesh: THREE.InstancedMesh,
  i: number,
  x: number, y: number, z: number,
  sx: number, sy: number, sz: number,
  rx = 0, ry = 0, rz = 0,
) {
  scratch.p.set(x, y, z);
  scratch.s.set(sx, sy, sz);
  scratch.q.setFromEuler(scratch.e.set(rx, ry, rz));
  mesh.setMatrixAt(i, scratch.m.compose(scratch.p, scratch.q, scratch.s));
}

/** A canvas-drawn texture. */
export function canvasTexture(
  bin: Bin,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, width, height);
  const texture = bin.add(new THREE.CanvasTexture(canvas));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export const FONT_UI = "600 {s}px Inter, 'Segoe UI', Arial, sans-serif";
export const FONT_MONO = "700 {s}px 'Geist Mono', ui-monospace, Consolas, monospace";
export const font = (template: string, size: number) => template.replace("{s}", String(size));

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A glass panel with a glowing border, the base of every in-world card. */
export function panel(ctx: CanvasRenderingContext2D, w: number, h: number, accent: string = CSS.green) {
  ctx.clearRect(0, 0, w, h);
  roundRect(ctx, 6, 6, w - 12, h - 12, 22);
  ctx.fillStyle = CSS.panel;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

/** A camera-facing text label. Height is in world units. */
export function label(bin: Bin, text: string, color: string, height = 0.4, mono = true) {
  const size = 72;
  const pad = 24;
  const measure = document.createElement("canvas").getContext("2d");
  const fontString = font(mono ? FONT_MONO : FONT_UI, size);
  let width = text.length * size * 0.62;
  if (measure) {
    measure.font = fontString;
    width = measure.measureText(text).width;
  }
  const w = Math.ceil(width + pad * 2);
  const h = size + pad * 2;
  const map = canvasTexture(bin, w, h, (ctx) => {
    ctx.font = fontString;
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(text, pad, h / 2 + 4);
  });
  const material = bin.add(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, fog: true }));
  const sprite = new THREE.Sprite(material);
  sprite.scale.set((height * w) / h, height, 1);
  return sprite;
}

/** A soft additive glow sprite. */
export function glow(bin: Bin, color: number, size: number, opacity = 1) {
  const map = canvasTexture(bin, 128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  const material = bin.add(
    new THREE.SpriteMaterial({
      map,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const sprite = new THREE.Sprite(material);
  sprite.scale.setScalar(size);
  return sprite;
}

/**
 * The page's signature object: a refractive glass orb around a glowing core,
 * circled by two chrome rings. On light devices the glass is faked with
 * transparency instead of real transmission.
 */
export function glassOrb(bin: Bin, core: number, radius: number, lite: boolean) {
  const group = new THREE.Group();
  const shell = new THREE.Mesh(
    bin.add(new THREE.SphereGeometry(radius, 96, 64)),
    bin.add(
      new THREE.MeshPhysicalMaterial(
        lite
          ? { color: 0xdfffee, roughness: 0.05, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.22 }
          : {
              color: 0xffffff,
              roughness: 0.08,
              metalness: 0,
              transmission: 1,
              thickness: radius * 1.6,
              ior: 1.45,
              iridescence: 0.6,
              iridescenceIOR: 1.3,
              clearcoat: 1,
              attenuationColor: new THREE.Color(0xc8ffe0),
              attenuationDistance: radius * 6,
            },
      ),
    ),
  );
  const coreMat = bin.add(new THREE.MeshBasicMaterial({ color: core }));
  const coreMesh = new THREE.Mesh(bin.add(new THREE.IcosahedronGeometry(radius * 0.32, 4)), coreMat);
  const wire = new THREE.Mesh(
    bin.add(new THREE.IcosahedronGeometry(radius * 0.55, 1)),
    bin.add(new THREE.MeshBasicMaterial({ color: core, wireframe: true, transparent: true, opacity: 0.35 })),
  );
  const chrome = bin.add(new THREE.MeshStandardMaterial({ color: 0xdfe9e3, metalness: 1, roughness: 0.12 }));
  const ringA = new THREE.Mesh(bin.add(new THREE.TorusGeometry(radius * 1.35, radius * 0.018, 16, 160)), chrome);
  const ringB = new THREE.Mesh(bin.add(new THREE.TorusGeometry(radius * 1.6, radius * 0.01, 16, 160)), chrome);
  ringA.rotation.x = Math.PI / 2.4;
  ringB.rotation.set(Math.PI / 1.8, 0.4, 0);
  const halo = glow(bin, core, radius * 3.2, 0.15);
  group.add(halo, coreMesh, wire, shell, ringA, ringB);
  return {
    group,
    coreMat,
    halo,
    update(time: number, energy = 1) {
      coreMesh.scale.setScalar(0.85 + Math.sin(time * 2) * 0.08 * energy);
      wire.rotation.set(time * 0.3, time * 0.45, 0);
      ringA.rotation.z = time * 0.35;
      ringB.rotation.z = -time * 0.22;
      halo.material.opacity = 0.08 + 0.06 * energy;
    },
  };
}

/** Instanced candlesticks: a body and a wick per candle, coloured per instance. */
export function candles(bin: Bin, count: number) {
  const box = bin.add(new RoundedBoxGeometry(1, 1, 1, 2, 0.12));
  // Glossy, clear-coated bodies that still glow in their own colour: the
  // emissive term is tinted by the per-instance colour.
  const material = bin.add(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.16,
      metalness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      emissive: 0xffffff,
      emissiveIntensity: 0.32,
    }),
  );
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "vec3 totalEmissiveRadiance = emissive;",
      "vec3 totalEmissiveRadiance = emissive * diffuseColor.rgb;",
    );
  };
  const body = new THREE.InstancedMesh(box, material, count);
  const wick = new THREE.InstancedMesh(box, material, count);
  const group = new THREE.Group();
  group.add(body, wick);
  const color = new THREE.Color();
  return {
    group,
    color(i: number, hex: number, intensity = 1) {
      color.setHex(hex).multiplyScalar(intensity);
      body.setColorAt(i, color);
      wick.setColorAt(i, color.multiplyScalar(0.7));
    },
    /** Places candle i with its body centred on y. */
    set(i: number, x: number, y: number, z: number, height: number, width = 0.42, rz = 0) {
      const h = Math.max(0.0001, height);
      const w = Math.max(0.0001, width);
      place(body, i, x, y, z, w, h, w, 0, 0, rz);
      place(wick, i, x, y, z, w * 0.12, h * 1.7 + 0.25 * Math.min(1, w * 3), w * 0.12, 0, 0, rz);
    },
    commit() {
      body.instanceMatrix.needsUpdate = true;
      wick.instanceMatrix.needsUpdate = true;
      if (body.instanceColor) body.instanceColor.needsUpdate = true;
      if (wick.instanceColor) wick.instanceColor.needsUpdate = true;
    },
  };
}
