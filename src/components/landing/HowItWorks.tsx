import type { CSSProperties } from "react";
import Image from "next/image";
import { BrainCircuit, CloudUpload, TrendingUp } from "lucide-react";
import styles from "./HowItWorks.module.css";

// The CSS module is shared with the existing global selector names.
const css = (name: string) => styles[name] || name;

const vars = (value: Record<string, string | number>) => value as CSSProperties;

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

export function HowItWorks() {
  return <section id="how-it-works" className={css("section")} aria-labelledby="how-it-works-heading">
    <div className={css("backgroundMotion")} data-bg-layer aria-hidden="true"><Image className={css("background")} src="/images/how-it-works/background-scene.webp" alt="" fill sizes="100vw" /></div>
    <div className={css("shade")} aria-hidden="true" />
    <div className={css("inner")}>
      <header className={css("header")}><h2 id="how-it-works-heading" data-reveal>How <span>It Works</span></h2><p data-reveal style={vars({ "--mo-delay": ".12s" })}>A simple process. A powerful shift.</p></header>
      <div className={css("connector")} data-connector aria-hidden="true"><span /></div>
      <ol className={css("steps")}>{steps.map(({ number, title, description, icon: Icon, step }, index) => <li key={number} data-step-card data-spotlight data-reveal style={vars({ "--i": index })}>
        {/* Pointer spotlight target; the gradient follows --mo-sx/--mo-sy. */}
        <span className="step-spotlight" aria-hidden="true" />
        <span className={css("number")}>{number}</span>
        <div className={css("icon")} data-step={step}><Icon aria-hidden="true" size={36} strokeWidth={1.7} /></div>
        <h3>{title}</h3>
        <p>{description}</p>
        <StepArt step={step} />
      </li>)}</ol>
    </div>
  </section>;
}
