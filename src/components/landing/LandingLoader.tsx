"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const STORY_DURATION = 7200;
const EXIT_DURATION = 650;

export function LandingLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const skip = skipRef.current;
    if (!overlay || !skip) {
      delete document.documentElement.dataset.edgLoading;
      return;
    }

    document.documentElement.dataset.edgLoading = "";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      overlay.hidden = true;
      delete document.documentElement.dataset.edgLoading;
    };
    const exit = () => {
      if (finished) return;
      overlay.classList.add("is-out");
      timers.push(window.setTimeout(finish, EXIT_DURATION));
    };
    const onSkip = () => exit();

    skip.addEventListener("click", onSkip);
    if (reducedMotion) {
      overlay.classList.add("is-reduced");
      timers.push(window.setTimeout(exit, 900));
    } else {
      // The story is intentionally unskippable for its first six seconds.
      timers.push(window.setTimeout(() => skip.classList.add("is-visible"), 6000));
      timers.push(window.setTimeout(exit, STORY_DURATION));
    }

    return () => {
      timers.forEach(window.clearTimeout);
      skip.removeEventListener("click", onSkip);
      delete document.documentElement.dataset.edgLoading;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="edg-cinema"
      role="status"
      aria-label="Edgecipline introduction: from emotional reaction to disciplined execution."
    >
      <div className="edg-cinema__wash" aria-hidden="true" />
      <div className="edg-cinema__grid" aria-hidden="true" />

      <header className="edg-cinema__hud" aria-hidden="true">
        <span>EDG / SIGNAL 01</span>
        <span>BEHAVIOURAL SYSTEM</span>
        <span>07.2 SEC</span>
      </header>

      <div className="edg-cinema__scope" aria-hidden="true">
        <span className="edg-cinema__orbit edg-cinema__orbit--one" />
        <span className="edg-cinema__orbit edg-cinema__orbit--two" />
        <span className="edg-cinema__orbit edg-cinema__orbit--three" />
        <span className="edg-cinema__crosshair" />
        <span className="edg-cinema__core" />
        <svg className="edg-cinema__signal" viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
          <path className="edg-cinema__signal-ghost" d="M0 139 L55 136 L82 66 L113 210 L148 98 L186 173 L222 48 L260 199 L301 82 L340 151 L374 119 L410 142 L449 111 L488 132 L530 116 L574 129 L618 113 L663 122 L709 109 L754 116 L800 101" />
          <path className="edg-cinema__signal-hot" d="M0 139 L55 136 L82 66 L113 210 L148 98 L186 173 L222 48 L260 199 L301 82 L340 151 L374 119 L410 142 L449 111 L488 132 L530 116 L574 129 L618 113 L663 122 L709 109 L754 116 L800 101" />
          <path className="edg-cinema__signal-calm" d="M0 156 C90 151 132 166 206 148 S330 139 401 132 S512 128 588 112 S704 103 800 77" />
        </svg>
        <span className="edg-cinema__scan" />
      </div>

      <div className="edg-cinema__story" aria-hidden="true">
        <section className="edg-cinema__chapter edg-cinema__chapter--one"><small>01 / IMPULSE</small><div>THE MARKET MOVES FAST.</div></section>
        <section className="edg-cinema__chapter edg-cinema__chapter--two"><small>02 / EMOTION</small><div>YOUR MIND MOVES FASTER.</div></section>
        <section className="edg-cinema__chapter edg-cinema__chapter--three"><small>03 / AWARENESS</small><div>THE PATTERN BECOMES VISIBLE.</div></section>
        <section className="edg-cinema__chapter edg-cinema__chapter--four"><small>04 / DISCIPLINE</small><div>CHANGE THE NEXT DECISION.</div></section>
      </div>

      <div className="edg-cinema__brand" aria-hidden="true">
        <Image src="/brand/mark.webp" alt="" width={62} height={78} priority />
        <div><strong>EDGECIPLINE</strong><span>DISCIPLINE OVER EMOTION</span></div>
      </div>

      <footer className="edg-cinema__footer" aria-hidden="true"><span>EMOTION</span><i><b /></i><span>DISCIPLINE</span></footer>
      <button ref={skipRef} className="edg-cinema__skip" type="button">Enter site</button>
    </div>
  );
}
