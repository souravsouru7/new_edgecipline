import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import {
  AlarmClock,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Filter,
  LayoutGrid,
  Search,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import type { FeatureId } from "@/data/features";
import { ChecklistDemo } from "./ChecklistDemo";
import { MarketModeTabs } from "./MarketModeTabs";
import { MissionDemo } from "./MissionDemo";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * One visual per feature.
 *
 * The brief asks for fourteen distinct treatments rather than fourteen
 * identical two-column cards, so each one is built here against the feature it
 * illustrates. Three rules hold throughout:
 *
 *   * Nothing is a product screenshot. Five of them use the supplied concept
 *     artwork; the rest are drawn in HTML/SVG. Every panel that could be
 *     mistaken for live data carries a badge saying it is an illustration.
 *   * No invented figures. Where a real product would show a number, these
 *     show the shape of the thing — relative bars, field labels, empty states —
 *     or a value that is obviously a placeholder.
 *   * Motion is opacity/transform/stroke only, gated on `[data-inview]` from
 *     the page-wide reveal observer, and switched off for reduced motion.
 */

/** Shell shared by every visual: the surface, the glow and the badge. */
function Panel({
  children,
  badge = "Illustration",
  caption,
  className,
}: {
  children: ReactNode;
  badge?: string | null;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={[css("ftVisual"), className].filter(Boolean).join(" ")} data-sequence>
      {badge && <p className={css("ftDemoBadge")}>{badge}</p>}
      {children}
      {caption && <p className={css("ftVisualCaption")}>{caption}</p>}
    </div>
  );
}

/** Concept artwork from the supplied kit. Decorative: the copy carries meaning. */
function Art({ src }: { src: string }) {
  return (
    <figure className={css("ftArt")} aria-hidden="true">
      <Image src={src} alt="" width={1600} height={1000} sizes="(max-width: 1199px) 100vw, 46vw" unoptimized />
    </figure>
  );
}

/* -- 01 — AI Screenshot Extraction ----------------------------------------- */

/** The fields the source says the pipeline extracts. */
const EXTRACTED = [
  ["Pair", "EUR/USD"],
  ["Direction", "Buy"],
  ["Entry", "1.0824"],
  ["Exit", "1.0851"],
  ["P&L", "+27 pips"],
  ["Lot size", "0.40"],
  ["Time", "09:42"],
] as const;

function ScreenshotVisual() {
  return (
    <Panel
      className={css("ftScanBlock")}
      caption="Concept illustration. The light pass stands in for the three-layer pipeline reading a capture; the fields below are the ones the extractor returns."
      badge="Illustration"
    >
      <div className={css("ftScan")}>
        <Art src="/features/art/02_screenshot_to_insight.svg" />
        <span className={css("ftScanLine")} aria-hidden="true" />
      </div>
      <dl className={css("ftFields")} aria-label="Fields extracted from a screenshot">
        {EXTRACTED.map(([label, value], index) => (
          <div key={label} style={vars({ "--i": index })}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* -- 03 — Trading Journal -------------------------------------------------- */

const LEDGER = [
  { instrument: "EUR/USD", setup: "Breakout", emotion: "Calm", outcome: "+1.8R", tone: "up" },
  { instrument: "BANKNIFTY", setup: "Reversal", emotion: "FOMO", outcome: "−1.0R", tone: "down" },
  { instrument: "GBP/JPY", setup: "Pullback", emotion: "Confident", outcome: "+2.4R", tone: "up" },
] as const;

function JournalVisual() {
  return (
    <Panel caption="Illustration — the rows are placeholders, not a real account. Filters shown are the ones the journal offers: instrument, setup, emotion and outcome.">
      <div className={css("ftFilterBar")} aria-hidden="true">
        <span className={css("ftFakeField")}>
          <Search size={13} /> Search history
        </span>
        <span className={css("ftFakeField")}>
          <Filter size={13} /> Instrument <ChevronDown size={13} />
        </span>
        <span className={css("ftFakeField")}>
          Setup <ChevronDown size={13} />
        </span>
        <span className={css("ftFakeField")}>
          Emotion <ChevronDown size={13} />
        </span>
        <span className={css("ftFakeField")}>
          Outcome <ChevronDown size={13} />
        </span>
      </div>

      <div className={css("ftTableScroll")}>
        <table className={css("ftLedger")}>
        <caption>Example rows — illustrative values</caption>
        <thead>
          <tr>
            <th scope="col">Instrument</th>
            <th scope="col">Setup</th>
            <th scope="col">Emotion</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {LEDGER.map((row) => (
            <tr key={row.instrument}>
              <td>{row.instrument}</td>
              <td>
                <span className={css("ftTag")}>{row.setup}</span>
              </td>
              <td>
                <span className={css("ftTag")}>{row.emotion}</span>
              </td>
              <td data-tone={row.tone}>{row.outcome}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* -- 04 — Trading DNA & Pattern Detection ---------------------------------- */

/** Relative, unlabelled strength — the shape of an edge, not a claimed number. */
const DNA_BREAKDOWN = [
  { label: "London", bar: "86%", from: "#00ef68", to: "#23b9ff" },
  { label: "New York", bar: "54%", from: "#00ef68", to: "#23b9ff" },
  { label: "Asia", bar: "31%", from: "#00ef68", to: "#23b9ff" },
] as const;

function TradingDnaVisual() {
  return (
    <Panel
      className={css("ftBarsBlock")}
      caption="Illustration. Bars show relative strength only — your own breakdown is computed from your trades."
    >
      <div className={css("ftPanel")}>
        <p className={css("ftPanelTitle")}>
          <LayoutGrid size={13} aria-hidden="true" /> Edge by session
        </p>
        <dl className={css("ftBars")}>
          {DNA_BREAKDOWN.map((row, index) => (
            <div key={row.label} style={vars({ "--i": index })}>
              <dt>{row.label}</dt>
              <dd>
                <span
                  className={css("ftBarTrack")}
                  style={vars({ "--ft-bar": row.bar, "--ft-bar-from": row.from, "--ft-bar-to": row.to })}
                >
                  <i />
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={css("ftPanel")} style={{ marginTop: 10 }}>
        <p className={css("ftPanelTitle")}>Combination pattern detected</p>
        <p className={css("ftDnaCombo")}>
          <span>London</span>
          <i aria-hidden="true">+</i>
          <span>Confident</span>
          <i aria-hidden="true">+</i>
          <span>Breakout</span>
        </p>
        <ul className={css("ftChips")} style={{ marginTop: 12 }}>
          <li data-accent="mint">Session</li>
          <li data-accent="cyan">Mood</li>
          <li data-accent="violet">Setup</li>
          <li>Instrument</li>
        </ul>
      </div>
    </Panel>
  );
}

/* -- 05 — Psychology Cost Calculator --------------------------------------- */

const EMOTIONS = [
  { label: "Calm", bar: "18%", swatch: "#00ef68" },
  { label: "Confident", bar: "26%", swatch: "#23b9ff" },
  { label: "Anxious", bar: "48%", swatch: "#a18bff" },
  { label: "Revenge", bar: "92%", swatch: "#ff8e7d" },
  { label: "FOMO", bar: "74%", swatch: "#ffc76e" },
  { label: "Greed", bar: "61%", swatch: "#ff9fd0" },
] as const;

function PsychologyVisual() {
  return (
    <Panel
      className={css("ftBarsBlock")}
      caption="Illustration. Bar length is relative cost, deliberately unnumbered — the real figure comes from your own tagged trades, down to the rupee or pip."
    >
      <Art src="/features/art/03_psychology_cost_visual.svg" />

      <div className={css("ftPanel")} style={{ marginTop: 12 }}>
        <p className={css("ftPanelTitle")}>Relative cost by emotional trigger</p>
        <dl className={css("ftBars")}>
          {EMOTIONS.map((row, index) => (
            <div key={row.label} style={vars({ "--i": index })}>
              <dt>{row.label}</dt>
              <dd>
                <span
                  className={css("ftBarTrack")}
                  style={vars({ "--ft-bar": row.bar, "--ft-bar-from": row.swatch, "--ft-bar-to": "rgba(35,185,255,.35)" })}
                >
                  <i />
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <ul className={css("ftChips")} style={{ marginTop: 12 }}>
          <li>No stop loss</li>
          <li>Chased price</li>
          <li>Overleveraged</li>
        </ul>
      </div>
    </Panel>
  );
}

/* -- 06 — Risk Pattern Detection ------------------------------------------- */

const ALERTS = [
  {
    tone: "danger",
    icon: TriangleAlert,
    title: "Tilt spiral",
    body: "Trades taken within minutes of a loss, repeating across the history.",
    rule: "Rule: 30-minute cool-down after any loss",
  },
  {
    tone: "warn",
    icon: CalendarDays,
    title: "Loss clustering",
    body: "Losses grouped by day of week and time of day rather than spread evenly.",
    rule: "Rule: no new positions in the flagged window",
  },
  {
    tone: "info",
    icon: ShieldAlert,
    title: "Size escalation",
    body: "Position size stepping up after a win streak.",
    rule: "Rule: fixed size until the streak closes",
  },
] as const;

function RiskPatternsVisual() {
  return (
    <Panel caption="Illustration of the three pattern classes the scan reports. Each one arrives with a concrete rule suggestion.">
      <ul className={css("ftAlerts")}>
        {ALERTS.map(({ tone, icon: Icon, title, body, rule }) => (
          <li key={title} className={css("ftAlert")} data-tone={tone}>
            <span className={css("ftAlertIcon")} aria-hidden="true">
              <Icon size={17} />
            </span>
            <div>
              <h4>{title}</h4>
              <p>{body}</p>
              <p className={css("ftRule")}>{rule}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* -- 07 — Self-Awareness Score --------------------------------------------- */

function SelfAwarenessVisual() {
  return (
    <Panel caption="The calibration matrix, empty of data: it compares what you said about a trade against what the trade did. The flagged quadrant is the one that reinforces bad habits.">
      <div className={css("ftTableScroll")}>
        <table className={css("ftMatrix")}>
        <caption>Self-review against actual outcome</caption>
        <thead>
          <tr>
            <td />
            <th scope="col">Trade won</th>
            <th scope="col">Trade lost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Would retake</th>
            <td>
              <span className={css("ftCell")}>
                <b>Good process</b>
                <span>Repeat it</span>
              </span>
            </td>
            <td>
              <span className={css("ftCell")}>
                <b>Good process</b>
                <span>Variance, not a mistake</span>
              </span>
            </td>
          </tr>
          <tr>
            <th scope="row">Would not retake</th>
            <td>
              <span className={css("ftCell")} data-flag>
                <b>Won for the wrong reason</b>
                <span>Flagged: bad process, good luck</span>
              </span>
            </td>
            <td>
              <span className={css("ftCell")}>
                <b>Bad process</b>
                <span>The rule to fix</span>
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <ul className={css("ftChips")} style={{ marginTop: 14 }}>
        <li data-accent="mint">Plan adherence %</li>
        <li data-accent="cyan">Most-broken rule</li>
        <li data-accent="violet">Adherence vs. win rate</li>
      </ul>
    </Panel>
  );
}

/* -- 08 — Behavior & Performance Analytics --------------------------------- */

const ANALYTICS_METRICS = [
  ["By dimension", "Setup, session, instrument"],
  ["Drawdown", "Maximum and recovery"],
  ["Calendar", "P&L heatmap"],
  ["Advanced", "Sharpe, profit factor, streaks"],
] as const;

function AnalyticsVisual() {
  return (
    <Panel
      className={css("ftChartBlock")}
      caption="Illustration: an equity curve with a discipline line over it. The axes are intentionally unnumbered — the dashboard draws yours from your own history."
    >
      <div className={css("ftPanel")}>
        <p className={css("ftPanelTitle")}>
          <TrendingUp size={13} aria-hidden="true" /> Equity against discipline
        </p>
        <svg
          className={css("ftChart")}
          viewBox="0 0 600 240"
          role="img"
          aria-label="Illustration of an equity curve rising alongside a discipline trend line."
          focusable="false"
        >
          <defs>
            <linearGradient id="ft-equity-fill" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#00ef68" stopOpacity=".3" />
              <stop offset="1" stopColor="#00ef68" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[40, 90, 140, 190].map((y) => (
            <line key={y} className={css("ftGridLine")} x1="34" x2="586" y1={y} y2={y} />
          ))}
          <line className={css("ftAxis")} x1="34" x2="586" y1="206" y2="206" />

          <path
            className={css("ftArea")}
            fill="url(#ft-equity-fill)"
            d="M40 176 C110 166 150 150 196 142 C250 132 286 142 330 118 C382 90 418 96 466 74 C512 54 546 46 580 36 L580 206 L40 206 Z"
          />
          <path
            className={css("ftLine")}
            style={vars({ "--i": 0 })}
            pathLength={1}
            stroke="#00ef68"
            d="M40 176 C110 166 150 150 196 142 C250 132 286 142 330 118 C382 90 418 96 466 74 C512 54 546 46 580 36"
          />
          <path
            className={css("ftLine")}
            style={vars({ "--i": 1 })}
            pathLength={1}
            stroke="#23b9ff"
            strokeDasharray="1"
            d="M40 190 C112 186 152 172 198 170 C252 168 288 152 332 148 C384 142 420 120 468 112 C514 104 548 88 580 82"
          />

          {[
            [196, 142],
            [330, 118],
            [466, 74],
          ].map(([cx, cy], index) => (
            <circle
              key={cx}
              className={css("ftMarker")}
              style={vars({ "--i": index })}
              cx={cx}
              cy={cy}
              r="4.5"
              fill="#050a15"
              stroke="#00ef68"
              strokeWidth="2"
            />
          ))}
        </svg>
        <ul className={css("ftLegend")}>
          <li>
            <i style={vars({ "--ft-swatch": "#00ef68" })} aria-hidden="true" /> Equity
          </li>
          <li>
            <i style={vars({ "--ft-swatch": "#23b9ff" })} aria-hidden="true" /> Discipline
          </li>
        </ul>
      </div>

      <dl className={css("ftMetrics")}>
        {ANALYTICS_METRICS.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/* -- 10 — AI Coach & Morning Mentor ---------------------------------------- */

const COACH = [
  ["Observation", "Your last four losses all came within fifteen minutes of a previous loss."],
  ["Evidence", "Tagged revenge trades in the journal, with the session and size recorded for each."],
  ["Action", "Set a cool-down rule for the rest of the week and log whether you kept it."],
] as const;

function AiCoachVisual() {
  return (
    <Panel
      className={css("ftCoachBlock")}
      caption="Illustration of the structure every answer follows. The wording here is an example — the real answers are built from your own history."
    >
      <Art src="/features/art/05_ai_coach_insight_cards.svg" />

      <dl className={css("ftCoach")} style={{ marginTop: 12 }}>
        {COACH.map(([label, body], index) => (
          <div key={label} style={vars({ "--i": index })}>
            <dt>{label}</dt>
            <dd>{body}</dd>
          </div>
        ))}
      </dl>

      <div className={css("ftMorning")}>
        <time dateTime="06:00">6am</time>
        <p>
          The Morning Mentor arrives as a push notification referencing your actual streak,
          mistakes and mission progress.
        </p>
      </div>
    </Panel>
  );
}

/* -- 11 — Weekly AI Reports ------------------------------------------------ */

function ReportsVisual() {
  return (
    <Panel caption="Illustration of the weekly report's shape: what worked, what didn't, and one focus. Not a real report.">
      <div className={css("ftReport")}>
        <p className={css("ftReportHead")}>
          <b>Weekly coaching report</b>
          <span>
            <BookOpen size={12} aria-hidden="true" /> Delivered Sunday
          </span>
        </p>

        <dl className={css("ftFocus")}>
          <dt>This week’s one focus</dt>
          <dd>Hold the cool-down rule after every loss — it is the pattern costing you the most.</dd>
        </dl>

        <ul className={css("ftChips")}>
          <li data-accent="mint">What worked</li>
          <li>What didn’t</li>
          <li data-accent="violet">Biggest behavioural pattern</li>
        </ul>

        <div>
          <p className={css("ftPanelTitle")} style={{ marginBottom: 8 }}>
            <CalendarDays size={13} aria-hidden="true" /> Archive
          </p>
          <ul className={css("ftArchive")} aria-label="Report archive, illustrative">
            {["This week", "Last week", "2 weeks ago", "3 weeks ago", "4 weeks ago"].map((week) => (
              <li key={week}>{week}</li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/* -- 13 — Native Android App ----------------------------------------------- */

function AndroidVisual() {
  return (
    <Panel caption="Schematic illustration, not an Android screenshot. It shows the structure described above: the four-tab bottom navigation and the checklist you can complete from the notification shade.">
      <div className={css("ftPhoneRow")}>
        <div className={css("ftPhone")} aria-hidden="true">
          <div className={css("ftPhoneScreen")}>
            <span className={css("ftPhoneBar")} />
            <div className={css("ftPhoneCard")}>
              <b>Dashboard</b>
              <i />
              <i />
            </div>
            <div className={css("ftPhoneCard")}>
              <b>Trading DNA</b>
              <i />
              <i />
            </div>
            <div className={css("ftPhoneCard")}>
              <b>Analytics</b>
              <i />
              <i />
            </div>
            <div className={css("ftPhoneNav")}>
              <span>
                <LayoutGrid size={14} />
              </span>
              <span>
                <BookOpen size={14} />
              </span>
              <span>
                <BarChart3 size={14} />
              </span>
              <span>
                <Smartphone size={14} />
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className={css("ftShade")}>
            <p className={css("ftShadeHead")}>
              <Bell size={12} aria-hidden="true" /> Notification shade
            </p>
            <p>Pre-trade checklist — verify your rules without opening the app.</p>
            <p className={css("ftShadeActions")} aria-hidden="true">
              <span>Open checklist</span>
              <span>Later</span>
            </p>
          </div>

          <div className={css("ftShade")} style={{ marginTop: 10 }}>
            <p className={css("ftShadeHead")}>
              <AlarmClock size={12} aria-hidden="true" /> 6am · Morning Mentor
            </p>
            <p>Your streak, your mistakes and your mission progress, before the session opens.</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* -- 14 — Discipline & Psychology Timeline --------------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;

const SERIES = [
  { label: "Psychology score", colour: "#00ef68", d: "M60 168 L150 158 L240 132 L330 126 L420 96 L510 80" },
  { label: "Discipline %", colour: "#23b9ff", d: "M60 182 L150 164 L240 150 L330 118 L420 104 L510 72" },
  { label: "Average mood", colour: "#a18bff", d: "M60 158 L150 162 L240 140 L330 136 L420 118 L510 108" },
  { label: "Monthly P&L", colour: "#ffc76e", d: "M60 196 L150 198 L240 186 L330 158 L420 138 L510 104" },
] as const;

function TimelineVisual() {
  return (
    <Panel
      className={css("ftChartBlock")}
      caption="Illustration. Four series on one timeline, unnumbered on purpose — the point is the lag between the behavioural lines and the P&L line, not any particular value."
    >
      <div className={css("ftPanel")}>
        <svg
          className={css("ftChart")}
          viewBox="0 0 570 240"
          role="img"
          aria-label="Illustration of psychology score, discipline percentage, average mood and monthly P&L trending upward together across six months, with P&L lagging behind the behavioural lines."
          focusable="false"
        >
          {[60, 100, 140, 180].map((y) => (
            <line key={y} className={css("ftGridLine")} x1="44" x2="540" y1={y} y2={y} />
          ))}
          <line className={css("ftAxis")} x1="44" x2="540" y1="212" y2="212" />

          {SERIES.map((series, index) => (
            <path
              key={series.label}
              className={css("ftLine")}
              style={vars({ "--i": index })}
              pathLength={1}
              stroke={series.colour}
              strokeDasharray="1"
              d={series.d}
            />
          ))}

          {MONTHS.map((month, index) => (
            <text key={month} x={60 + index * 90} y="232" textAnchor="middle">
              {month}
            </text>
          ))}
        </svg>

        <ul className={css("ftLegend")}>
          {SERIES.map((series) => (
            <li key={series.label}>
              <i style={vars({ "--ft-swatch": series.colour })} aria-hidden="true" />
              {series.label}
            </li>
          ))}
        </ul>
      </div>

      <ul className={css("ftChips")} style={{ marginTop: 12 }}>
        <li>Repeated mistakes ranked by frequency</li>
        <li>…and by cost</li>
      </ul>
    </Panel>
  );
}

/* -- dispatcher ------------------------------------------------------------ */

const VISUALS: Record<FeatureId, () => ReactNode> = {
  screenshot: ScreenshotVisual,
  "dual-market": () => (
    <Panel caption="Interactive illustration. The fields and labels are the real ones each mode uses; the values are placeholders.">
      <MarketModeTabs />
    </Panel>
  ),
  journal: JournalVisual,
  "trading-dna": TradingDnaVisual,
  psychology: PsychologyVisual,
  "risk-patterns": RiskPatternsVisual,
  "self-awareness": SelfAwarenessVisual,
  analytics: AnalyticsVisual,
  missions: () => (
    <Panel badge="Demo" caption="Interactive demo. Nothing is saved — the streak and missions reset when you reload.">
      <MissionDemo />
    </Panel>
  ),
  "ai-coach": AiCoachVisual,
  reports: ReportsVisual,
  checklists: () => (
    <Panel badge="Demo" caption="Interactive demo. Ticking these boxes changes nothing and logs no trade.">
      <ChecklistDemo />
    </Panel>
  ),
  android: AndroidVisual,
  "performance-review": TimelineVisual,
};

export function FeatureVisual({ id }: { id: FeatureId }) {
  const Visual = VISUALS[id];
  return <Visual />;
}
