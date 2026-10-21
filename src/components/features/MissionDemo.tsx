"use client";

import { useState } from "react";
import { Flame } from "lucide-react";

import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;

/**
 * Feature 09 — missions and the streak ring.
 *
 * The brief asks for a milestone that fires only on a deliberate click, so
 * nothing here animates on its own: the ring and the bars hold their starting
 * values until the reader logs the day. State is component-local and resets on
 * reload, which is what the DEMO badge promises.
 *
 * The ring is an SVG circle whose dash offset is the value — no library, and
 * the transition is a composited stroke change rather than a re-layout.
 */
const RADIUS = 31;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Three illustrative missions, phrased after the source's own example. */
const MISSIONS = [
  { title: "No emotional trades for 7 days", from: 4, target: 7 },
  { title: "Complete the pre-trade checklist every session", from: 11, target: 14 },
  { title: "Journal within an hour of closing", from: 9, target: 10 },
] as const;

const START_STREAK = 12;
const GOAL = 14;

export function MissionDemo() {
  const [logged, setLogged] = useState(false);
  const streak = logged ? START_STREAK + 1 : START_STREAK;
  const reached = streak >= GOAL;

  return (
    <div className={css("ftMissionGrid")}>
      <div className={css("ftStreak")}>
        <div
          className={css("ftRing")}
          style={{
            // The ring is decorative; the number beside it carries the value.
            ["--ft-ring-len" as string]: `${CIRCUMFERENCE.toFixed(2)}`,
            ["--ft-ring-offset" as string]: `${(CIRCUMFERENCE * (1 - Math.min(1, streak / GOAL))).toFixed(2)}`,
          }}
        >
          <svg viewBox="0 0 74 74" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="ft-ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#00ef68" />
                <stop offset="1" stopColor="#23b9ff" />
              </linearGradient>
            </defs>
            <circle className={css("ftRingTrack")} cx="37" cy="37" r={RADIUS} />
            <circle className={css("ftRingValue")} cx="37" cy="37" r={RADIUS} />
          </svg>
          <p className={css("ftRingLabel")}>
            <b>{streak}</b>
            <span>days</span>
          </p>
        </div>

        <div className={css("ftStreakBody")}>
          <p>
            Daily streak with milestone notifications, and a streak protector grace period so one
            missed day doesn’t reset you.
          </p>
          <button
            className={css("ftDemoButton")}
            type="button"
            disabled={logged}
            onClick={() => setLogged(true)}
          >
            <Flame aria-hidden="true" size={15} />
            {logged ? "Day logged" : "Log today (demo)"}
          </button>
          {/* Announced, so the milestone is not a visual-only reward. */}
          <p className={css("ftMilestone")} role="status">
            {logged
              ? reached
                ? `Milestone reached — ${streak} days in a row.`
                : `${GOAL - streak} days to the next milestone.`
              : ""}
          </p>
        </div>
      </div>

      <ul className={css("ftMissions")} aria-label="Active missions">
        {MISSIONS.map((mission) => {
          const progress = logged ? Math.min(mission.target, mission.from + 1) : mission.from;
          const percent = Math.round((progress / mission.target) * 100);
          return (
            <li key={mission.title} className={css("ftMission")}>
              <p className={css("ftMissionHead")}>
                <b>{mission.title}</b>
                <span>
                  {progress}/{mission.target}
                </span>
              </p>
              <div
                className={css("ftProgress")}
                role="progressbar"
                aria-label={mission.title}
                aria-valuemin={0}
                aria-valuemax={mission.target}
                aria-valuenow={progress}
                style={{ ["--ft-progress" as string]: `${percent}%` }}
              >
                <i />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
