"use client";

import { useEffect, useRef } from "react";

type Variant = "core" | "grid";

/**
 * The page's two WebGL plates, drawn as green wireframe line work so they read
 * as plotter output on the paper canvas rather than as a rendered 3D object.
 *
 * `core`  the hero's orbital lattice — an icosahedral shell, three rings and a
 *         node cloud, nudged by the pointer.
 * `grid`  the closing band's horizon grid, travelling toward the camera.
 *
 * three.js is imported only once the plate is near the viewport, the loop is
 * parked whenever it leaves, and the whole scene is skipped under reduced
 * motion — the CSS underneath is the fallback in every one of those cases.
 */
export function FeatureScene({ variant, className }: { variant: Variant; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let disposed = false;
    let started = false;
    let visible = false;
    let teardown: (() => void) | undefined;
    let resume: (() => void) | undefined;
    let pause: (() => void) | undefined;

    const start = async () => {
      if (started || disposed) return;
      started = true;

      const THREE = await import("three");
      if (disposed) return;

      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

      // Read the live palette so the lines follow the light/dark toggle
      // instead of hard-coding the paper values.
      const read = (name: string, fallback: string) =>
        getComputedStyle(host).getPropertyValue(name).trim() || fallback;
      const line = new THREE.Color(read("--ftx-wire", "#27865b"));
      const node = new THREE.Color(read("--ftx-wire-2", "#171c19"));
      const paper = new THREE.Color(read("--ftx-paper", "#efeee8"));

      const disposables: { dispose(): void }[] = [];
      const keep = <T extends { dispose(): void }>(item: T) => {
        disposables.push(item);
        return item;
      };

      const root = new THREE.Group();
      scene.add(root);

      /** Per-frame work, filled in by whichever variant is being built. */
      let step: (time: number, delta: number) => void;

      if (variant === "core") {
        camera.position.set(0, 0, 8.6);

        const shellGeo = keep(new THREE.IcosahedronGeometry(1.85, 1));
        const shell = new THREE.LineSegments(
          keep(new THREE.WireframeGeometry(shellGeo)),
          keep(new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.5 })),
        );
        root.add(shell);

        const innerGeo = keep(new THREE.IcosahedronGeometry(1, 0));
        const inner = new THREE.LineSegments(
          keep(new THREE.WireframeGeometry(innerGeo)),
          keep(new THREE.LineBasicMaterial({ color: node, transparent: true, opacity: 0.3 })),
        );
        root.add(inner);

        // Three rings on different axes: a thin torus reads as a drawn orbit.
        const ringMat = keep(
          new THREE.MeshBasicMaterial({ color: line, transparent: true, opacity: 0.45 }),
        );
        const rings = [2.45, 2.75, 3.05].map((radius, index) => {
          const ring = new THREE.Mesh(
            keep(new THREE.TorusGeometry(radius, 0.006, 3, 220)),
            ringMat,
          );
          ring.rotation.set(1.1 + index * 0.5, index * 0.9, index * 0.4);
          root.add(ring);
          return ring;
        });

        // Nodes scattered on a shell just outside the rings.
        const COUNT = 140;
        const positions = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
          // Even distribution over the sphere: cosine-weighted polar angle.
          const phi = Math.acos(2 * ((i + 0.5) / COUNT) - 1);
          const theta = i * 2.399963;
          const radius = 3.2 + (i % 5) * 0.06;
          positions.set(
            [
              radius * Math.sin(phi) * Math.cos(theta),
              radius * Math.sin(phi) * Math.sin(theta),
              radius * Math.cos(phi),
            ],
            i * 3,
          );
        }
        const nodeGeo = keep(new THREE.BufferGeometry());
        nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const nodes = new THREE.Points(
          nodeGeo,
          keep(
            new THREE.PointsMaterial({
              color: node,
              size: 0.045,
              transparent: true,
              opacity: 0.45,
              sizeAttenuation: true,
            }),
          ),
        );
        root.add(nodes);

        let pointerX = 0;
        let pointerY = 0;
        let tiltX = 0;
        let tiltY = 0;

        const onPointer = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        const onLeave = () => {
          pointerX = 0;
          pointerY = 0;
        };
        host.addEventListener("pointermove", onPointer);
        host.addEventListener("pointerleave", onLeave);
        disposables.push({
          dispose: () => {
            host.removeEventListener("pointermove", onPointer);
            host.removeEventListener("pointerleave", onLeave);
          },
        });

        step = (time, delta) => {
          tiltX += (pointerY * 0.28 - tiltX) * 0.06;
          tiltY += (pointerX * 0.38 - tiltY) * 0.06;
          root.rotation.y += delta * 0.16;
          root.rotation.x = tiltX + Math.sin(time * 0.24) * 0.08;
          root.position.x = tiltY * 0.5;
          inner.rotation.y -= delta * 0.5;
          inner.rotation.z += delta * 0.22;
          const pulse = 1 + Math.sin(time * 1.1) * 0.05;
          inner.scale.setScalar(pulse);
          rings[0].rotation.z += delta * 0.2;
          rings[1].rotation.x -= delta * 0.14;
          rings[2].rotation.y += delta * 0.1;
          nodes.rotation.y -= delta * 0.05;
        };
      } else {
        // A plane seen from above and in front, travelling toward the camera.
        // Fog dissolves its far edge into the paper, so the band has no seam.
        camera.position.set(0, 13, 4.5);
        camera.lookAt(0, 0, -2.5);
        scene.fog = new THREE.Fog(paper.getHex(), 13, 30);

        const SPAN = 40;
        const DIVISIONS = 40;
        const STEP = SPAN / DIVISIONS;
        const grid = new THREE.GridHelper(SPAN, DIVISIONS);
        grid.material.dispose();
        grid.material = keep(
          new THREE.LineBasicMaterial({
            color: line,
            transparent: true,
            opacity: 0.4,
            fog: true,
          }),
        );
        disposables.push(grid.geometry);
        root.add(grid);

        // Markers hovering over the grid, kept out of the centre column so
        // they never sit behind the heading.
        const beaconGeo = keep(new THREE.WireframeGeometry(keep(new THREE.OctahedronGeometry(0.42, 0))));
        const beaconMat = keep(
          new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.7, fog: true }),
        );
        const beacons = [
          [-7.6, 1.7, -4],
          [7.9, 2.1, -5],
          [-9.2, 1.4, -11],
          [8.8, 1.9, -12.5],
        ].map(([x, y, z]) => {
          const beacon = new THREE.LineSegments(beaconGeo, beaconMat);
          beacon.position.set(x, y, z);
          beacon.userData.baseY = y;
          root.add(beacon);
          return beacon;
        });

        step = (time, delta) => {
          // Travel the grid toward the camera and wrap on one cell, so the
          // motion is continuous without ever rebuilding the geometry.
          grid.position.z = (grid.position.z + delta * 1.1) % STEP;
          beacons.forEach((beacon, index) => {
            beacon.rotation.y += delta * (0.4 + index * 0.1);
            beacon.rotation.x += delta * 0.2;
            // Offset from the stored base, never accumulated onto the
            // current value, so the bob cannot drift over time.
            beacon.position.y = beacon.userData.baseY + Math.sin(time * 0.8 + index) * 0.22;
          });
        };
      }

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();

      const observer = new ResizeObserver(resize);
      observer.observe(host);
      disposables.push({ dispose: () => observer.disconnect() });

      const clock = new THREE.Clock();
      let frame = 0;

      const loop = () => {
        frame = requestAnimationFrame(loop);
        // getDelta() first: getElapsedTime() consumes the delta internally, so
        // reading it the other way round hands every frame a delta of zero.
        const delta = Math.min(clock.getDelta(), 0.05);
        step(clock.elapsedTime, delta);
        renderer.render(scene, camera);
      };

      resume = () => {
        if (frame || disposed) return;
        clock.getDelta();
        frame = requestAnimationFrame(loop);
      };
      pause = () => {
        cancelAnimationFrame(frame);
        frame = 0;
      };

      host.dataset.ftxScene = "ready";
      if (visible) resume();

      teardown = () => {
        pause?.();
        for (const item of disposables) item.dispose();
        renderer.dispose();
        canvas.remove();
        delete host.dataset.ftxScene;
      };
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          void start();
          resume?.();
        } else {
          pause?.();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(host);

    return () => {
      disposed = true;
      io.disconnect();
      teardown?.();
    };
  }, [variant]);

  return <div ref={hostRef} className={className} aria-hidden="true" data-ftx-scene-host="" />;
}
