import { HeroScene } from "./HeroScene";
import { MobileNav } from "./MobileNav";
import { MotionContent } from "./MotionContent";
import { PageSky } from "./PageSky";
import { SidebarNav } from "./SidebarNav";
import { EmotionalLoopSection } from "./EmotionalLoopSection";
import { ChartStorySection } from "./ChartStorySection";
import { BuiltByTradersSection } from "./BuiltByTradersSection";
import { Stage, type StagePanel } from "./landing/Stage";
import { HowItWorks } from "./landing/HowItWorks";
import { TradingDNA } from "./sections/TradingDNA";
import { WeeklyReflection } from "./sections/WeeklyReflection";
import { Journey } from "./sections/Journey";
import { Pricing } from "./sections/Pricing";
import { Faq } from "./sections/Faq";
import { FinalCta } from "./sections/FinalCta";
import { CountUp } from "./motion/CountUp";
import { Magnetic } from "./motion/Magnetic";
import { RevealObserver } from "./motion/RevealObserver";
import { SceneMotion } from "./motion/SceneMotion";
import { StageMotion } from "./motion/StageMotion";
import { Spotlight } from "./motion/Spotlight";

/**
 * The eleven panels of the stage, in order. The ids are the sections' own —
 * the ones the sidebar, the waitlist buttons and every in-page link already
 * point at — and the labels are what the progress rail calls them.
 *
 * This list has to stay in step with two other places: the children of
 * `<Stage>` below, and the `SCENES` array in PageSky, which holds each
 * section's backdrop artwork.
 */
const PANELS: StagePanel[] = [
  { id: "home", label: "Home" },
  { id: "emotional-loop", label: "The loop" },
  { id: "chart-story", label: "The story" },
  { id: "story", label: "Built by traders" },
  { id: "how-it-works", label: "How it works" },
  { id: "trading-dna", label: "Trading DNA" },
  { id: "reflection", label: "Reflection" },
  { id: "journey", label: "Journey" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "waitlist", label: "Join" },
];

/**
 * The page shell. Everything visible here is a Server Component; the motion
 * islands below render no markup at all — they only publish scroll, pointer
 * and in-view state for the stylesheets to act on.
 *
 * `PageSky` is deliberately a sibling of the shell rather than a child: it is
 * the one background the whole page shares, and keeping it outside means no
 * clip, containment or stacking context inside the shell can cut into it.
 *
 * `Stage` is the frame all eleven sections take in turn. `StageMotion` drives
 * it and publishes each panel's own `--mo-progress`, which is why the
 * individual `SceneMotion` islands below no longer measure scroll — they are
 * kept only for the three sections that track the pointer.
 */
export function EdgeciplineHero() {
  return (
    <>
    <PageSky />
    <div className="site-shell">
      <RevealObserver />
      <StageMotion count={PANELS.length} />
      <SceneMotion target="home" scroll={false} pointer />
      <SceneMotion target="story" scroll={false} pointer />
      <SceneMotion target="trading-dna" scroll={false} pointer />
      <Magnetic />
      <CountUp />
      <Spotlight target="how-it-works" />

      <SidebarNav />
      <MobileNav />

      <Stage panels={PANELS}>
        <main id="home" className="hero" aria-labelledby="hero-title">
          <HeroScene />
          <MotionContent />
        </main>
        <EmotionalLoopSection />
        <ChartStorySection />
        <BuiltByTradersSection />
        <HowItWorks />
        <TradingDNA />
        <WeeklyReflection />
        <Journey />
        <Pricing />
        <Faq />
        <FinalCta />
      </Stage>

      {/* Named landmarks for links that point at them; they carry no layout
          of their own, so they stay outside the frame. */}
      <section className="sr-only" id="ai-coach"><h2>AI Coach</h2></section>
      <section className="sr-only" id="demo"><h2>Watch the Edgecipline demo</h2></section>
    </div>
    </>
  );
}
