import type { CSSProperties } from "react";
import { CircleAlert, Sparkles, UsersRound } from "lucide-react";

import { ChartCanvas } from "./chart/ChartCanvas";
import { CHECKPOINTS, framePosition } from "./chart/chart-geometry";
import "./ChartStory.module.css";

const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The four annotated moments.
 *
 * `checkpoint` is an index into CHECKPOINTS in chart-geometry.ts, so each
 * label is tied to the marker it names by coordinate. The previous version
 * placed them with percentages measured against the whole section — `left:
 * 45.6%; top: 35%` and so on — which only lined up while the section was a
 * fixed-aspect panel of the pinned stage. On a section whose height comes
 * from its content, those labels drifted off the peaks they were pointing at.
 *
 * There are five markers and four labels: the fifth is the highest point of
 * the line, left unannotated on purpose so the sequence reads as continuing
 * past the last thing that was noticed.
 */
const events = [
  { title: "FOMO", detail: "Entered late", checkpoint: 0 },
  { title: "Moved Stop", detail: "Let emotion win", checkpoint: 1 },
  { title: "Revenge Trade", detail: "Chased the move", checkpoint: 2 },
  { title: "Pattern Noticed", detail: "Starting to improve", checkpoint: 4 },
] as const;

const badges = [
  { label: "Real Struggles", icon: CircleAlert },
  { label: "Real Traders", icon: UsersRound },
  { label: "A Clearer Tomorrow", icon: Sparkles },
] as const;

export function ChartStorySection() {
  return (
    <section id="chart-story" className="chart-story" aria-labelledby="chart-story-title">
      <div className="chart-inner">
        <div className="chart-copy">
          <h2 id="chart-story-title" data-reveal>
            The chart{" "}
            <span>
              is not
              <br />
              the whole story.
            </span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".12s" })}>
            Behind every candle is a thought, an emotion, a decision. Edgecipline helps you see the
            full picture.
          </p>
          <ul className="story-badges" data-stagger style={vars({ "--mo-step": ".1s" })}>
            {badges.map(({ label, icon: Icon }, index) => (
              <li key={label} data-reveal="rise-sm" style={vars({ "--i": index + 2 })}>
                <Icon aria-hidden="true" size={16} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="chart-figure" aria-describedby="chart-caption">
          {/* The chart is drawn as real SVG from the supplied editable
              artwork, so the price line can be stroked on and the candles can
              arrive left to right. The plot keeps the artwork's own aspect
              ratio, which is what lets the labels below be positioned from
              chart coordinates. */}
          <div className="chart-plot" data-sequence>
            <ChartCanvas />
          </div>

          {/* Each label sits under the x position of its marker and runs a
              leader line up to it, so the pairing is visible without putting
              text on top of the line. */}
          <ul className="chart-events">
            {events.map(({ title, detail, checkpoint }, index) => {
              const point = CHECKPOINTS[checkpoint];
              return (
                <li
                  key={title}
                  data-reveal="rise-sm"
                  style={vars({ "--at": framePosition(point.x, point.y).left, "--i": index })}
                >
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </li>
              );
            })}
          </ul>

          {/* Visible, not screen-reader-only. That the chart is an
              illustration and not market data is a statement about the
              honesty of the page, so it is said where everyone can read it. */}
          <figcaption id="chart-caption">
            An illustrative chart, not live market data: it shows how feelings and decisions shape
            outcomes beyond individual price candles.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
