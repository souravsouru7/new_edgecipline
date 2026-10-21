import type { CSSProperties } from "react";
import { Flame } from "lucide-react";

import styles from "./WeeklyReflection.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/** Relative bar heights, read off the reference. No numbers are claimed for them. */
const WEEK = [
  { day: "Mon", height: 22 },
  { day: "Tue", height: 34 },
  { day: "Wed", height: 48 },
  { day: "Thu", height: 64 },
  { day: "Fri", height: 78 },
  { day: "Sat", height: 88 },
  { day: "Sun", height: 100 },
] as const;

const DISCIPLINE_SCORE = 78;

/** The dial is drawn at r=52 in a 120 box, so its circumference is ~327. */
const DIAL_RADIUS = 52;
const DIAL_LENGTH = 2 * Math.PI * DIAL_RADIUS;

export function WeeklyReflection() {
  return (
    <section
      id="reflection"
      className={css("wr")}
      data-sequence
      aria-labelledby="reflection-title"
    >

      <div className={css("wrInner")}>
        <header className={css("wrHeader")}>
          <h2 id="reflection-title" data-reveal>
            Weekly <span>Reflection &amp; Habits</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
            Turn insights into consistent action.
          </p>
        </header>

        <ul className={css("wrCards")}>
          <li
            className={`${css("wrCard")} ${css("wrStreak")}`}
            data-reveal
            style={vars({ "--i": 0 })}
          >
            <Flame className={css("wrFlame")} aria-hidden="true" size={26} strokeWidth={2.2} />
            {/* The count animates from 0; the real figure stays in the markup
                so it is readable without JavaScript and to screen readers. */}
            <span className={css("wrStreakValue")} data-count="12">
              12
            </span>
            <span className={css("wrCardLabel")}>Day Streak</span>
          </li>

          <li
            className={`${css("wrCard")} ${css("wrScore")}`}
            data-reveal
            style={vars({ "--i": 1 })}
          >
            <div className={css("wrDial")}>
              <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                <circle
                  className="wr-dial-track"
                  cx="60"
                  cy="60"
                  r={DIAL_RADIUS}
                  fill="none"
                  strokeWidth="9"
                />
                <circle
                  className="wr-dial-value"
                  cx="60"
                  cy="60"
                  r={DIAL_RADIUS}
                  fill="none"
                  strokeWidth="9"
                  strokeLinecap="round"
                  style={vars({
                    "--dash": DIAL_LENGTH.toFixed(1),
                    "--gap": (DIAL_LENGTH * (1 - DISCIPLINE_SCORE / 100)).toFixed(1),
                  })}
                />
              </svg>
              <span
                className={css("wrDialValue")}
                data-count={DISCIPLINE_SCORE}
                data-count-suffix="%"
              >
                {DISCIPLINE_SCORE}%
              </span>
            </div>
            <span className={css("wrCardLabel")}>Discipline Score</span>
          </li>

          <li
            className={`${css("wrCard")} ${css("wrReflect")}`}
            data-reveal
            style={vars({ "--i": 2 })}
          >
            <span className={css("wrReflectIcon")} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
                {/* Drawn on when the card arrives. */}
                <path className="wr-check" d="M8.2 12.4 L11 15.1 L16 9.6" pathLength={1} />
              </svg>
            </span>
            <div>
              <h3>Weekly Reflection</h3>
              <p>Review your week. Spot patterns. Set better intentions.</p>
            </div>
          </li>

          <li
            className={`${css("wrCard")} ${css("wrProgress")}`}
            data-reveal
            style={vars({ "--i": 3 })}
          >
            <h3>Your Progress</h3>
            <ul className={css("wrBars")}>
              {WEEK.map(({ day, height }, index) => (
                <li key={day}>
                  <span
                    className={css("wrBar")}
                    style={vars({ "--h": `${height}%`, "--i": index })}
                    aria-hidden="true"
                  />
                  <span>{day}</span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
}
