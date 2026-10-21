import type { CSSProperties } from "react";
import { BrainCircuit, CloudUpload, TrendingUp } from "lucide-react";
import styles from "./HowItWorks.module.css";

// The CSS module is shared with the existing global selector names.
const css = (name: string) => styles[name] || name;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * The three steps. `step` keys the artwork inside each card; motion.css
 * animates it by that attribute when this section takes the frame.
 */
const steps = [
  { number: "01", title: "Upload Your Trades", description: "Import your trading history in seconds.", icon: CloudUpload, step: "upload" },
  { number: "02", title: "AI Analysis", description: "Our AI analyses your behavior, patterns and emotional triggers.", icon: BrainCircuit, step: "analysis" },
  { number: "03", title: "Learn & Improve", description: "Get personalized insights to build better habits and consistency.", icon: TrendingUp, step: "improve" },
] as const;

/** Where the data motes start before they converge on the AI icon. */
const MOTES = [
  { fx: "-56px", fy: "22px" },
  { fx: "48px", fy: "30px" },
  { fx: "-32px", fy: "-36px" },
  { fx: "38px", fy: "-30px" },
  { fx: "2px", fy: "46px" },
] as const;

/** The step-specific flourish that sits inside each card. */
function StepArt({ step }: { step: (typeof steps)[number]["step"] }) {
  if (step === "upload") {
    return (
      <span className="step-progress" aria-hidden="true">
        <i />
      </span>
    );
  }
  if (step === "analysis") {
    return (
      <span className="step-motes" aria-hidden="true">
        {MOTES.map((mote, index) => (
          <i key={mote.fx + mote.fy} style={vars({ "--i": index, "--fx": mote.fx, "--fy": mote.fy })} />
        ))}
      </span>
    );
  }
  return (
    <span className="step-bars" aria-hidden="true">
      {[0, 1, 2, 3].map((index) => (
        <i key={index} style={vars({ "--i": index })} />
      ))}
    </span>
  );
}

/**
 * Section 05 — How it works.
 *
 * One panel of the stage, so the whole section has to read in a single frame:
 * the three steps sit side by side, arriving left to right as the section
 * takes the frame and carrying the artwork each one had. The connector light
 * walks 01 → 02 → 03 underneath them.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className={css("hiw")} aria-labelledby="how-it-works-heading">
      <div className={css("hiwFrame")}>
        <header className={css("hiwHeader")}>
          <h2 id="how-it-works-heading" data-reveal>How <span>It Works</span></h2>
          <p data-reveal style={vars({ "--mo-delay": ".12s" })}>A simple process. A powerful shift.</p>
        </header>

        <div className={css("hiwConnector")} data-connector aria-hidden="true"><span /></div>

        <ol className={css("hiwSteps")}>
          {steps.map(({ number, title, description, icon: Icon, step }, index) => (
            <li
              key={number}
              className={css("hiwStep")}
              data-step-card
              data-spotlight
              data-reveal
              style={vars({ "--i": index })}
            >
              {/* Pointer spotlight target; the gradient follows --mo-sx/--mo-sy. */}
              <span className="step-spotlight" aria-hidden="true" />
              <span className={css("hiwNumber")} aria-hidden="true">{number}</span>
              <div className={css("hiwIcon")} data-step={step}><Icon aria-hidden="true" size={38} strokeWidth={1.6} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <StepArt step={step} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
