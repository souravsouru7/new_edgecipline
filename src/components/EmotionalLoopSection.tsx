import type { CSSProperties } from "react";
import Image from "next/image";

type EmotionStage = {
  title: string;
  detail: string;
  tone: "rush" | "rule" | "regret" | "repeat";
  icon: string;
};

export const emotionStages: EmotionStage[] = [
  { title: "Rush", detail: "FOMO kicks in", tone: "rush", icon: "/images/emotional-loop/rush.webp" },
  { title: "Rule Break", detail: "Ignore your plan", tone: "rule", icon: "/images/emotional-loop/rule-break.webp" },
  { title: "Regret", detail: "Look at the results", tone: "regret", icon: "/images/emotional-loop/regret.webp" },
  { title: "Repeat", detail: "Same patterns", tone: "repeat", icon: "/images/emotional-loop/repeat.webp" },
];

const vars = (value: Record<string, string | number>) => value as CSSProperties;

function EmotionNode({ stage, index }: { stage: EmotionStage; index: number }) {
  // --i places the node in the four-beat cycle, so brightness hands over from
  // one stage to the next in the same order as the travelling light.
  return <button type="button" className={`emotion-node ${stage.tone}`} style={vars({ "--i": index })} aria-describedby={`stage-${stage.tone}`}>
    <Image className="emotion-icon" src={stage.icon} alt="" width={320} height={320} aria-hidden="true" />
    <strong>{stage.title}</strong><span>{stage.detail}</span><span className="node-tooltip" role="tooltip">{stage.title}: {stage.detail}</span>
  </button>;
}

const loopPaths = ["M244 79 C301 90 333 126 343 171", "M345 229 C332 286 293 321 241 334", "M157 333 C101 318 68 277 57 230", "M57 171 C69 113 108 80 158 68"];

export function EmotionalLoopSection() {
  return <section id="emotional-loop" className="emotional-loop" aria-labelledby="emotional-loop-title">
    <div className="loop-backdrop" aria-hidden="true" />
    <div className="loop-inner">
      <header className="loop-copy" data-reveal>
        <h2 id="emotional-loop-title">The <span>Emotional Loop</span></h2>
        <p>Same cycle. Different day.<br />It&apos;s not just the market —<br />it&apos;s human nature.</p><i aria-hidden="true" />
      </header>
      {/* data-sequence asks for the in-view signal without hiding the diagram:
          the arrows draw themselves, then one light starts circulating. */}
      <figure className="loop-figure" data-sequence aria-describedby="loop-description">
        <svg className="loop-connectors" viewBox="0 0 400 400" fill="none" aria-hidden="true">
          <defs><marker id="loop-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#b9f8ff" /></marker></defs>
          {loopPaths.map((path, index) => (
            <g key={path} style={vars({ "--i": index })}>
              <path className="loop-path" d={path} pathLength={1} markerEnd="url(#loop-arrow)" />
              <path className="loop-spark" d={path} pathLength={1} />
            </g>
          ))}
        </svg>
        <div className="loop-nodes">{emotionStages.map((stage, index) => <EmotionNode key={stage.tone} stage={stage} index={index} />)}</div>
        <figcaption id="loop-description" className="sr-only">A four-step behavioral cycle: rush, rule break, regret, then repeat.</figcaption>
      </figure>
      <aside className="loop-callout" data-reveal="from-right"><p>Until you<br />become aware,<br />the loop continues.</p><i aria-hidden="true" /></aside>
    </div>
    <ol className="sr-only">{emotionStages.map((stage) => <li key={stage.tone} id={`stage-${stage.tone}`}><strong>{stage.title}</strong>: {stage.detail}</li>)}</ol>
  </section>;
}
