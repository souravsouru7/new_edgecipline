/**
 * The homepage opener — "The Discipline Machine".
 *
 * A seven-second cinematic intro: calibration lines awaken on an ivory canvas,
 * a typographic vortex spins fragments inward, eleven letters emerge from the
 * field along distinct trajectories, snap into the EDGECIPLINE wordmark, a
 * green sweep crosses the baseline and extends into a dotted mountain whose
 * contour draws itself out of the data field, the tagline rises, and the
 * overlay fades into the real landing page.
 *
 * The animation is pure CSS keyframes — no JavaScript sequences, starts, or
 * ends it. The overlay fades itself to `visibility: hidden; pointer-events:
 * none`, so if the client bundle is slow or never arrives the site is still
 * revealed and usable beneath it. The pre-paint inline script reads
 * sessionStorage; a returning visitor in the same session gets the brief
 * repeat-visit variant (~1.2s) instead of the full seven-second run.
 *
 * Reduced motion is respected via a media query that collapses the whole
 * sequence to a single short brand reveal. The overlay is aria-hidden
 * decoration layered over a document that is already complete and crawlable.
 */

// Letters of the wordmark. Each gets a distinct entrance class so the eleven
// characters do not share a single animation.
const WORDMARK = ["E", "D", "G", "E", "C", "I", "P", "L", "I", "N", "E"] as const;

// Pre-seeded vortex particles. Positions are deterministic so the motion is
// repeatable, not a random explosion. Each particle has an angle (deg) around
// the center, a radius (percentage of canvas), a size (px), and a hue flag.
const PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const angle = (i * 137.508) % 360; // golden-angle spiral
  const radius = 18 + ((i * 7) % 32);
  const size = 2 + ((i * 3) % 4);
  const green = i % 5 === 0;
  const delay = (i % 12) * 0.03;
  return { angle, radius, size, green, delay };
});

export function LandingLoader() {
  return (
    <>
      {/* Pre-paint intro-state resolver. If the visitor has already seen the
          intro this session, mark the overlay so CSS collapses it to the
          brief repeat-visit sequence rather than replaying the full seven
          seconds. Also honours a reduced-motion preference immediately. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{var s=sessionStorage.getItem('edg-intro');var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(s==='seen'||r){document.documentElement.dataset.dmMode='brief';}else{document.documentElement.dataset.dmMode='full';}sessionStorage.setItem('edg-intro','seen');}catch(e){}",
        }}
      />
      <div className="dm-overlay" aria-hidden="true" role="presentation">
        {/* Phase 1 — the system awakens. Calibration lines and a thin emerald
            scan line travel across the canvas. */}
        <svg className="dm-grid" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {/* Horizontal + vertical calibration ticks around the center. */}
          {[160, 320, 480, 640].map((y) => (
            <line key={`h${y}`} className="dm-cal" x1={60} x2={1140} y1={y} y2={y} />
          ))}
          {[240, 480, 720, 960].map((x) => (
            <line key={`v${x}`} className="dm-cal" x1={x} x2={x} y1={120} y2={680} />
          ))}
          {/* The four corner brackets. */}
          <path className="dm-bracket" d="M60 120 L60 170 M60 120 L110 120" />
          <path className="dm-bracket" d="M1140 120 L1140 170 M1140 120 L1090 120" />
          <path className="dm-bracket" d="M60 680 L60 630 M60 680 L110 680" />
          <path className="dm-bracket" d="M1140 680 L1140 630 M1140 680 L1090 680" />
          {/* The emerald scan line, animated via CSS. */}
          <line className="dm-scan" x1={60} x2={1140} y1={400} y2={400} />
        </svg>

        {/* Phase 2 — the typographic vortex. Deterministic golden-angle layout
            around a central axis so the swirl reads as intentional, not random.
            Rotation is applied to the whole wrapper; each particle sits at a
            fixed polar position and comes in with a per-particle delay. */}
        <div className="dm-vortex" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={p.green ? "dm-particle dm-particle-green" : "dm-particle"}
              style={
                {
                  "--a": `${p.angle}deg`,
                  "--r": `${p.radius}%`,
                  "--s": `${p.size}px`,
                  "--d": `${p.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
          {/* A handful of letter-fragment glyphs riding the vortex — they
              feel like information the field is about to resolve. */}
          <span className="dm-fragment" style={{ "--a": "22deg", "--r": "28%", "--d": "0.1s" } as React.CSSProperties}>/</span>
          <span className="dm-fragment" style={{ "--a": "118deg", "--r": "34%", "--d": "0.22s" } as React.CSSProperties}>\</span>
          <span className="dm-fragment" style={{ "--a": "210deg", "--r": "26%", "--d": "0.14s" } as React.CSSProperties}>·</span>
          <span className="dm-fragment" style={{ "--a": "294deg", "--r": "36%", "--d": "0.3s" } as React.CSSProperties}>+</span>
          <span className="dm-fragment" style={{ "--a": "60deg", "--r": "40%", "--d": "0.18s" } as React.CSSProperties}>|</span>
          <span className="dm-fragment" style={{ "--a": "340deg", "--r": "30%", "--d": "0.08s" } as React.CSSProperties}>—</span>
        </div>

        {/* Phase 3-4 — the wordmark emerges. Each letter carries its own
            `data-i` so CSS can address it by position for a distinct entrance
            path and settling easing. */}
        <div className="dm-word" aria-hidden="true">
          <span className="dm-word-guide dm-guide-top" />
          <span className="dm-word-guide dm-guide-bottom" />
          <span className="dm-word-letters">
            {WORDMARK.map((ch, i) => (
              <span key={i} className="dm-letter" data-i={i}>
                <span className="dm-letter-inner">{ch}</span>
              </span>
            ))}
          </span>
          <span className="dm-sweep" aria-hidden="true" />
        </div>

        {/* Phase 5 — the dotted mountain generates itself. The dots are
            rendered once via an SVG <pattern> inside a clipped region, so a
            field that reads as "thousands of dots" costs a single rect of
            paint. The contour is a path we stroke-draw via dash animation,
            which looks hand-generated without actually animating thousands of
            nodes. */}
        <svg className="dm-mountain" viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="dmMountainFill" x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16834A" stopOpacity=".14" />
              <stop offset="1" stopColor="#16834A" stopOpacity=".82" />
            </linearGradient>
            <pattern id="dmDots" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="url(#dmMountainFill)" />
            </pattern>
            <clipPath id="dmMountainClip">
              <path d="M0 290 C110 275 130 210 230 220 S350 140 445 170 555 250 660 180 800 60 900 130 1040 245 1200 160 L1200 360 L0 360 Z" />
            </clipPath>
            <linearGradient id="dmSweepGrad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16834A" stopOpacity="0" />
              <stop offset=".48" stopColor="#16834A" />
              <stop offset=".55" stopColor="#8AF0B3" />
              <stop offset="1" stopColor="#16834A" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* The dot field, revealed left-to-right by a clip-path on the
              wrapping <g>, so it looks generated by the green sweep. */}
          <g className="dm-mountain-field" clipPath="url(#dmMountainClip)">
            <rect width="1200" height="360" fill="url(#dmDots)" />
          </g>
          {/* The contour, stroke-drawn. pathLength=1 lets us treat the stroke
              as a 0..1 reveal independent of the actual length in units. */}
          <path
            className="dm-mountain-line"
            d="M0 290 C110 275 130 210 230 220 S350 140 445 170 555 250 660 180 800 60 900 130 1040 245 1200 160"
            pathLength={1}
            fill="none"
            stroke="#16834A"
            strokeWidth="1.6"
            strokeOpacity=".55"
          />
          {/* The travelling green highlight along the contour. */}
          <path
            className="dm-mountain-highlight"
            d="M0 290 C110 275 130 210 230 220 S350 140 445 170 555 250 660 180 800 60 900 130 1040 245 1200 160"
            pathLength={1}
            fill="none"
            stroke="url(#dmSweepGrad)"
            strokeWidth="2.4"
          />
        </svg>

        {/* Phase 6 — the brand statement. Uses the existing approved tagline
            from the site shell. */}
        <span className="dm-tag" aria-hidden="true">
          <i>TRADE</i>
          <i>DISCIPLINE</i>
          <i>GROW</i>
        </span>

        {/* The curtain that masks away in Phase 7 — a soft radial wipe out
            from the wordmark baseline reveals the landing page beneath. */}
        <span className="dm-curtain" aria-hidden="true" />
      </div>
    </>
  );
}
