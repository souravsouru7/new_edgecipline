import { HeroScene } from "./HeroScene";
import { MobileNav } from "./MobileNav";
import { MotionContent } from "./MotionContent";
import { SidebarNav } from "./SidebarNav";
import { EmotionalLoopSection } from "./EmotionalLoopSection";
import { ChartStorySection } from "./ChartStorySection";
import { BuiltByTradersSection } from "./BuiltByTradersSection";
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
import { ScrollState } from "./motion/ScrollState";
import { SceneMotion } from "./motion/SceneMotion";
import { Spotlight } from "./motion/Spotlight";

/**
 * The page shell. Everything visible here is a Server Component; the motion
 * islands below render no markup at all — they only publish scroll, pointer
 * and in-view state for motion.css to act on.
 */
export function EdgeciplineHero() {
  return (
    <div className="site-shell">
      <RevealObserver />
      <ScrollState />
      <SceneMotion target="home" mode="exit" pointer />
      <SceneMotion target="emotional-loop" />
      <SceneMotion target="chart-story" />
      <SceneMotion target="story" pointer />
      <SceneMotion target="how-it-works" />
      <SceneMotion target="trading-dna" pointer />
      <SceneMotion target="reflection" />
      <SceneMotion target="journey" />
      <SceneMotion target="pricing" />
      <SceneMotion target="waitlist" />
      <Magnetic />
      <CountUp />
      <Spotlight target="how-it-works" />

      <SidebarNav />
      <MobileNav />
      <main id="home" className="hero" aria-labelledby="hero-title">
        <HeroScene />
        <MotionContent />
      </main>
      <EmotionalLoopSection />
      <ChartStorySection />
      <BuiltByTradersSection />
      <HowItWorks />
      <section className="sr-only" id="ai-coach"><h2>AI Coach</h2></section>
      <TradingDNA />
      <WeeklyReflection />
      <Journey />
      <Pricing />
      <Faq />
      <FinalCta />
      <section className="sr-only" id="demo"><h2>Watch the Edgecipline demo</h2></section>
    </div>
  );
}
