import { HeroScene } from "./HeroScene";
import { MotionContent } from "./MotionContent";
import { PageSky } from "./PageSky";
import { SiteFooter } from "./SiteFooter";
import { Navbar } from "./nav/Navbar";
import { EmotionalLoopSection } from "./EmotionalLoopSection";
import { ChartStorySection } from "./ChartStorySection";
import { BuiltByTradersSection } from "./BuiltByTradersSection";
import { Stage } from "./landing/Stage";
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
 * The landing page.
 *
 * Eleven sections in the approved order, every one of them a Server Component
 * rendered exactly once with its own heading and copy. The motion islands
 * render no markup at all — they only publish scroll, pointer and in-view
 * state for the stylesheets to act on, which is why the page's whole animation
 * layer costs a handful of custom-property writes per frame rather than a
 * React render.
 *
 * The page scrolls normally. An earlier version pinned all eleven sections in
 * one held frame and cross-faded them, with a progress rail down the right
 * edge; that is scroll hijacking of the entire document, it made the hero's
 * call to action wait on a crossfade, and it needed a second permanent column
 * of chrome to navigate. Sections arrive on their own travel through the
 * viewport instead — `StageMotion` still publishes each one's progress, so
 * every section's internal motion is unchanged — and the one navigation is
 * the floating navbar.
 *
 * `PageSky` is deliberately a sibling of the shell rather than a child: it is
 * the one background the whole page shares, and keeping it outside means no
 * clip, containment or stacking context inside the shell can cut into it.
 */
export function EdgeciplineHero() {
  return (
    <>
      <PageSky />
      <div className="site-shell">
        <a className="skip-link" href="#home">
          Skip to content
        </a>

        <RevealObserver />
        <StageMotion count={11} />
        <SceneMotion target="story" scroll={false} pointer />
        <SceneMotion target="trading-dna" scroll={false} pointer />
        <Magnetic />
        <CountUp />
        <Spotlight target="how-it-works" />

        <Navbar />

        <Stage>
          <section id="hero" className="hero" aria-labelledby="hero-title">
            <HeroScene />
            <MotionContent />
          </section>
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

        {/* A named landmark for links that point at it. `#demo` is no longer
            one of these: it is a real, visible block inside the final call to
            action now, because every "Watch Demo" on the site points at it. */}
        <SiteFooter />
      </div>
    </>
  );
}
