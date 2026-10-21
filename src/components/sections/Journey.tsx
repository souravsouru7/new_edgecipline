import type { CSSProperties } from "react";
import { BarChart3, Eye, Flag, Sparkles, type LucideIcon } from "lucide-react";

import {
  JOURNEY_BOX,
  JOURNEY_LINE,
  MILESTONE_PLACEMENTS,
  MILESTONE_POINTS,
  MILESTONE_PROGRESS,
  PIN_RISE,
} from "./journey-path";
import styles from "./Journey.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The four milestones.
 *
 * `tone` runs electric blue to cyber green across the four, so the colour of
 * the path and its pins is itself the progression the section describes. It
 * used to start on purple, which is not a colour this site has.
 */
type Milestone = {
  title: string;
  description: string;
  tone: string;
  icon: LucideIcon;
  align?: "below";
};

const MILESTONES: Milestone[] = [
  { title: "Awareness", description: "Understand your patterns.", tone: "#38bdf8", icon: Eye },
  { title: "Better Habits", description: "Make smarter decisions.", tone: "#22c3f0", icon: Flag },
  { title: "More Discipline", description: "Stay consistent.", tone: "#19dba8", icon: BarChart3 },
  { title: "A Stronger You", description: "Trade with clarity.", tone: "#39ff88", icon: Sparkles, align: "below" },
];

/** Where the stem leaves the pin, in box units — the pin covers the overlap. */
const STEM_TOP = PIN_RISE - 24;

export function Journey() {
  return (
    <section id="journey" className={css("jy")} data-sequence aria-labelledby="journey-title">

      <div className={css("jyInner")}>
        <header className={css("jyHeader")}>
          <h2 id="journey-title" data-reveal>
            Your Journey to a <span>Stronger You</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
            Small changes. A massive difference.
          </p>
        </header>

        <div className={css("jyStage")}>
          <svg
            className={css("jyLine")}
            viewBox={`0 0 ${JOURNEY_BOX.width} ${JOURNEY_BOX.height}`}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="journey-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#38bdf8" />
                <stop offset=".5" stopColor="#19dba8" />
                <stop offset="1" stopColor="#39ff88" />
              </linearGradient>
            </defs>

            <path className="jy-line jy-line--glow" d={JOURNEY_LINE} pathLength={1} />
            <path className="jy-line jy-line--core" d={JOURNEY_LINE} pathLength={1} />
            {/* A light that keeps travelling the finished path. */}
            <path className="jy-line-spark" d={JOURNEY_LINE} pathLength={1} />

            {MILESTONE_POINTS.map((point, index) => (
              <g
                key={point.x}
                className="jy-anchor"
                style={vars({ "--i": index, "--tone": MILESTONES[index].tone, "--at": MILESTONE_PROGRESS[index] })}
              >
                <line x1={point.x} y1={point.y - STEM_TOP} x2={point.x} y2={point.y} />
                <circle cx={point.x} cy={point.y} r="4.5" />
              </g>
            ))}
          </svg>

          {MILESTONES.map(({ title, description, tone, icon: Icon, align }, index) => (
            <div
              key={title}
              className={css("jyMilestone")}
              data-align={align}
              data-reveal="fade"
              style={vars({
                "--left": MILESTONE_PLACEMENTS[index].left,
                "--pin-top": MILESTONE_PLACEMENTS[index].pinTop,
                "--tone": tone,
                "--at": MILESTONE_PROGRESS[index],
                "--i": index,
              })}
            >
              <span className={css("jyPin")}>
                <Icon aria-hidden="true" size={20} strokeWidth={2.4} />
              </span>
              <div className={css("jyLabel")}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
