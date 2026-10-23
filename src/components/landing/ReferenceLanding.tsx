"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BarChart3, BrainCircuit, ChartNoAxesColumnIncreasing, Check,
  ChevronDown, CirclePlay, ClipboardList, Heart, Menu, ShieldCheck,
  Sparkles, Target, X,
} from "lucide-react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import { HomepageMotion } from "./HomepageMotion";
import { InteractiveTerrain } from "./InteractiveTerrain";
import { ThemeToggle } from "./ThemeToggle";
import { LandingLoader } from "./LandingLoader";
import { TypedHeadline } from "./TypedHeadline";
import {
  BuiltByTradersContent,
  ChartStoryContent,
  EmotionalLoopContent,
  JourneyContent,
  TradingDnaContent,
  WeeklyReflectionContent,
} from "./RestoredContent";

const nav = [
  ["Home", "#home"], ["Features", "/features"], ["Pricing", "/pricing"],
  ["About", "/about"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Contact", "/contact"],
] as const;

const plans: ReadonlyArray<{ name: string; price: string; period: string; popular?: boolean; features: readonly string[] }> = [
  { name: "Starter", price: "₹349", period: "/ month", features: ["Trading Journal", "Basic AI Insights", "Weekly Reflections", "Community Access"] },
  { name: "Pro", price: "₹899", period: "/ 3 months", popular: true, features: ["Advanced AI Analysis", "Trading DNA Report", "Personalized Coaching", "Priority Support"] },
  { name: "Ultimate", price: "₹1,499", period: "/ 6 months", features: ["Full AI Coach Access", "Deep Behavior Analysis", "Advanced Analytics", "Early Access to New Features"] },
];

const faq = [
  ["What is Edgecipline?", "Edgecipline is an AI trading journal and discipline coach that helps traders understand their behavior, break bad habits, and build lasting consistency."],
  ["How does the AI analysis work?", "Edgecipline analyses your logged trades to help you spot behavior patterns and emotional triggers, then turns those patterns into practical insights."],
  ["Is my trading data secure?", "The trading product is in pre-launch. Product trade-data storage details will be confirmed before launch. Our Privacy Policy explains how information submitted through this website is handled."],
  ["Who is this for?", "It is built for traders who want to understand their decisions, build better habits, and approach the same markets with a calmer mind."],
  ["When will it be available?", "Edgecipline is in private early access. Join the waitlist for availability updates and an invitation when access opens."],
] as const;

function Logo() {
  return (
    <Link href="#home" className="edg-logo" aria-label="Edgecipline home">
      <Image src="/brand/mark.webp" alt="" width={36} height={45} priority />
      <span>
        <strong><span className="edg-logo-edge">EDGE</span><span className="edg-logo-cipline">CIPLINE</span></strong>
        <small>DISCIPLINE OVER EMOTION</small>
      </span>
    </Link>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="edg-section-label"><span className="edg-label-line" /><span>{number} / {children}</span></div>;
}

function PlayButton({ onClick }: { onClick: () => void }) {
  return <button type="button" className="edg-play-button" onClick={onClick}><span><CirclePlay size={23} strokeWidth={1.5} /></span>Watch Demo</button>;
}

function PerformanceCard() {
  return (
    <div className="edg-performance-card" aria-label="Illustrative performance dashboard">
      <div className="edg-chart-top"><div className="edg-chart-tabs"><span className="active">Performance</span><span>Risk</span><span>Discipline</span></div><span className="edg-chart-filter">Last 6 Months <ChevronDown size={12}/></span></div>
      <div className="edg-chart-area">
        <svg viewBox="0 0 580 190" preserveAspectRatio="none" role="img" aria-label="Illustrative rising performance chart from January through June">
          <defs><linearGradient id="edgChartFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#1b9561" stopOpacity=".37"/><stop offset="1" stopColor="#1b9561" stopOpacity="0"/></linearGradient></defs>
          <path className="edg-performance-fill" d="M0 156 C45 149 62 127 111 121 S165 90 208 102 S286 113 324 87 S382 101 435 93 S523 53 580 32 L580 190 L0 190 Z" fill="url(#edgChartFill)"/>
          <path className="edg-performance-line" d="M0 156 C45 149 62 127 111 121 S165 90 208 102 S286 113 324 87 S382 101 435 93 S523 53 580 32" pathLength={1} fill="none" stroke="#228d60" strokeWidth="2.5"/>
          {[0,111,208,324,435,580].map((x,i) => <circle className="edg-performance-point" key={x} cx={x} cy={[156,121,102,87,93,32][i]} r="4" fill="#09291d"/>)}
        </svg>
        <div className="edg-chart-callout">Better Decisions<br/><strong>+32%</strong></div>
      </div>
      <div className="edg-months"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
      <div className="edg-chart-metrics"><div><strong>78% <span>↑</span></strong><small>Discipline Score</small></div><div><strong className="edg-negative">-42% <span>↓</span></strong><small>Revenge Trades</small></div><div><strong>2.4x <span>↑</span></strong><small>More Consistent</small></div></div>
    </div>
  );
}

export function ReferenceLanding() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [dialogMode, setDialogMode] = useState<"waitlist" | "demo" | "login">("waitlist");
  const [menuOpen, setMenuOpen] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const pricingView = useRef<HTMLDivElement>(null);

  const changeBilling = (next: "monthly" | "yearly") => {
    if (next === billing) return;
    const view = pricingView.current;
    if (view && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      view.style.height = `${view.getBoundingClientRect().height}px`;
      view.style.overflow = "hidden";
    }
    setBilling(next);
  };

  useLayoutEffect(() => {
    const view = pricingView.current;
    if (!view?.style.height) return;
    const nextHeight = view.firstElementChild?.getBoundingClientRect().height;
    if (nextHeight === undefined) return;
    const frame = requestAnimationFrame(() => { view.style.height = `${nextHeight}px`; });
    const reset = () => { view.style.height = ""; view.style.overflow = ""; };
    const timer = window.setTimeout(reset, 520);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); };
  }, [billing]);

  const showDialog = (mode: "waitlist" | "demo" | "login") => {
    setDialogMode(mode);
    setMenuOpen(false);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  return (
    <>
      <LandingLoader />
      <div className="edg-page" id="home">
      <HomepageMotion />
      <a className="edg-skip" href="#main-content">Skip to content</a>
      <header className="edg-header">
        <span className="edg-scroll-progress" aria-hidden="true" />
        <div className="edg-header-inner">
          <Logo />
          <nav className="edg-nav" aria-label="Main navigation">{nav.map(([label, href]) => <a key={label} href={href} aria-current={label === "Home" ? "page" : undefined}>{label}</a>)}</nav>
          <div className="edg-header-actions"><ThemeToggle /><button className="edg-login" type="button" onClick={() => showDialog("login")}>Log in</button><button className="edg-button edg-button-small" type="button" onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={15}/></button></div>
          <div className="edg-header-mobile-actions"><ThemeToggle /><button className="edg-menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
        </div>
        {menuOpen && <nav className="edg-mobile-nav" aria-label="Mobile navigation">{nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<button type="button" onClick={() => showDialog("login")}>Log in</button><button type="button" onClick={() => showDialog("waitlist")}>Join Waitlist →</button></nav>}
      </header>

      <main id="main-content" className="edg-main">
        <section className="edg-hero" aria-labelledby="edg-hero-title">
          <div className="edg-hero-copy">
            <p className="edg-eyebrow">AI TRADING JOURNAL &amp; DISCIPLINE COACH</p>
            <h1 id="edg-hero-title">
              <TypedHeadline />
            </h1>
            <p className="edg-hero-description">Journal, analyze, and build better habits with AI-powered insights. Turn your trading data into real progress.</p>
            <div className="edg-hero-actions"><button className="edg-button" type="button" onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={18}/></button><PlayButton onClick={() => showDialog("demo")}/></div>
          </div>
          <div className="edg-hero-art" aria-hidden="true"><span className="edg-hero-landscape"><Image src="/landing/halftone-landscape.svg" alt="" fill priority sizes="(max-width: 800px) 100vw, 55vw"/></span><InteractiveTerrain/><div className="edg-awareness"><span>AWARENESS</span><span>CLARITY</span><span>BETTER HABITS</span><span>DISCIPLINE</span><span>CONSISTENCY</span></div><p>SAME MARKETS.<br/>A <b>CALMER,<br/>STRONGER<br/>TRADER.</b></p></div>
        </section>

        <section className="edg-stats" aria-label="Edgecipline in numbers"><div><strong data-edg-count="10" data-edg-format="thousands" data-edg-final="10K+" aria-label="10K+">10K+</strong><span>Active Traders</span></div><div><strong data-edg-count="500" data-edg-format="thousands" data-edg-final="500K+" aria-label="500K+">500K+</strong><span>Trades Journaled</span></div><div><strong data-edg-count="4.8" data-edg-format="rating" data-edg-final="4.8/5" aria-label="4.8 out of 5">4.8/5</strong><span>App Rating</span></div><div><strong data-edg-count="150" data-edg-format="integer" data-edg-final="150+" aria-label="150+">150+</strong><span>Countries</span></div></section>

        <EmotionalLoopContent />
        <ChartStoryContent />
        <BuiltByTradersContent />

        <section className="edg-section edg-process" id="how-it-works" aria-labelledby="edg-process-title">
          <div className="edg-section-intro"><SectionLabel number="04">A SMARTER WAY</SectionLabel><h2 id="edg-process-title">TURN YOUR<br/>TRADES INTO<br/><em>REAL PROGRESS.</em></h2><p>Log your trades, thoughts and emotions in seconds. Get clear insights, identify patterns and improve over time.</p><a className="edg-text-link" href="/features">Explore all features <ArrowRight size={14}/></a></div>
          <div className="edg-step-cards"><article><span className="edg-step-number">01</span><div className="edg-icon"><ClipboardList size={27}/></div><small>Upload Your Trades</small><h3>Journal Easily</h3><p>Import your trading history in seconds.</p><a href="/features" aria-label="Explore journal features"><ArrowRight size={16}/></a></article><article><span className="edg-step-number">02</span><div className="edg-icon"><ChartNoAxesColumnIncreasing size={27}/></div><small>AI Analysis</small><h3>AI Insights</h3><p>Our AI analyses your behavior, patterns and emotional triggers.</p><a href="/features" aria-label="Explore AI insights"><ArrowRight size={16}/></a></article><article><span className="edg-step-number">03</span><div className="edg-icon"><Target size={27}/></div><small>Learn &amp; Improve</small><h3>Build Habits</h3><p>Get personalized insights to build better habits and consistency.</p><a href="/features" aria-label="Explore habit tools"><ArrowRight size={16}/></a></article></div>
        </section>

        <section className="edg-section edg-insights" id="insights" aria-labelledby="edg-insights-title"><div className="edg-section-intro"><SectionLabel number="05">REAL INSIGHTS</SectionLabel><h2 id="edg-insights-title">SEE THE FULL<br/><em>PICTURE.</em></h2><p>Your trading data reveals more than numbers. Edgecipline turns it into clear, actionable insights so you can grow with discipline.</p><a className="edg-outline-button" href="#how-it-works">See how it works <ArrowRight size={16}/></a></div><PerformanceCard/></section>

        <section className="edg-section edg-coach" id="ai-coach" aria-labelledby="edg-coach-title"><div className="edg-section-intro"><SectionLabel number="06">YOUR AI COACH</SectionLabel><h2 id="edg-coach-title">A COACH THAT<br/>UNDERSTANDS <em>YOU.</em></h2><p>Get personalized feedback, identify emotional triggers and build habits that actually stick.</p><a className="edg-outline-button" href="/features">Meet your AI Coach <ArrowRight size={16}/></a></div><div className="edg-coach-messages"><article><span className="edg-icon"><ClipboardList size={24}/></span><p>You took 3 trades after a loss.<br/><strong>Try following your plan.</strong></p><small>10:24 AM</small></article><article><span className="edg-icon"><BarChart3 size={24}/></span><p>Your win rate is higher when you<br/>trade during London session.</p><small>Yesterday</small></article><article><span className="edg-icon"><BrainCircuit size={24}/></span><p>You’re more consistent this week.<br/><strong>Keep it up! 🚀</strong></p><small>Today</small></article></div></section>

        <TradingDnaContent />
        <WeeklyReflectionContent />
        <JourneyContent />

        <section className="edg-section edg-features" aria-labelledby="edg-features-title"><div className="edg-section-intro"><SectionLabel number="10">BUILT FOR REAL TRADERS</SectionLabel><h2 id="edg-features-title">EVERYTHING YOU NEED.<br/><em>NOTHING YOU DON’T.</em></h2><p>Practical tools to help you stay accountable, in control and focused on long-term growth.</p></div><div className="edg-feature-grid"><div><span className="edg-icon"><Heart size={25}/></span><p><strong>Emotion Tracking</strong><small>Understand your mindset</small></p></div><div><span className="edg-icon"><Sparkles size={25}/></span><p><strong>Trading DNA</strong><small>Know your trading style</small></p></div><div><span className="edg-icon"><ShieldCheck size={25}/></span><p><strong>Risk Management</strong><small>Stay in control</small></p></div><div><span className="edg-icon"><BrainCircuit size={25}/></span><p><strong>Personalized Guidance</strong><small>Tips that actually help</small></p></div></div></section>

        <section className="edg-section edg-pricing" id="pricing" aria-labelledby="edg-pricing-title">
          <div className="edg-section-intro"><SectionLabel number="11">PRICING</SectionLabel><h2 id="edg-pricing-title">SIMPLE. TRANSPARENT.<br/><em>CHOOSE YOUR PATH.</em></h2><p>Start small. Upgrade anytime.</p></div>
          <div className="edg-pricing-content">
            <div className="edg-billing" role="group" aria-label="Billing term">
              <button className={billing === "monthly" ? "active" : ""} type="button" aria-pressed={billing === "monthly"} onClick={() => changeBilling("monthly")}>Monthly</button>
              <button className={billing === "yearly" ? "active" : ""} type="button" aria-pressed={billing === "yearly"} onClick={() => changeBilling("yearly")}>Yearly</button>
            </div>
            <div className="edg-pricing-view" ref={pricingView}>
              {billing === "monthly" ? (
                <div className="edg-plan-grid">
                  {plans.map((plan) => <article key={plan.name} className={plan.popular ? "edg-plan popular" : "edg-plan"}>{plan.popular && <span className="edg-popular">MOST POPULAR</span>}<small>{plan.name}</small><div className="edg-plan-price"><strong>{plan.price}</strong><span>{plan.period}</span></div><ul>{plan.features.map((item) => <li key={item}><Check size={13}/>{item}</li>)}</ul><button type="button" className={plan.popular ? "edg-button" : "edg-outline-button"} onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={15}/></button></article>)}
                </div>
              ) : (
                <div className="edg-yearly-message"><strong>Yearly plans are coming.</strong><p>Join the waitlist to get the confirmed annual options when early access opens.</p><button className="edg-button" type="button" onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={16}/></button></div>
              )}
            </div>
          </div>
        </section>

        <section className="edg-section edg-faq" id="faq" aria-labelledby="edg-faq-title"><div className="edg-section-intro"><SectionLabel number="12">FAQ</SectionLabel><h2 id="edg-faq-title">FREQUENTLY<br/>ASKED <em>QUESTIONS.</em></h2><p>Everything you need to know.</p></div><div className="edg-faq-list">{faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

        <section className="edg-final" id="waitlist" aria-labelledby="edg-final-title"><div className="edg-final-art" aria-hidden="true"/><span className="edg-final-kicker">JOIN THE MOVEMENT</span><h2 id="edg-final-title">A CALMER MIND.<br/>A <em>STRONGER TRADER.</em></h2><p>Same markets. A better you.</p><div><button className="edg-button" type="button" onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={17}/></button><PlayButton onClick={() => showDialog("demo")}/></div></section>
      </main>

      <footer className="edg-footer"><Logo/><nav aria-label="Footer navigation">{nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav><div className="edg-footer-social"><a href="/contact" aria-label="Contact Edgecipline">✉</a><a href="/blog" aria-label="Edgecipline blog">◉</a><a href="/faq" aria-label="Help and FAQ">?</a></div><p>© 2026 Edgecipline. All rights reserved.<br/>Built for traders, worldwide.</p></footer>

      <dialog className="edg-dialog" ref={dialog} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}><button type="button" className="edg-dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}><X size={19}/></button>{dialogMode === "waitlist" ? <><h2>Join the Edgecipline waitlist</h2><p>Get early access updates and an invitation when the product opens.</p><WaitlistForm/></> : dialogMode === "demo" ? <><span className="edg-dialog-icon"><CirclePlay size={29}/></span><h2>Watch the Edgecipline demo</h2><p>The walkthrough is being recorded. Join the waitlist and we’ll let you know when it is ready.</p><button className="edg-button" type="button" onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={16}/></button></> : <><h2>Log in</h2><p>Accounts open with early access. Join the waitlist to get your invitation.</p><button className="edg-button" type="button" onClick={() => showDialog("waitlist")}>Join Waitlist <ArrowRight size={16}/></button></>}</dialog>
      </div>
    </>
  );
}
