"use client";

import { useRef, useState } from "react";

import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;

/**
 * Feature 02 — the two market modes, side by side.
 *
 * The point of the feature is that the *fields and labels* differ between
 * Forex and the Indian market, so the panels show exactly that: pips and lots
 * against strike, expiry and lot size, with the currency label following the
 * mode. Values are placeholders and the panel says so — nothing here is
 * presented as a real account.
 *
 * Proper tabs: `role="tablist"` with arrow-key and Home/End navigation, one
 * tab in the tab order at a time, and the panel labelled by its tab.
 */
type Mode = {
  id: "forex" | "india";
  label: string;
  platforms: string;
  currency: string;
  rows: ReadonlyArray<readonly [string, string]>;
  brokers: readonly string[];
};

const MODES: readonly Mode[] = [
  {
    id: "forex",
    label: "Forex",
    platforms: "MT5 now · MT4 and cTrader planned",
    currency: "Pips · lots",
    rows: [
      ["Pair", "EUR/USD"],
      ["Direction", "Buy"],
      ["Lot size", "0.40"],
      ["Entry / exit", "1.0824 → 1.0851"],
      ["Result", "+27 pips"],
    ],
    brokers: ["MT5"],
  },
  {
    id: "india",
    label: "Indian Market",
    platforms: "NIFTY / BANKNIFTY / options / intraday equity",
    currency: "Rupees · lot size",
    rows: [
      ["Instrument", "BANKNIFTY"],
      ["Strike", "48,500 CE"],
      ["Expiry", "Weekly"],
      ["Lot size", "15 × 2"],
      ["Result", "₹ +1,240"],
    ],
    brokers: ["Zerodha", "Upstox", "Angel One", "Dhan", "Groww", "Fyers", "5paisa"],
  },
] as const;

export function MarketModeTabs() {
  const [active, setActive] = useState<Mode["id"]>("forex");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number) => {
    const mode = MODES[(index + MODES.length) % MODES.length];
    setActive(mode.id);
    tabs.current[MODES.indexOf(mode)]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: MODES.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  const mode = MODES.find((candidate) => candidate.id === active) ?? MODES[0];

  return (
    <div>
      <div className={css("ftTabs")} role="tablist" aria-label="Market mode">
        {MODES.map((candidate, index) => (
          <button
            key={candidate.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`ft-mode-${candidate.id}`}
            aria-selected={candidate.id === active}
            aria-controls={`ft-mode-panel-${candidate.id}`}
            tabIndex={candidate.id === active ? 0 : -1}
            onClick={() => setActive(candidate.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {candidate.label}
          </button>
        ))}
      </div>

      <div
        className={css("ftTabPanel")}
        role="tabpanel"
        id={`ft-mode-panel-${mode.id}`}
        aria-labelledby={`ft-mode-${mode.id}`}
        tabIndex={-1}
      >
        <div className={css("ftPanel")}>
          <p className={css("ftPanelTitle")}>
            {mode.label} mode · {mode.currency}
          </p>
          <dl className={css("ftRows")} aria-label={`${mode.label} journal fields`}>
            {mode.rows.map(([label, value]) => (
              <div key={label} role="group">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={css("ftPanel")} style={{ marginTop: 10 }}>
          <p className={css("ftPanelTitle")}>Detected from your screenshot</p>
          <ul className={css("ftChips")}>
            {mode.brokers.map((broker) => (
              <li key={broker} data-accent={mode.id === "forex" ? "cyan" : "mint"}>
                {broker}
              </li>
            ))}
          </ul>
          <p className={css("ftVisualCaption")}>{mode.platforms}</p>
        </div>
      </div>
    </div>
  );
}
