"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];
type Dot = { x: number; y: number };

type Particle = {
  sx: number;
  speed: number;
  offset: number;
  phase: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  cx: number;
  cy: number;
  secondLine: boolean;
  finalSecondLine: boolean;
  finalGreen: boolean;
  radiusA: number;
  radiusB: number;
  radiusC: number;
  delay: number;
  fraction: number;
  arcA: number;
  arcB: number;
  triggerA: number;
  triggerB: number;
};

const TIMELINE = {
  form: 700,
  sweepStart: 1400,
  sweepEnd: 2400,
  changeStart: 2900,
  changeEnd: 3600,
  hold: 4200,
  burst: 700,
} as const;

const CENTER_Y = 0.46;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

function hexToRgb(value: string): RGB {
  const hex = value.replace("#", "");
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function mix(from: RGB, to: RGB, amount: number) {
  return `rgb(${Math.trunc(from[0] + (to[0] - from[0]) * amount)},${Math.trunc(
    from[1] + (to[1] - from[1]) * amount,
  )},${Math.trunc(from[2] + (to[2] - from[2]) * amount)})`;
}

function shuffle<T>(items: T[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

/** The supplied Emotion-to-Discipline canvas opener, adapted for the homepage. */
export function LandingLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const status = statusRef.current;
    const skipButton = skipRef.current;
    const context = canvas?.getContext("2d");

    if (!overlay || !canvas || !status || !skipButton || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = {
      ink: hexToRgb("#111111"),
      green: hexToRgb("#12a150"),
      red: hexToRgb("#e5484d"),
    };
    const pointer = { x: -999, y: -999 };
    const timers: number[] = [];
    const dotoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-doto").trim() ||
      '"Courier New"';
    const font = (size: number) => `800 ${size}px ${dotoFamily}, "Courier New", monospace`;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let animationFrame = 0;
    let startedAt = 0;
    let burstAt = 0;
    let ready = document.readyState === "complete";
    let done = false;
    let disposed = false;
    let lastStatus = "";
    let wordmarkWidth = 0;
    let underlineY = 0;

    const measure = (text: string, size: number) => {
      const measureCanvas = document.createElement("canvas");
      const measureContext = measureCanvas.getContext("2d");
      if (!measureContext) return text.length * size * 0.6;
      measureContext.font = font(size);
      return Math.ceil(measureContext.measureText(text).width);
    };

    const drawText = (
      target: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      size: number,
    ) => {
      target.font = font(size);
      target.lineJoin = "round";
      target.lineWidth = size * 0.09;
      target.strokeStyle = "#000";
      target.strokeText(text, x, y);
      target.fillText(text, x, y);
    };

    const sample = (
      sampleWidth: number,
      sampleHeight: number,
      draw: (target: CanvasRenderingContext2D) => void,
      step: number,
    ) => {
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = sampleHeight;
      const sampleContext = sampleCanvas.getContext("2d");
      const output: Dot[] = [];
      if (!sampleContext) return output;

      sampleContext.textBaseline = "middle";
      sampleContext.fillStyle = "#000";
      draw(sampleContext);
      const data = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
      for (let y = 0; y < sampleHeight; y += step) {
        for (let x = 0; x < sampleWidth; x += step) {
          if (data[(Math.trunc(y) * sampleWidth + Math.trunc(x)) * 4 + 3] > 110) {
            output.push({ x, y });
          }
        }
      }
      return output;
    };

    const chartY = (x: number, elapsed: number) => {
      const time = elapsed * 0.001;
      return (
        height * CENTER_Y +
        (Math.sin(x * 0.012 + time * 2.1) * 0.5 +
          Math.sin(x * 0.029 - time * 3.3) * 0.3 +
          Math.sin(x * 0.067 + time * 5.1) * 0.2) *
          height *
          0.2
      );
    };

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const emotionSize = Math.min(width * 0.92 / (measure("EMOTION", 100) / 100), height * 0.3);
      const emotionWidth = measure("EMOTION", emotionSize) + Math.ceil(emotionSize * 0.1);
      const emotionHeight = Math.ceil(emotionSize * 1.2);
      const emotionStep = Math.max(1.8, emotionSize / 34);
      const emotionDots = sample(
        emotionWidth,
        emotionHeight,
        (target) => drawText(target, "EMOTION", emotionSize * 0.05, emotionHeight / 2, emotionSize),
        emotionStep,
      );
      const emotionX = (width - emotionWidth) / 2;
      const emotionY = height * CENTER_Y - emotionHeight / 2;

      const disciplineSize = Math.min(
        width * 0.94 / (measure("DISCIPLINE", 100) / 100),
        height * 0.2,
      );
      const disciplineTextWidth = measure("DISCIPLINE", disciplineSize);
      const sublineSize = disciplineSize * 0.52;
      const sublineWidth = measure("OVER EMOTION", sublineSize);
      const disciplineGap = disciplineSize * 0.18;
      const disciplineLineHeight = Math.ceil(disciplineSize * 1.1);
      const disciplineHeight = Math.ceil(disciplineLineHeight + disciplineGap + sublineSize * 1.2);
      const disciplineWidth = disciplineTextWidth + Math.ceil(disciplineSize * 0.1);
      const disciplineStep = Math.max(1.8, disciplineSize / 34);
      const disciplineDots = sample(
        disciplineWidth,
        disciplineHeight,
        (target) => {
          drawText(target, "DISCIPLINE", disciplineSize * 0.05, disciplineLineHeight / 2, disciplineSize);
          drawText(
            target,
            "OVER EMOTION",
            (disciplineWidth - sublineWidth) / 2,
            disciplineLineHeight + disciplineGap + sublineSize * 0.6,
            sublineSize,
          );
        },
        disciplineStep,
      );
      const disciplineX = (width - disciplineWidth) / 2;
      const disciplineY = height * CENTER_Y - disciplineHeight / 2;
      const disciplineSplit = disciplineLineHeight + disciplineGap / 2;

      const brandSize = Math.min(width * 0.94 / (measure("EDGECIPLINE", 100) / 100), height * 0.2);
      const brandWidth = measure("EDGECIPLINE", brandSize) + Math.ceil(brandSize * 0.1);
      const taglineSize = brandSize * 0.42;
      const taglineWidth = measure("DISCIPLINE OVER EMOTION", taglineSize);
      const brandGap = brandSize * 0.26;
      const brandLineHeight = Math.ceil(brandSize * 1.1);
      const brandHeight = Math.ceil(brandLineHeight + brandGap + taglineSize * 1.2);
      const brandStep = Math.max(1.8, brandSize / 34);
      const edgeWidth = measure("EDGE", brandSize) + brandSize * 0.05;
      const brandDots = sample(
        brandWidth,
        brandHeight,
        (target) => {
          drawText(target, "EDGECIPLINE", brandSize * 0.05, brandLineHeight / 2, brandSize);
          drawText(
            target,
            "DISCIPLINE OVER EMOTION",
            (brandWidth - taglineWidth) / 2,
            brandLineHeight + brandGap + taglineSize * 0.6,
            taglineSize,
          );
        },
        brandStep,
      );
      const brandX = (width - brandWidth) / 2;
      const brandY = height * CENTER_Y - brandHeight / 2;
      const brandSplit = brandLineHeight + brandGap / 2;
      wordmarkWidth = brandWidth;
      underlineY = brandY + brandLineHeight + brandGap * 0.5;

      shuffle(emotionDots);
      shuffle(disciplineDots);
      shuffle(brandDots);
      if (!emotionDots.length || !disciplineDots.length || !brandDots.length) return;

      const particleCount = Math.max(emotionDots.length, disciplineDots.length, brandDots.length);
      const span = width * 1.1;
      particles = [];

      for (let index = 0; index < particleCount; index += 1) {
        const emotion = emotionDots[index] ?? emotionDots[Math.floor(Math.random() * emotionDots.length)];
        const discipline =
          disciplineDots[index] ?? disciplineDots[Math.floor(Math.random() * disciplineDots.length)];
        const brand = brandDots[index] ?? brandDots[Math.floor(Math.random() * brandDots.length)];
        const ax = emotionX + emotion.x;
        const ay = emotionY + emotion.y;
        const bx = disciplineX + discipline.x;
        const by = disciplineY + discipline.y;

        particles.push({
          sx: Math.random() * width,
          speed: 0.06 + Math.random() * 0.12,
          offset: (Math.random() - 0.5) * 70,
          phase: Math.random() * Math.PI * 2,
          ax,
          ay,
          bx,
          by,
          cx: brandX + brand.x,
          cy: brandY + brand.y,
          secondLine: discipline.y > disciplineSplit,
          finalSecondLine: brand.y > brandSplit,
          finalGreen: brand.x >= edgeWidth,
          radiusA: emotionStep * 0.62,
          radiusB: disciplineStep * 0.62,
          radiusC: brandStep * 0.62,
          delay: Math.random() * 0.7,
          fraction: ax / width,
          arcA: (Math.random() - 0.5) * 120,
          arcB: (Math.random() - 0.5) * 120,
          triggerA:
            TIMELINE.sweepStart +
            ((ax + width * 0.05) / span) * (TIMELINE.sweepEnd - TIMELINE.sweepStart),
          triggerB:
            TIMELINE.changeStart +
            (by / height) * (TIMELINE.changeEnd - TIMELINE.changeStart),
        });
      }
    };

    const finish = () => {
      if (done) return;
      done = true;
      window.cancelAnimationFrame(animationFrame);
      overlay.hidden = true;
      document.body.classList.remove("edg-loader-active");
    };

    const frame = (now: number) => {
      if (done || disposed) return;
      if (!burstAt && now - startedAt >= TIMELINE.hold && (ready || now - startedAt > 12000)) {
        burstAt = now;
        timers.push(
          window.setTimeout(() => overlay.classList.add("is-background-out"), 300),
          window.setTimeout(() => overlay.classList.add("is-out"), TIMELINE.burst - 200),
          window.setTimeout(finish, TIMELINE.burst + 120),
        );
      }

      const elapsed = burstAt ? TIMELINE.hold : Math.min(now - startedAt, TIMELINE.hold);
      const burstProgress = burstAt ? clamp((now - burstAt) / TIMELINE.burst) : 0;
      context.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height * CENTER_Y;
      const gridSize = Math.round(Math.max(20, Math.min(34, Math.min(width, height) / 16)));
      const sweepX =
        -width * 0.05 +
        clamp((elapsed - TIMELINE.sweepStart) / (TIMELINE.sweepEnd - TIMELINE.sweepStart)) *
          width *
          1.1;

      for (let gridX = (width % gridSize) / 2; gridX < width; gridX += gridSize) {
        for (let gridY = (height % gridSize) / 2; gridY < height; gridY += gridSize) {
          const lit = !reducedMotion && elapsed > TIMELINE.sweepStart && gridX < sweepX;
          context.globalAlpha = (lit ? 0.3 : 0.13) * (1 - burstProgress);
          context.fillStyle = mix(lit ? palette.green : palette.ink, palette.ink, 0);
          context.beginPath();
          context.arc(gridX, gridY, 1.5, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (
        !reducedMotion &&
        elapsed > TIMELINE.sweepStart - 50 &&
        elapsed < TIMELINE.sweepEnd + 350 &&
        !burstProgress
      ) {
        const fade = 1 - clamp((elapsed - TIMELINE.sweepEnd) / 350);
        const green = mix(palette.green, palette.green, 0).replace("rgb", "rgba").replace(")", ",");
        const gradient = context.createLinearGradient(sweepX - 220, 0, sweepX, 0);
        gradient.addColorStop(0, `${green}0)`);
        gradient.addColorStop(1, `${green}${0.3 * fade})`);
        context.globalAlpha = 1;
        context.fillStyle = gradient;
        context.fillRect(sweepX - 220, 0, 220, height);
        context.globalAlpha = fade;
        context.fillStyle = mix(palette.green, palette.green, 0);
        context.fillRect(sweepX - 2, 0, 4, height);
      }

      if (
        !reducedMotion &&
        elapsed > TIMELINE.changeStart - 50 &&
        elapsed < TIMELINE.changeEnd + 300 &&
        !burstProgress
      ) {
        const sweepY =
          clamp((elapsed - TIMELINE.changeStart) / (TIMELINE.changeEnd - TIMELINE.changeStart)) *
          height;
        context.globalAlpha = 1 - clamp((elapsed - TIMELINE.changeEnd) / 300);
        context.fillStyle = mix(palette.green, palette.green, 0);
        context.fillRect(0, sweepY - 2, width, 4);
      }

      if (!reducedMotion && !burstProgress) {
        [TIMELINE.sweepEnd, TIMELINE.changeEnd].forEach((trigger) => {
          const ripple = (elapsed - trigger) / 1000;
          if (ripple > 0 && ripple < 1) {
            context.globalAlpha = (1 - ripple) * 0.6;
            context.strokeStyle = mix(palette.green, palette.green, 0);
            context.lineWidth = 3;
            context.beginPath();
            context.arc(centerX, centerY, ripple * Math.max(width, height) * 0.75, 0, Math.PI * 2);
            context.stroke();
          }
        });
      }

      const pointerRadius = Math.min(width, height) * 0.14;
      particles.forEach((particle) => {
        let x: number;
        let y: number;
        let radius: number;
        let color: string;
        let alpha = 1;

        if (reducedMotion) {
          x = particle.cx;
          y = particle.cy;
          radius = particle.radiusC;
          color = mix(
            particle.finalSecondLine || !particle.finalGreen ? palette.ink : palette.green,
            palette.ink,
            0,
          );
        } else {
          const form = clamp((elapsed - TIMELINE.form - particle.delay * 700) / 800);
          const ease = 1 - Math.pow(1 - form, 3);
          const morphA = clamp((elapsed - particle.triggerA) / 650);
          const morphB = clamp((elapsed - particle.triggerB) / 700);
          const chartX = (particle.sx + elapsed * particle.speed) % width;
          const chart =
            chartY(chartX, elapsed) +
            particle.offset * (1 + 0.5 * Math.sin(elapsed * 0.004 + particle.phase));
          const jitter = morphA >= 1 ? 0 : (1 - morphA) * (form >= 1 ? 5 : 0);
          x = chartX + (particle.ax - chartX) * ease + (Math.random() - 0.5) * jitter;
          y = chart + (particle.ay - chart) * ease + (Math.random() - 0.5) * jitter;
          radius = particle.radiusA * (0.7 + 0.3 * ease);
          color = mix(palette.red, palette.red, 0);
          alpha = clamp(elapsed / 400) * (0.5 + 0.5 * ease);

          const overshoot = 1.70158;
          const overshootPlusOne = overshoot + 1;
          if (morphA > 0) {
            const backEase =
              1 +
              overshootPlusOne * Math.pow(morphA - 1, 3) +
              overshoot * Math.pow(morphA - 1, 2);
            x = particle.ax + (particle.bx - particle.ax) * backEase;
            y =
              particle.ay +
              (particle.by - particle.ay) * backEase -
              Math.sin(Math.PI * morphA) * particle.arcA;
            radius =
              (particle.radiusA + (particle.radiusB - particle.radiusA) * morphA) *
              (1 + 0.9 * Math.sin(Math.PI * morphA));
            color = mix(palette.red, particle.secondLine ? palette.ink : palette.green, morphA);
            alpha = 1;
          }

          if (morphB > 0) {
            const backEase =
              1 +
              overshootPlusOne * Math.pow(morphB - 1, 3) +
              overshoot * Math.pow(morphB - 1, 2);
            x = particle.bx + (particle.cx - particle.bx) * backEase;
            y =
              particle.by +
              (particle.cy - particle.by) * backEase -
              Math.sin(Math.PI * morphB) * particle.arcB;
            radius =
              (particle.radiusB + (particle.radiusC - particle.radiusB) * morphB) *
              (1 + 0.9 * Math.sin(Math.PI * morphB));
            color = mix(
              particle.secondLine ? palette.ink : palette.green,
              particle.finalSecondLine || !particle.finalGreen ? palette.ink : palette.green,
              morphB,
            );
          } else if (morphA >= 1 && elapsed > TIMELINE.sweepEnd) {
            y += Math.sin(now / 300 + particle.fraction * 20) * 0.4;
          }

          if (burstProgress > 0) {
            alpha *= 1 - burstProgress;
            radius *= 1 - 0.6 * burstProgress;
            x += (Math.random() - 0.5) * burstProgress * 8;
            y += (Math.random() - 0.5) * burstProgress * 8;
          } else if (pointer.x > -900) {
            const deltaX = x - pointer.x;
            const deltaY = y - pointer.y;
            const distance = Math.hypot(deltaX, deltaY);
            if (distance < pointerRadius && distance > 0) {
              const force = Math.pow(1 - distance / pointerRadius, 2) * pointerRadius * 0.7;
              x += (deltaX / distance) * force;
              y += (deltaY / distance) * force;
            }
          }
        }

        context.globalAlpha = alpha;
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotion && elapsed >= TIMELINE.changeEnd - 100 && burstProgress < 0.35) {
        const underlineProgress = clamp((elapsed - TIMELINE.changeEnd + 100) / 600);
        context.globalAlpha = 1 - burstProgress / 0.35;
        context.fillStyle = mix(palette.green, palette.green, 0);
        context.fillRect(
          centerX - (wordmarkWidth / 2) * underlineProgress,
          underlineY - 1.5,
          wordmarkWidth * underlineProgress,
          3,
        );
      }

      const nextStatus = burstAt
        ? "Discipline over emotion."
        : elapsed >= TIMELINE.hold && !ready
          ? "Loading…"
          : elapsed < TIMELINE.sweepStart
            ? "Emotion detected…"
            : elapsed < TIMELINE.changeStart
              ? "Applying discipline…"
              : "Discipline over emotion.";
      if (nextStatus !== lastStatus) {
        status.textContent = nextStatus;
        status.className = `edg-loader__status ${
          elapsed < TIMELINE.sweepStart && !burstAt ? "is-hot" : "is-cool"
        }`;
        lastStatus = nextStatus;
      }

      animationFrame = window.requestAnimationFrame(frame);
    };

    const skip = () => {
      overlay.classList.add("is-out");
      timers.push(window.setTimeout(finish, 320));
    };
    const handleResize = () => {
      if (!done && particles.length) build();
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const clearPointer = () => {
      pointer.x = -999;
      pointer.y = -999;
    };
    const markReady = () => {
      ready = true;
    };

    const start = async () => {
      document.body.classList.add("edg-loader-active");
      // Also clear the pre-paint overflow:hidden set by the inline script in
      // layout.tsx (which locked scroll before React mounted) — the class above
      // now owns overflow:hidden so the inline style is no longer needed.
      document.body.style.overflow = "";
      timers.push(window.setTimeout(() => skipButton.classList.add("is-visible"), 1000));
      try {
        await Promise.race([
          Promise.all([
            document.fonts.load(font(100), "EDGECIPLINE"),
            document.fonts.load("500 14px Inter, sans-serif"),
          ]),
          new Promise((resolve) => timers.push(window.setTimeout(resolve, 800))),
        ]);
      } catch {
        // Canvas uses the declared fallback if a web font cannot load.
      }
      if (disposed) return;
      // Defer the heavy pixel-sampling work (build creates 3 offscreen canvases
      // and reads pixel data) to the next animation frame so the browser can
      // paint the loader background first — eliminating the visible freeze.
      window.requestAnimationFrame(() => {
        if (disposed) return;
        build();
        startedAt = performance.now();
        if (reducedMotion) {
          status.textContent = "Discipline over emotion.";
          status.className = "edg-loader__status is-cool";
          timers.push(window.setTimeout(() => overlay.classList.add("is-out"), 650));
          timers.push(window.setTimeout(finish, 950));
        }
        animationFrame = window.requestAnimationFrame(frame);
      });
    };

    if (!ready) window.addEventListener("load", markReady, { once: true });
    void document.fonts.ready.then(markReady);
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", clearPointer);
    window.addEventListener("pointerup", clearPointer);
    skipButton.addEventListener("click", skip);
    void start();

    return () => {
      disposed = true;
      done = true;
      window.cancelAnimationFrame(animationFrame);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", markReady);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("pointerup", clearPointer);
      skipButton.removeEventListener("click", skip);
      document.body.classList.remove("edg-loader-active");
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="edg-loader"
      role="status"
      aria-label="Loading Edgecipline. Discipline over emotion."
    >
      <div className="edg-loader__background" />
      <canvas ref={canvasRef} className="edg-loader__canvas" aria-hidden="true" />
      <p ref={statusRef} className="edg-loader__status is-hot">
        Emotion detected…
      </p>
      <button ref={skipRef} className="edg-loader__skip" type="button">
        Skip
      </button>
    </div>
  );
}
