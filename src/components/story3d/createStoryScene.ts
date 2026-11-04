import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { Bin, COLOR, type Chapter, clamp01, lerp, seeded } from "./kit";
import { prologue, theBuild, theCoach, theDecision, theEdge, theGap, theLow, theMind, thePattern, theProblem } from "./chapters";

/** Distance between chapters along the camera's flight path. */
const SPACING = 36;

/**
 * Where the camera rests for each chapter, relative to the chapter's centre.
 * Looking left of centre pushes the 3D to the right half of the screen, where
 * it does not sit under the copy.
 */
const SHOTS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 1.2, 11], look: [0, 0.4, 0] },
  { pos: [0, 2.6, 11], look: [-3.2, 0, 0] },
  { pos: [0, 1.2, 7.5], look: [-2.2, 0, 0] },
  { pos: [0, 0.4, 13], look: [-4, 0, 0] },
  { pos: [0, -0.4, 15], look: [0, -0.2, 0] },
  { pos: [0, 0.4, 11.5], look: [-1.9, 0.2, 0] },
  { pos: [0, 1.4, 11], look: [-3.2, 0, 0] },
  { pos: [0, 0.2, 15], look: [-4.2, 0, 0] },
  { pos: [0, 0.6, 12.5], look: [-2.4, 0, 0] },
  { pos: [0, 4.5, 17], look: [0, 0.6, 0] },
];

export type StoryScene = {
  /** Story position: chapter i spans [i, i + 1). */
  setTarget(t: number): void;
  setPointer(x: number, y: number): void;
  resize(): void;
  start(): void;
  stop(): void;
  dispose(): void;
};

export function createStoryScene(host: HTMLElement): StoryScene {
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const lite = mobile || (navigator.hardwareConcurrency ?? 8) <= 4;
  const bin = new Bin();

  const renderer = new THREE.WebGLRenderer({ antialias: !lite, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.25 : 1.6));
  // Glass refraction renders the scene a second time; half resolution is plenty.
  renderer.transmissionResolutionScale = 0.5;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLOR.bg);
  scene.fog = new THREE.Fog(COLOR.bg, 13, 40);
  const camera = new THREE.PerspectiveCamera(mobile ? 58 : 45, 1, 0.1, 140);

  // A soft studio environment, so glass, chrome and clear-coat have something
  // to reflect. Generated in code: no HDR file to download.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  bin.add(envMap);
  pmrem.dispose();
  scene.environment = envMap;
  scene.environmentIntensity = 0.55;

  const rim = new THREE.DirectionalLight(0x9dffc9, 1.2);
  rim.position.set(-6, 8, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xbfffe0, 0.25));
  scene.add(new THREE.HemisphereLight(0x39ff88, 0x040706, 0.4));

  // A ground grid that runs under the whole journey.
  const grid = new THREE.GridHelper(420, 210, COLOR.deep, COLOR.deep);
  const gridMat = grid.material as THREE.Material;
  gridMat.transparent = true;
  gridMat.opacity = 0.22;
  grid.position.set(0, -4.2, -SPACING * 4);
  scene.add(grid);
  bin.add(grid.geometry);
  bin.add(gridMat);

  // Dust along the flight path.
  const rand = seeded(3);
  const dustCount = lite ? 900 : 2200;
  const dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dust[i * 3] = (rand() - 0.5) * 70;
    dust[i * 3 + 1] = rand() * 30 - 4;
    dust[i * 3 + 2] = 24 - rand() * (SPACING * 10 + 30);
  }
  const dustGeo = bin.add(new THREE.BufferGeometry());
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  const dustPoints = new THREE.Points(
    dustGeo,
    bin.add(new THREE.PointsMaterial({ color: 0x9fe8c0, size: 0.07, transparent: true, opacity: 0.55, depthWrite: false })),
  );
  scene.add(dustPoints);

  const options = { lite };
  const chapters: Chapter[] = [
    prologue(bin, options),
    theLow(bin, options),
    theDecision(bin),
    theProblem(bin, options),
    theGap(bin, options),
    theBuild(bin, options),
    theMind(bin),
    thePattern(bin),
    theCoach(bin, options),
    theEdge(bin, options),
  ];
  chapters.forEach((c, i) => {
    c.group.position.z = -i * SPACING;
    scene.add(c.group);
  });

  const composer = new EffectComposer(
    renderer,
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: lite ? 0 : 4 }),
  );
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), lite ? 0.6 : 0.75, 0.5, 0.3);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // Lens grade: a faint chromatic fringe toward the edges and a vignette.
  const grade = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, amount: { value: lite ? 0.0012 : 0.0022 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv;
      void main(){
        vec2 d = vUv - 0.5;
        float r = dot(d, d);
        vec2 off = d * amount * (0.4 + r * 4.0);
        vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
        c *= smoothstep(0.95, 0.18, r);
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  composer.addPass(grade);

  const shotPos = SHOTS.map((s, i) => new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2] * (mobile ? 1.3 : 1) - i * SPACING));
  const shotLook = SHOTS.map((s, i) => new THREE.Vector3(mobile ? 0 : s.look[0], s.look[1] - (mobile ? 1.8 : 0), s.look[2] - i * SPACING));
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  let target = 0;
  let current = 0;
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const clock = new THREE.Clock();
  let frame = 0;
  let running = false;

  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  const render = () => {
    frame = requestAnimationFrame(render);
    // Easing uses real elapsed time, so a slow device still keeps up with the scroll.
    const dt = Math.min(clock.getDelta(), 0.25);
    const time = clock.elapsedTime;
    current += (target - current) * (1 - Math.exp(-dt * 3.2));
    pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-dt * 2.5));
    pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-dt * 2.5));

    // The camera rests mid-section and flies between chapters.
    const c = Math.min(chapters.length - 1, Math.max(0, current - 0.5));
    const i = Math.min(chapters.length - 2, Math.floor(c));
    const f = ease(c - i);
    camPos.lerpVectors(shotPos[i], shotPos[i + 1], f);
    camPos.y += Math.sin(f * Math.PI) * 2.2;
    camPos.x += Math.sin(f * Math.PI) * (i % 2 ? -2.5 : 2.5);
    camLook.lerpVectors(shotLook[i], shotLook[i + 1], f);
    camera.position.copy(camPos).add(tmp.set(pointer.sx * 0.9, -pointer.sy * 0.5, 0));
    camera.lookAt(camLook);
    camera.rotation.z += Math.sin(f * Math.PI) * 0.04 * (i % 2 ? 1 : -1);

    chapters.forEach((ch, k) => {
      const near = current > k - 1.2 && current < k + 2.2;
      ch.group.visible = near;
      if (near) ch.update(clamp01(current - k), time);
    });
    dustPoints.rotation.y = Math.sin(time * 0.05) * 0.02;
    grid.position.z = -SPACING * 4 + ((time * 0.6) % 2);
    // A breath of extra bloom at the two emotional peaks: the crash and the payoff.
    bloom.strength = (lite ? 0.6 : 0.75) + lerp(0, 0.25, Math.max(0, 1 - Math.abs(current - 9.6) * 1.5));
    composer.render(dt);
  };

  const resize = () => {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  return {
    setTarget(t) {
      target = t;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    resize,
    start() {
      if (running) return;
      running = true;
      clock.getDelta();
      frame = requestAnimationFrame(render);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      bin.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
