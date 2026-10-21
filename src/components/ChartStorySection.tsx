import type { CSSProperties } from "react";
import { CircleAlert, Sparkles, UsersRound } from "lucide-react";

import { ChartCanvas } from "./chart/ChartCanvas";

const events = [
  { title: "FOMO", detail: "Entered late", position: "fomo" },
  { title: "Moved Stop", detail: "Let emotion win", position: "moved-stop" },
  { title: "Revenge Trade", detail: "Chased the move", position: "revenge" },
  { title: "Pattern Noticed", detail: "Starting to improve", position: "pattern" },
] as const;

const badges = [
  { label: "Real Struggles", icon: CircleAlert },
  { label: "Real Traders", icon: UsersRound },
  { label: "A Clearer Tomorrow", icon: Sparkles },
] as const;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function ChartStorySection() {
  return <section id="chart-story" className="chart-story" aria-labelledby="chart-story-title">
    {/* The chart is drawn as real SVG from the supplied editable artwork, so the
        price line can be stroked on and the candles can arrive left to right.
        The fit box reproduces the framing the flattened art had. */}
    <div className="chart-art" data-sequence>
      <div className="chart-fit"><ChartCanvas /></div>
    </div>
    <div className="chart-inner">
      <div className="chart-copy">
        <h2 id="chart-story-title" data-reveal>The chart <span>is not<br />the whole story.</span></h2>
        <p data-reveal style={vars({ "--mo-delay": ".12s" })}>Behind every candle is a thought, an emotion, a decision. Edgecipline helps you see the full picture.</p>
        <ul className="story-badges" data-stagger style={vars({ "--mo-step": ".1s" })}>{badges.map(({ label, icon: Icon }, index) => <li key={label} data-reveal="rise-sm" style={vars({ "--i": index + 2 })}><Icon aria-hidden="true" size={22} /><span>{label}</span></li>)}</ul>
      </div>
      <figure className="chart-figure" aria-describedby="chart-caption">
        <ul className="chart-events">{events.map(({ title, detail, position }) => <li key={title} className={position} data-reveal="rise-sm"><strong>{title}</strong><span>{detail}</span></li>)}</ul>
        <figcaption id="chart-caption" className="sr-only">An illustrative chart, not live market data: it shows how feelings and decisions shape outcomes beyond individual price candles.</figcaption>
      </figure>
    </div>
  </section>;
}
