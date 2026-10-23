import { ArrowRight, Flame, Ban, RotateCw, TrendingDown, Eye, ShieldOff, Repeat, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";

function Label({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="edg-section-label">
      <span className="edg-label-line" />
      <span>{number} / {children}</span>
    </div>
  );
}

const emotionalLoop = [
  { n: "01", title: "Rush", detail: "FOMO kicks in", Icon: Flame },
  { n: "02", title: "Rule Break", detail: "Ignore your plan", Icon: ShieldOff },
  { n: "03", title: "Regret", detail: "Look at the results", Icon: TrendingDown },
  { n: "04", title: "Repeat", detail: "Same patterns", Icon: Repeat },
] as const;

export function EmotionalLoopContent() {
  return (
    <section className="edg-section edg-restored edg-cycle" id="emotional-loop" aria-labelledby="edg-emotional-title">
      <div className="edg-section-intro">
        <Label number="01">THE EMOTIONAL LOOP</Label>
        <h2 id="edg-emotional-title">SAME CYCLE.<br/><em>DIFFERENT DAY.</em></h2>
        <p>It&apos;s not just the market — it&apos;s human nature.</p>
        <p>Until you become aware, the loop continues.</p>
      </div>
      <div className="edg-cycle-stage" aria-label="The emotional loop in four stages">
        <svg className="edg-cycle-flow" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <linearGradient id="edg-cycle-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#4aab75" stopOpacity="0.95" />
              <stop offset="1" stopColor="#1a724a" stopOpacity="0.95" />
            </linearGradient>
            <radialGradient id="edg-cycle-glow" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#6cc995" />
              <stop offset="1" stopColor="#27865b" />
            </radialGradient>
            <path id="edg-cycle-track" d="M 52 18 L 248 18 A 34 34 0 0 1 282 52 L 282 248 A 34 34 0 0 1 248 282 L 52 282 A 34 34 0 0 1 18 248 L 18 52 A 34 34 0 0 1 52 18 Z" />
          </defs>
          <use href="#edg-cycle-track" className="edg-cycle-path" />
          <use href="#edg-cycle-track" className="edg-cycle-trace" pathLength={100} />
          <circle r="6" className="edg-cycle-pulse" fill="url(#edg-cycle-glow)">
            <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
              <mpath href="#edg-cycle-track" />
            </animateMotion>
          </circle>
        </svg>
        <ol className="edg-cycle-nodes" aria-label="Four stages, clockwise">
          {emotionalLoop.map(({ n, title, detail, Icon }, i) => (
            <li key={n} className="edg-cycle-node" style={{ "--i": i } as CSSProperties}>
              <span className="edg-cycle-ring" aria-hidden="true">
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <span className="edg-cycle-num">{n}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
        <div className="edg-cycle-core" aria-hidden="true">
          <RotateCw size={16} strokeWidth={1.6} />
          <small>THE LOOP</small>
          <strong>CONTINUES</strong>
        </div>
      </div>
    </section>
  );
}

const decisionMoments = [
  { title: "FOMO", detail: "Entered late", tag: "Impulse", trend: "down" as const, Icon: Flame },
  { title: "Moved Stop", detail: "Let emotion win", tag: "Fear", trend: "down" as const, Icon: Ban },
  { title: "Revenge Trade", detail: "Chased the move", tag: "Tilt", trend: "down" as const, Icon: TrendingDown },
  { title: "Pattern Noticed", detail: "Starting to improve", tag: "Aware", trend: "up" as const, Icon: Eye },
] as const;

const storyCandles: ReadonlyArray<{ x: number; o: number; c: number; h: number; l: number; anchor?: number }> = [
  { x: 20,  o: 70, c: 62, h: 58, l: 74 },
  { x: 40,  o: 62, c: 78, h: 60, l: 82, anchor: 0 },
  { x: 60,  o: 76, c: 70, h: 66, l: 80 },
  { x: 80,  o: 72, c: 80, h: 68, l: 84 },
  { x: 100, o: 80, c: 92, h: 76, l: 96, anchor: 1 },
  { x: 120, o: 90, c: 86, h: 82, l: 94 },
  { x: 140, o: 86, c: 94, h: 82, l: 100 },
  { x: 160, o: 94, c: 108, h: 90, l: 112, anchor: 2 },
  { x: 180, o: 106, c: 96, h: 92, l: 110 },
  { x: 200, o: 96, c: 82, h: 78, l: 100 },
  { x: 220, o: 82, c: 70, h: 66, l: 86 },
  { x: 240, o: 70, c: 54, h: 48, l: 74, anchor: 3 },
];

export function ChartStoryContent() {
  return (
    <section className="edg-section edg-restored edg-story" id="chart-story" aria-labelledby="edg-chart-story-title">
      <div className="edg-section-intro">
        <Label number="02">BEYOND THE NUMBERS</Label>
        <h2 id="edg-chart-story-title">THE CHART IS NOT<br/><em>THE WHOLE STORY.</em></h2>
        <p>Behind every candle is a thought, an emotion, a decision. Edgecipline helps you see the full picture.</p>
        <div className="edg-story-badges"><span>Real Struggles</span><span>Real Traders</span><span>A Clearer Tomorrow</span></div>
      </div>
      <div className="edg-story-stage" aria-label="Four trading decisions behind the chart">
        <figure className="edg-story-chart" aria-hidden="true">
          <svg viewBox="0 0 260 130" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="edg-story-trend" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#db514a" />
                <stop offset=".65" stopColor="#db514a" />
                <stop offset="1" stopColor="#27865b" />
              </linearGradient>
              <linearGradient id="edg-story-fade" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#27865b" stopOpacity=".16" />
                <stop offset="1" stopColor="#27865b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="0" x2="260" y1={20 + i * 22} y2={20 + i * 22} className="edg-story-grid" />
            ))}
            <path
              d={`M ${storyCandles.map((c) => `${c.x} ${(c.o + c.c) / 2}`).join(" L ")} L 260 130 L 20 130 Z`}
              fill="url(#edg-story-fade)"
            />
            <path
              d={`M ${storyCandles.map((c) => `${c.x} ${(c.o + c.c) / 2}`).join(" L ")}`}
              className="edg-story-trend"
              pathLength={100}
            />
            {storyCandles.map((c, i) => {
              const bullish = c.c < c.o;
              const top = Math.min(c.o, c.c);
              const bot = Math.max(c.o, c.c);
              return (
                <g key={i} className={`edg-story-candle ${bullish ? "is-up" : "is-down"}`} style={{ "--i": i } as CSSProperties}>
                  <line x1={c.x} x2={c.x} y1={c.h} y2={c.l} className="edg-story-wick" />
                  <rect x={c.x - 3.4} y={top} width={6.8} height={Math.max(2, bot - top)} className="edg-story-body" />
                </g>
              );
            })}
            {storyCandles.filter((c) => c.anchor !== undefined).map((c) => (
              <circle key={c.anchor} cx={c.x} cy={(c.o + c.c) / 2 - 8} r="3.2" className="edg-story-mark" style={{ "--i": c.anchor } as CSSProperties} />
            ))}
          </svg>
          <figcaption>
            <span>Price</span>
            <span>Time →</span>
          </figcaption>
        </figure>
        <ol className="edg-story-moments" aria-label="Four moments in the chart">
          {decisionMoments.map(({ title, detail, tag, trend, Icon }, i) => (
            <li key={title} className={`edg-story-moment edg-story-moment-${trend}`} style={{ "--i": i } as CSSProperties}>
              <span className="edg-story-moment-pin">{String(i + 1).padStart(2, "0")}</span>
              <span className="edg-story-moment-icon" aria-hidden="true">
                <Icon size={16} strokeWidth={1.7} />
              </span>
              <div className="edg-story-moment-body">
                <header>
                  <strong>{title}</strong>
                  <span className="edg-story-moment-tag">{tag}</span>
                </header>
                <p>{detail}</p>
              </div>
              <span className="edg-story-moment-trend" aria-hidden="true">
                {trend === "up" ? <Sparkles size={14} strokeWidth={1.7} /> : <TrendingDown size={14} strokeWidth={1.7} />}
              </span>
            </li>
          ))}
        </ol>
        <p className="edg-story-note">These are illustrative trading moments, not live market data.</p>
      </div>
    </section>
  );
}

export function BuiltByTradersContent() {
  return (
    <section className="edg-section edg-restored edg-built-by" id="story" aria-labelledby="edg-built-by-title">
      <div className="edg-section-intro">
        <Label number="03">OUR STORY</Label>
        <h2 id="edg-built-by-title">BUILT BY TRADERS,<br/><em>FOR TRADERS.</em></h2>
        <p>Edgecipline was born from real trading struggles — the overtrading, the impulsive decisions, the frustration. We built it to help traders like us gain self-awareness, understand behavior, and trade with a calmer, clearer mind.</p>
        <a className="edg-text-link" href="/about">Read our story <ArrowRight size={14}/></a>
      </div>
      <div className="edg-story-values">
        <div><span>01</span><strong>Real Experience</strong><p>Built from the trading challenges we know firsthand.</p></div>
        <div><span>02</span><strong>Practical Insights</strong><p>Understand the choices behind every trade.</p></div>
        <div><span>03</span><strong>A Calmer, Stronger You</strong><p>Turn awareness into a more consistent approach.</p></div>
      </div>
    </section>
  );
}

const dnaTraits = [
  ["Emotional Triggers", "What sets you off?"],
  ["Risk Behavior", "How you handle risk."],
  ["Strengths & Edges", "Where you naturally excel."],
  ["Trading Personality", "Your unique trading style."],
] as const;

export function TradingDnaContent() {
  return (
    <section className="edg-section edg-restored edg-dna" id="trading-dna" aria-labelledby="edg-dna-title">
      <div className="edg-section-intro">
        <Label number="07">YOUR TRADING DNA</Label>
        <h2 id="edg-dna-title">KNOW YOUR<br/><em>PATTERNS.</em></h2>
        <p>A deeper process. A powerful shift.</p>
        <p>A deeper understanding leads to better decisions. Know your patterns. Trade a stronger version of yourself.</p>
      </div>
      <div className="edg-dna-content">
        <div className="edg-dna-traits">{dnaTraits.map(([title, description], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{title}</strong><small>{description}</small></p></div>)}</div>
        <p className="edg-dna-tags">EMOTIONS <span>·</span> RISK <span>·</span> BEHAVIOR <span>·</span> DISCIPLINE <span>·</span> EXECUTION</p>
      </div>
    </section>
  );
}

const week = [["Mon", 22], ["Tue", 34], ["Wed", 48], ["Thu", 64], ["Fri", 78], ["Sat", 88], ["Sun", 100]] as const;

export function WeeklyReflectionContent() {
  return (
    <section className="edg-section edg-restored edg-reflection" id="reflection" aria-labelledby="edg-reflection-title">
      <div className="edg-section-intro">
        <Label number="08">WEEKLY REFLECTION</Label>
        <h2 id="edg-reflection-title">TURN INSIGHTS INTO<br/><em>CONSISTENT ACTION.</em></h2>
        <p>Review your week. Spot patterns. Set better intentions.</p>
      </div>
      <div className="edg-weekly-panel" aria-label="Illustrative weekly reflection example">
        <div className="edg-weekly-head"><strong>This week</strong><span>Example data</span></div>
        <div className="edg-weekly-stats"><div><strong>12</strong><span>Day Streak</span></div><div><strong>78%</strong><span>Discipline Score</span></div></div>
        <div className="edg-weekly-bars"><h3>Your Progress</h3><div>{week.map(([day, height]) => <span key={day}><i style={{ height: `${height}%` }}/><small>{day}</small></span>)}</div></div>
        <p><strong>Weekly Reflection</strong><br/>Review your week. Spot patterns. Set better intentions.</p>
      </div>
    </section>
  );
}

const journey = [
  ["01", "Awareness", "Understand your patterns."],
  ["02", "Better Habits", "Make smarter decisions."],
  ["03", "More Discipline", "Stay consistent."],
  ["04", "A Stronger You", "Trade with clarity."],
] as const;

export function JourneyContent() {
  return (
    <section className="edg-section edg-restored edg-journey" id="journey" aria-labelledby="edg-journey-title">
      <div className="edg-section-intro">
        <Label number="09">YOUR JOURNEY</Label>
        <h2 id="edg-journey-title">A JOURNEY TO<br/><em>A STRONGER YOU.</em></h2>
        <p>Small changes. A massive difference.</p>
      </div>
      <ol className="edg-journey-list">{journey.map(([number, title, description]) => <li key={number}><span>{number}</span><p><strong>{title}</strong><small>{description}</small></p></li>)}</ol>
    </section>
  );
}
