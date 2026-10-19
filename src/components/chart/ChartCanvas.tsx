import type { CSSProperties } from "react";

import {
  CANDLE_BODY,
  CANDLE_DOWN,
  CANDLE_UP,
  CANDLE_WICK_OVERSHOOT,
  CANDLES,
  CHART_VIEWBOX,
  CHECKPOINTS,
  ECHO_WAVES,
  PRICE_LINE,
} from "./chart-geometry";

/**
 * Section 03's chart, drawn as real SVG from the supplied editable artwork
 * instead of the flattened bitmap, so the price line can actually be stroked
 * on, the candles can arrive left to right and the checkpoints can pulse in
 * sequence. Geometry, palette and viewBox are the artwork's own, so the
 * composition is pixel-for-pixel where it was.
 *
 * Still a Server Component: the whole thing is static markup, and every
 * animation below is CSS keyed off `data-inview` (see motion.css, "Section 03").
 */

/** Where along the price line each checkpoint sits, 0..1 — used to time the pulses. */
const LINE_X0 = 1450;
const LINE_X1 = CHART_VIEWBOX.width;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function ChartCanvas() {
  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${CHART_VIEWBOX.width} ${CHART_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-labelledby="chart-art-title"
      focusable="false"
    >
      <title id="chart-art-title">
        An illustrative price chart: a candle sequence with a rising line and five
        highlighted moments where a decision was made.
      </title>

      <defs>
        <linearGradient id="chart-line-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#28f7c0" />
          <stop offset=".4" stopColor="#54b9ff" />
          <stop offset=".7" stopColor="#9b61ff" />
          <stop offset="1" stopColor="#11ffab" />
        </linearGradient>
      </defs>

      {/* Market "memory" waves — slow, continuous drift behind the chart. */}
      <g className="chart-waves" aria-hidden="true">
        {ECHO_WAVES.map((wave, index) => (
          <path
            key={wave.d}
            d={wave.d}
            fill="none"
            stroke={wave.color}
            strokeWidth="2"
            style={vars({ "--i": index })}
          />
        ))}
      </g>

      {/* Candles: one group each so they can arrive in sequence. */}
      <g className="chart-candles" aria-hidden="true">
        {CANDLES.map((candle, index) => {
          const color = candle.up ? CANDLE_UP : CANDLE_DOWN;
          return (
            <g key={candle.x} className="chart-candle" style={vars({ "--i": index })}>
              <line
                x1={candle.x + CANDLE_BODY.width / 2}
                x2={candle.x + CANDLE_BODY.width / 2}
                y1={candle.y - CANDLE_WICK_OVERSHOOT}
                y2={candle.y + CANDLE_BODY.height + CANDLE_WICK_OVERSHOOT}
                stroke={color}
                strokeWidth="3"
                opacity=".38"
              />
              <rect
                x={candle.x}
                y={candle.y}
                width={CANDLE_BODY.width}
                height={CANDLE_BODY.height}
                rx="1"
                fill={color}
                opacity=".45"
              />
            </g>
          );
        })}
      </g>

      {/* The price line: a wide blurred copy for the halo, a crisp copy on top. */}
      {/* A wide translucent copy stands in for the artwork's Gaussian halo: the
          waves animate in this same SVG, and a live blur filter here would be
          re-rasterised on every one of those frames. */}
      <path
        className="chart-line chart-line--halo"
        d={PRICE_LINE}
        pathLength="1"
        fill="none"
        stroke="url(#chart-line-gradient)"
        strokeWidth="26"
        opacity=".26"
      />
      <path
        className="chart-line chart-line--core"
        d={PRICE_LINE}
        pathLength="1"
        fill="none"
        stroke="url(#chart-line-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* A light that keeps travelling the finished line. */}
      <path
        className="chart-line-spark"
        d={PRICE_LINE}
        pathLength="1"
        fill="none"
        stroke="#e9fffb"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Emotional checkpoints. The last one settles greener and calmer. */}
      <g className="chart-marks" aria-hidden="true">
        {CHECKPOINTS.map((point, index) => {
          const calm = index === CHECKPOINTS.length - 1;
          return (
            <g
              key={`${point.x}-${point.y}`}
              className="chart-mark"
              data-calm={calm ? "" : undefined}
              style={vars({
                "--i": index,
                "--at": ((point.x - LINE_X0) / (LINE_X1 - LINE_X0)).toFixed(3),
              })}
            >
              <circle className="chart-mark__ring" cx={point.x} cy={point.y} r="30" />
              <circle className="chart-mark__pulse" cx={point.x} cy={point.y} r="30" />
              <circle className="chart-mark__core" cx={point.x} cy={point.y} r="10" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
