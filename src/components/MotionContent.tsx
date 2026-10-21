import { PlayCircle } from "lucide-react";

/**
 * The hero's copy.
 *
 * The eyebrow keywords used to be a column floated against the right edge of
 * the hero and `display: none` below 1100px, which meant the approved eyebrow
 * copy — "Awareness · Clarity · Better habits · Discipline · Consistency" —
 * was invisible to every phone and tablet visitor. It is a real line of text
 * at the top of the copy column now, at every width.
 *
 * Two things the previous version carried are deliberately gone:
 *
 *   * "Trusted by more than 10,000 traders.", which was `sr-only`. It is an
 *     unverified quantitative claim, and announcing it only to screen-reader
 *     users is worse than showing it, not better.
 *   * The row of avatar portraits beside "Built for traders." They are stock
 *     faces, and set next to that sentence they read as customers. There are
 *     no customers to show yet.
 *
 * The approved wording stays exactly as written; what is removed is the
 * invented evidence that was decorating it.
 *
 * Nothing here carries `data-reveal`. The hero's entrance is a pure-CSS
 * sequence in app/motion.css, which runs on first paint; adding the reveal
 * observer on top would hide each line until hydration and then animate it a
 * second time.
 */
const KEYWORDS = ["Awareness", "Clarity", "Better habits", "Discipline", "Consistency"];

export function MotionContent() {
  return (
    <div className="hero-copy">
      <ul className="hero-keywords">
        {KEYWORDS.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>

      <p className="eyebrow">
        AI Trading Journal &amp; Discipline Coach
      </p>

      {/* Two spans so the headline can stagger line by line, which is as far
          as the splitting goes — no per-word or per-character DOM. */}
      <h1 id="hero-title">
        <span className="line-1">The market moves.</span>
        <br />
        <span className="line-2">Your patterns repeat.</span>
      </h1>

      <p className="summary">
        Edgecipline is an AI trading journal and discipline coach that helps traders understand
        their behavior, break bad habits, and build lasting consistency.
      </p>

      <div className="hero-actions" data-magnet-group>
        <a className="waitlist" href="#waitlist" data-magnetic>
          Join Waitlist <span aria-hidden="true">→</span>
        </a>
        <a className="demo" href="#demo" data-magnetic>
          Watch Demo
          <PlayCircle aria-hidden="true" size={20} />
        </a>
      </div>

      <p className="proof">
        Built for traders.
        <br />
        Backed by real stories.
      </p>
    </div>
  );
}
