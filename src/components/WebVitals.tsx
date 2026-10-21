"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Core Web Vitals reporting.
 *
 * This exists because of a specific open question: the intro loader runs for
 * four seconds, and the only way to settle whether that costs anything in the
 * field is to watch LCP from real devices rather than argue about it. Lab
 * numbers already say it does not — Chrome records the hero headline as the
 * LCP element at about 1.3s, while the overlay is still covering it, because
 * LCP ignores occlusion. Field data is what confirms that holds on real
 * phones and real networks.
 *
 * There is no analytics vendor wired up and none is added here. The metrics
 * go to the console in development and nowhere in production, which is the
 * honest state of things: the hook is in place, the destination is a decision
 * for whoever owns the analytics account.
 *
 * To send them somewhere, replace the body of the callback. The shape Vercel
 * Speed Insights, GA4 and most collectors expect is the `metric` object as-is:
 *
 *   navigator.sendBeacon("/api/vitals", JSON.stringify(metric))
 *
 * `sendBeacon` rather than `fetch`, because the last metric is reported as the
 * page is being unloaded and a normal request is cancelled at that point.
 *
 * The component renders nothing and holds no state, so it costs one hook in
 * the root layout and no markup.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[web-vitals] ${metric.name}`, Math.round(metric.value), metric.rating ?? "");
    }
  });

  return null;
}
