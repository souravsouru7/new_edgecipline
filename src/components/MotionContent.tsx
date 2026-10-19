import Image from "next/image";
import { PlayCircle } from "lucide-react";

export function MotionContent() {
  return (
    <div className="hero-copy">
      <p className="eyebrow">AI Trading Journal &amp; Discipline Coach</p>
      {/* Two spans so the headline can stagger line by line, which is as far as
          the splitting goes — no per-word or per-character DOM. */}
      <h1 id="hero-title">
        <span className="line-1">The market moves.</span>
        <br />
        <span className="line-2">Your patterns repeat.</span>
      </h1>
      <p className="summary">Edgecipline is an AI trading journal and discipline coach that helps traders understand their behavior, break bad habits, and build lasting consistency.</p>
      <div className="hero-actions" data-magnet-group>
        <a className="waitlist" href="#waitlist" data-magnetic>Join Waitlist <span aria-hidden="true">→</span></a>
        <a className="demo" href="#demo" data-magnetic>Watch Demo<PlayCircle aria-hidden="true" size={20} /></a>
      </div>
      <div className="proof"><div className="avatar-proof"><Image src="/hero/avatars.webp" alt="" aria-hidden="true" width={1200} height={900} priority sizes="(max-width: 767px) 230px, 280px" /><span className="sr-only">Trusted by more than 10,000 traders.</span></div><p>Built for traders.<br />Backed by real stories.</p></div>
    </div>
  );
}
