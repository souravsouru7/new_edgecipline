"use client";

import { useEffect, useRef } from "react";

/** A small, lazy WebGL enhancement. The SVG underneath remains the fallback. */
export function InteractiveTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const art = canvas?.closest<HTMLElement>(".edg-hero-art");
    if (!canvas || !art || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let sceneStarted = false;
    let sceneVisible = false;
    let frame = 0;
    let cleanupScene: (() => void) | undefined;
    let resumeScene: (() => void) | undefined;

    const start = async () => {
      if (sceneStarted || reduced.matches || disposed) return;
      sceneStarted = true;

      try {
        const THREE = await import("three");
        if (disposed || reduced.matches) {
          sceneStarted = false;
          return;
        }

        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
        camera.position.set(0, 4.9, 11.8);
        camera.lookAt(0, 0.75, 0);

        const columns = 92;
        const rows = 57;
        const vertices = new Float32Array(columns * rows * 3);
        const heights = new Float32Array(columns * rows);
        const edges = new Float32Array(columns * rows);
        const hill = (x: number, z: number, cx: number, cz: number, sx: number, sz: number, height: number) =>
          height * Math.exp(-(((x - cx) / sx) ** 2 + ((z - cz) / sz) ** 2));

        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const index = row * columns + column;
            const x = (column / (columns - 1) - 0.5) * 11.6;
            const z = (row / (rows - 1) - 0.5) * 7.4;
            const height =
              hill(x, z, -2.6, -1.35, 1.5, 1.45, 2.5) +
              hill(x, z, 0.55, -2.0, 1.32, 1.25, 3.65) +
              hill(x, z, 2.75, 0.1, 1.75, 1.5, 2.15) +
              hill(x, z, -0.9, 1.55, 2.4, 1.1, 0.75) - 0.17;
            vertices.set([x, height, z], index * 3);
            heights[index] = height;
            edges[index] = Math.min(
              1,
              (1 - Math.abs(x) / 5.8) * 3.5,
              (1 - Math.abs(z) / 3.7) * 3,
            );
          }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute("aHeight", new THREE.BufferAttribute(heights, 1));
        geometry.setAttribute("aEdge", new THREE.BufferAttribute(edges, 1));
        const uniforms = {
          uTime: { value: 0 },
          uCursor: { value: new THREE.Vector2(99, 99) },
          uRippleCenter: { value: new THREE.Vector2(99, 99) },
          uRippleAge: { value: 100 },
        };
        const material = new THREE.ShaderMaterial({
          uniforms,
          transparent: true,
          depthWrite: false,
          vertexShader: `
            attribute float aHeight;
            attribute float aEdge;
            uniform float uTime;
            uniform float uRippleAge;
            uniform vec2 uCursor;
            uniform vec2 uRippleCenter;
            varying float vHeight;
            varying float vEdge;
            varying float vFocus;
            void main() {
              vec3 point = position;
              // Always-on flowing wave: two crossing travelling waves plus a
              // slow swell, so the whole field ripples continuously on its own
              // rather than only reacting to a pointer. Amplitude is kept small
              // so the hills stay readable.
              float wave =
                sin(point.x * 1.15 + uTime * 0.62) * cos(point.z * 1.35 - uTime * 0.48)
                + 0.55 * sin(point.z * 0.85 + uTime * 0.4)
                + 0.35 * sin((point.x + point.z) * 0.7 - uTime * 0.55);
              point.y += 0.2 * wave;
              float rippleDistance = distance(point.xz, uRippleCenter);
              float rippleRing = exp(-pow((rippleDistance - uRippleAge * 2.8) * 2.5, 2.0));
              point.y += rippleRing * 0.42 * exp(-uRippleAge * 0.55);
              vFocus = exp(-distance(point.xz, uCursor) * 0.78);
              vHeight = aHeight;
              vEdge = aEdge;
              vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
              gl_Position = projectionMatrix * viewPoint;
              gl_PointSize = clamp((3.2 + vFocus * 1.4) * (11.0 / -viewPoint.z), 1.4, 5.6);
            }
          `,
          fragmentShader: `
            varying float vHeight;
            varying float vEdge;
            varying float vFocus;
            void main() {
              float circle = 1.0 - smoothstep(0.22, 0.5, length(gl_PointCoord - 0.5));
              vec3 ink = vec3(0.08, 0.13, 0.11);
              vec3 green = vec3(0.10, 0.42, 0.29);
              vec3 color = mix(ink, green, smoothstep(0.18, 2.75, vHeight) * 0.9 + vFocus * 0.18);
              float fade = clamp(vEdge, 0.0, 1.0);
              gl_FragColor = vec4(color, circle * fade * (0.68 + vFocus * 0.27));
            }
          `,
        });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const resize = () => {
          const width = Math.max(1, art.clientWidth);
          const height = Math.max(1, art.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 600 ? 1.15 : 1.5));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const sizeObserver = new ResizeObserver(resize);
        sizeObserver.observe(art);
        resize();

        let pointerX = 0;
        let pointerY = 0;
        let scrollDepth = 0;
        let lastFrame = 0;
        let rippleStart = -100;
        const clock = new THREE.Clock();
        const render = (now: number) => {
          frame = 0;
          if (!sceneVisible || document.hidden || reduced.matches || disposed) return;
          const interval = art.clientWidth < 600 ? 40 : 30;
          if (now - lastFrame >= interval) {
            lastFrame = now;
            const time = clock.getElapsedTime();
            uniforms.uTime.value = time;
            uniforms.uRippleAge.value = time - rippleStart;
            camera.position.x += (pointerX * 0.4 - camera.position.x) * 0.035;
            camera.position.y += (4.9 + pointerY * 0.22 + scrollDepth * 0.3 - camera.position.y) * 0.035;
            camera.lookAt(0, 0.75, 0);
            points.rotation.y += (pointerX * 0.035 + scrollDepth * 0.035 - points.rotation.y) * 0.025;
            renderer.render(scene, camera);
          }
          frame = requestAnimationFrame(render);
        };
        const schedule = () => {
          if (sceneVisible && !document.hidden && !reduced.matches && !frame && !disposed) {
            frame = requestAnimationFrame(render);
          }
        };
        resumeScene = schedule;
        const onPointerMove = (event: PointerEvent) => {
          if (!finePointer.matches) return;
          const rect = art.getBoundingClientRect();
          pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
          pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
          uniforms.uCursor.value.set(pointerX * 5.1, pointerY * 3.1);
        };
        const onPointerLeave = () => {
          pointerX = 0;
          pointerY = 0;
          uniforms.uCursor.value.set(99, 99);
        };
        const onPointerDown = (event: PointerEvent) => {
          if ((event.target as HTMLElement).closest("a, button")) return;
          const rect = art.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width * 2 - 1;
          const y = (event.clientY - rect.top) / rect.height * 2 - 1;
          uniforms.uRippleCenter.value.set(x * 5.1, y * 3.1);
          rippleStart = clock.getElapsedTime();
        };
        const onScroll = () => {
          const rect = art.getBoundingClientRect();
          scrollDepth = Math.max(-1, Math.min(1, (window.innerHeight * 0.5 - rect.top) / window.innerHeight));
        };
        const onVisibility = () => schedule();
        const onMotionChange = () => {
          if (reduced.matches) {
            art.removeAttribute("data-edg-terrain-ready");
            cancelAnimationFrame(frame);
            frame = 0;
          } else {
            art.setAttribute("data-edg-terrain-ready", "");
            schedule();
          }
        };
        const onContextLost = (event: Event) => {
          event.preventDefault();
          art.removeAttribute("data-edg-terrain-ready");
          resumeScene = undefined;
          cancelAnimationFrame(frame);
          frame = 0;
        };

        art.addEventListener("pointermove", onPointerMove, { passive: true });
        art.addEventListener("pointerleave", onPointerLeave);
        art.addEventListener("pointerdown", onPointerDown, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);
        reduced.addEventListener("change", onMotionChange);
        canvas.addEventListener("webglcontextlost", onContextLost);
        onScroll();
        renderer.render(scene, camera);
        art.setAttribute("data-edg-terrain-ready", "");
        schedule();

        cleanupScene = () => {
          cancelAnimationFrame(frame);
          resumeScene = undefined;
          sizeObserver.disconnect();
          art.removeEventListener("pointermove", onPointerMove);
          art.removeEventListener("pointerleave", onPointerLeave);
          art.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("scroll", onScroll);
          document.removeEventListener("visibilitychange", onVisibility);
          reduced.removeEventListener("change", onMotionChange);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          art.removeAttribute("data-edg-terrain-ready");
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
        if (disposed) cleanupScene();
      } catch {
        // A blocked or unavailable WebGL context simply leaves the SVG visible.
        sceneStarted = false;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      sceneVisible = Boolean(entry?.isIntersecting);
      if (sceneVisible) {
        void start();
        resumeScene?.();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { rootMargin: "10% 0px 10% 0px" });
    observer.observe(art);
    const onInitialMotionChange = () => {
      if (!reduced.matches && sceneVisible) void start();
    };
    reduced.addEventListener("change", onInitialMotionChange);

    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener("change", onInitialMotionChange);
      cancelAnimationFrame(frame);
      cleanupScene?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="edg-terrain-canvas" aria-hidden="true" />;
}
