import type { CSSProperties } from "react";
import { PlayCircle } from "lucide-react";

import { WaitlistForm } from "@/components/waitlist/WaitlistForm";
import styles from "./FinalCta.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/** Fixed positions so the server and client markup always match. */
const MOTES = [
  { x: 18, y: 32, size: 3, delay: 0, duration: 17 },
  { x: 36, y: 64, size: 2, delay: 2.6, duration: 20 },
  { x: 62, y: 24, size: 3, delay: 1.3, duration: 15 },
  { x: 74, y: 56, size: 2, delay: 4.1, duration: 19 },
  { x: 47, y: 18, size: 2, delay: 5.4, duration: 22 },
  { x: 86, y: 40, size: 3, delay: 3.2, duration: 18 },
  { x: 28, y: 78, size: 2, delay: 6.5, duration: 16 },
  { x: 57, y: 70, size: 2, delay: 1.9, duration: 21 },
] as const;

export function FinalCta() {
  return (
    <section id="waitlist" className={css("cta")} data-sequence aria-labelledby="cta-title">
      <div className={css("ctaMotes")} aria-hidden="true">
        {MOTES.map((mote) => (
          <span
            key={`${mote.x}-${mote.y}`}
            style={vars({
              "--x": `${mote.x}%`,
              "--y": `${mote.y}%`,
              "--size": `${mote.size}px`,
              "--delay": `${mote.delay}s`,
              "--duration": `${mote.duration}s`,
            })}
          />
        ))}
      </div>

      <div className={css("ctaInner")}>
        {/*
          The form is the point of the page, so it gets its own column and the
          brightest surface in the section. The previous version put it inside
          a 34ch copy column, which squeezed a two-across form into a single
          narrow stack beside an oversized logo.
        */}
        <div className={css("ctaCopy")}>
          <h2 id="cta-title" data-reveal>
            A calmer mind.
            <br />
            <span>A stronger trader.</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".12s" })}>
            Same markets. A better you.
          </p>

          {/* Every "Watch Demo" on the site points at #demo, and #demo was an
              empty screen-reader-only heading: a link that went nowhere. There
              is no recorded demo yet and inventing footage is not an option,
              so the anchor is a real, visible block that says so and offers
              the thing that does exist. */}
          <div
            className={css("ctaDemo")}
            id="demo"
            data-reveal
            style={vars({ "--mo-delay": ".26s" })}
          >
            <span className={css("ctaDemoMark")} aria-hidden="true">
              <PlayCircle size={20} />
            </span>
            <div>
              <h3>Watch the Edgecipline demo</h3>
              <p>
                The walkthrough is being recorded and is not published yet. Join the waitlist and
                it reaches your inbox the day it goes live, along with your early-access invite.
              </p>
            </div>
          </div>

        </div>

        {/* The real form, not a button linking back to this same anchor. Every
            "Join Waitlist" link on the site points at #waitlist, so this is
            where they all land. */}
        <div className={css("ctaForm")} data-reveal style={vars({ "--mo-delay": ".2s" })}>
          <WaitlistForm />
        </div>
      </div>

    </section>
  );
}
