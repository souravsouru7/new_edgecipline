"use client";

import { useState } from "react";

import {
  BILLING_MODES,
  DEFAULT_BILLING,
  availableBillingModes,
  type BillingMode,
} from "./pricing-data";

/**
 * The Monthly / Yearly selector.
 *
 * It is a real radio group, but it can only switch to a mode that every plan
 * actually has a price for. Today that is Yearly alone, so Monthly renders
 * disabled rather than switching to prices that do not exist. Add the monthly
 * prices in pricing-data.ts and it starts working with no change here.
 *
 * Switching sets `data-billing` on the section; the cards render one price per
 * mode and CSS shows the selected one, which keeps the prices themselves in
 * server-rendered markup.
 */
export function BillingToggle({ target }: { target: string }) {
  const [active, setActive] = useState<BillingMode>(DEFAULT_BILLING);
  const available = availableBillingModes();

  const select = (mode: BillingMode) => {
    if (!available.includes(mode)) return;
    setActive(mode);
    document.getElementById(target)?.setAttribute("data-billing", mode);
  };

  return (
    <div className="prBilling" role="radiogroup" aria-label="Billing period">
      {BILLING_MODES.map((mode) => {
        const enabled = available.includes(mode.id);
        const current = mode.id === active;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={current}
            aria-disabled={enabled ? undefined : true}
            data-active={current ? "" : undefined}
            className="prBillingOption"
            onClick={() => select(mode.id)}
          >
            {mode.label}
            {mode.note ? <span className="prBillingNote">{mode.note}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
