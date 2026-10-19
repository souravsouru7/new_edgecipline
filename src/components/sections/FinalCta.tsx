import type { CSSProperties } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

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
      <div className={css("ctaBackdrop")} aria-hidden="true">
        <Image src="/loop/mountains.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={css("ctaMoon")} aria-hidden="true" />
      <div className={css("ctaFigure")} aria-hidden="true">
        <Image src="/hero/trader.webp" alt="" width={900} height={1350} sizes="(max-width: 767px) 20vw, 150px" />
      </div>
      <div className={css("ctaVeil")} aria-hidden="true" />
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
        <div className={css("ctaCopy")}>
          <h2 id="cta-title" data-reveal>
            A calmer mind.
            <br />
            <span>A stronger trader.</span>
          </h2>
          <p data-reveal style={vars({ "--mo-delay": ".12s" })}>
            Same markets. A better you.
          </p>
          <div
            className={css("ctaActions")}
            data-magnet-group
            data-reveal
            style={vars({ "--mo-delay": ".2s" })}
          >
            <a className="waitlist" href="#waitlist" data-magnetic>
              Join Waitlist <span aria-hidden="true">→</span>
            </a>
            <a className="demo" href="#demo" data-magnetic>
              Watch Demo
              <PlayCircle aria-hidden="true" size={18} />
            </a>
          </div>
        </div>

        <div className={css("ctaBrand")} data-reveal style={vars({ "--mo-delay": ".26s" })}>
          <Image src="/hero/logo.webp" alt="Edgecipline" width={440} height={330} sizes="200px" />
          <p className={css("ctaTagline")}>
            Trade Disciplined <span aria-hidden="true">·</span> Live Freer
          </p>
        </div>
      </div>
    </section>
  );
}
