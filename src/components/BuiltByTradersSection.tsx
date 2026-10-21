import type { CSSProperties } from "react";
import Image from "next/image";

import { NeuralOverlay } from "./story/NeuralOverlay";

const railLabels = ["Real Struggles", "Real Traders", "A Clearer Tomorrow"];
const features = [
  { label: "Real Experience", icon: "/built-by-traders/experience.webp" },
  { label: "Practical Insights", icon: "/built-by-traders/insights.webp" },
  { label: "A Calmer Stronger You", icon: "/built-by-traders/calmer.webp" },
];

const vars = (value: Record<string, string | number>) => value as CSSProperties;

export function BuiltByTradersSection() {
  return <section id="story" className="built-traders" data-sequence aria-labelledby="story-heading">
    <div className="story-ribbons" aria-hidden="true"><Image src="/built-by-traders/ribbons.webp" alt="" fill sizes="(max-width: 767px) 100vw, 87vw" /></div>
    <NeuralOverlay />
    <div className="story-copy"><h2 id="story-heading" data-reveal>Built by <span>traders,</span><br /><span>for traders.</span></h2><p data-reveal style={vars({ "--mo-delay": ".14s" })}>Edgecipline was born from real trading struggles — the overtrading, the impulsive decisions, the frustration. We built it to help traders like us gain self-awareness, understand behavior, and trade with a calmer, clearer mind.</p></div>
    <div className="story-visual" aria-hidden="true"><span className="story-aura" /><Image src="/built-by-traders/trader.webp" alt="" width={1500} height={1241} sizes="(max-width: 767px) 95vw, 51vw" /></div>
    <ul className="story-rail-labels">{railLabels.map((label, index) => <li key={label} data-reveal="from-left" style={vars({ "--i": index })}>{label}</li>)}</ul>
    <ul className="story-features">{features.map(({ label, icon }, index) => <li key={label} data-reveal="rise-sm" style={vars({ "--i": index })}><Image src={icon} alt="" width={160} height={160} sizes="42px" /><span>{label}</span></li>)}</ul>
  </section>;
}
