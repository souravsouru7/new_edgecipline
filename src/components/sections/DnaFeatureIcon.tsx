import type { CSSProperties } from "react";
import type { JSX } from "react";

/**
 * The four Trading DNA feature icons, inlined from the supplied vector artwork
 * (6/Edgecipline_Trading_DNA_4K_WEBP/vectors/02..05_*.svg).
 *
 * Each ships as a 160KB WebP as well; inlining the vectors costs about 1KB
 * each instead, keeps them crisp, and lets the glow follow --mo-glow. The
 * artwork's own geometry, stroke weights and per-icon colour are unchanged —
 * only the Gaussian glow moves to a CSS drop-shadow.
 *
 * They carry no alt text or title: the row's heading and description next to
 * them already say what each one means.
 */
export type DnaIconName = "emotions" | "risk" | "strengths" | "personality";

const GLYPHS: Record<DnaIconName, { color: string; glyph: JSX.Element }> = {
  emotions: {
    color: "#39ff88",
    glyph: (
      <>
        <path d="M500 360 C385 300 340 500 430 555 C380 640 480 686 500 610 C570 700 670 620 580 551 C690 481 610 301 500 360 Z" />
        <path d="M500 358 V635 M430 470 H500 M505 540 H575" />
      </>
    ),
  },
  risk: {
    color: "#00c878",
    glyph: (
      <>
        <path d="M400 630 C352 550 372 433 447 401 C493 345 591 384 603 454 C658 494 629 573 567 587 L567 657 H410 Z" />
        <path d="M455 480 L510 530 L565 458 M490 565 H545" />
      </>
    ),
  },
  strengths: {
    color: "#7dd3fc",
    glyph: (
      <>
        <circle cx="500" cy="505" r="134" />
        <circle cx="500" cy="505" r="78" />
        <circle cx="500" cy="505" r="23" />
        <path d="M410 605 L580 400 M557 395 L598 393 L600 435" />
      </>
    ),
  },
  personality: {
    color: "#38bdf8",
    glyph: (
      <>
        <circle cx="500" cy="448" r="92" />
        <path d="M330 660 Q500 510 670 660 M588 353 L607 381 L639 387 L615 413 L620 447 L588 430 L560 447 L564 412 L541 387 L575 381 Z" />
      </>
    ),
  },
};

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function DnaFeatureIcon({ name }: { name: DnaIconName }) {
  const { color, glyph } = GLYPHS[name];
  return (
    <svg
      className="dnaIcon"
      viewBox="200 200 600 600"
      aria-hidden="true"
      focusable="false"
      style={vars({ "--icon": color })}
    >
      <circle cx="500" cy="500" r="275" fill="#050914" stroke={color} strokeWidth="25" />
      <circle cx="500" cy="500" r="240" fill="none" stroke={color} strokeWidth="8" opacity=".5" />
      <g fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
        {glyph}
      </g>
    </svg>
  );
}
