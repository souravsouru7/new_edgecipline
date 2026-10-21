# Edgecipline motion system

The sections keep their layout, copy and colours. This document describes the
motion layer on top: how the page is assembled, what each section does, where
it lives, and which knob to turn to make it stronger or quieter.

## The stage

The landing page is **one pinned frame**. `.stage-pin` is held still in the
viewport while the document scrolls past `.stage`, and all eleven sections are
panels of that frame: each one's content cross-fades in, holds, and
cross-fades out again, so a section arrives and leaves rather than scrolling
by.

*Files: `src/components/landing/Stage.tsx`, `src/components/motion/StageMotion.tsx`,
`src/app/stage.css`.*

- **Nothing is timed.** Every value is a function of `--stage-p`, which
  StageMotion publishes: 0 the instant the pin takes hold, 1 the instant
  before it lets go. The sequence therefore reverses exactly on the way up and
  cannot drift out of step with the scrollbar.
- **No scroll hijacking.** There is no wheel handler, no scroll locking and no
  snapping anywhere on the page. The only JavaScript that moves the document
  is the two cases below, and both are responses to a deliberate action.
- **The release is free.** The pinned child is exactly one viewport tall, so
  the pin takes hold when the stage's top reaches the top of the viewport and
  lets go when its bottom reaches the bottom — the same window `--stage-p`
  measures. The last panel is still at full opacity when the sticky box runs
  out of travel and simply scrolls away with the stage.
- **The crossfade** is `--stage-reach` and `--stage-ramp`, and the pair is
  worth understanding before changing either. A panel is fully opaque within
  `reach - ramp` of the frame and gone beyond `reach`. Much above .5 and two
  sections are legible at once, which reads as a double exposure; at or below
  .5 they never overlap and the page dips to the bare background between every
  section. The shipped values leave each at about a third of full opacity as
  they pass, and give every section a stretch either side where it is the only
  thing on screen.
- **Per-panel progress.** StageMotion also writes each panel's own
  `--mo-progress`, 0 one step before it reaches the frame, .5 in it, 1 one
  step after. That is the same 0..1 a section used to get from `SceneMotion`
  as it travelled up the page, so every section's existing motion works
  unchanged. (The hero was written against the other mapping, where 0 is "at
  rest, on screen", and re-derives its own `--mo-p` from this one.)
- **Entrance replay.** `data-inview` is set once by RevealObserver, the first
  time an element is seen — and in a pinned frame every panel is technically
  on screen from the start. While pinned the stage owns that flag instead: a
  panel's reveals are set when it takes the frame and cleared when it leaves,
  so each section plays its own entrance every time it comes round, in both
  directions.
- **In-page links.** Inside the pin every panel sits at the same place, so
  `#waitlist` has no scroll position of its own. A click on a link pointing
  into a panel becomes a scroll to that panel's place on the stage.
- **Focus.** Tabbing can reach a form or a link in a panel that is not in the
  frame. Rather than making those panels `inert` — which would take their text
  out of the accessibility tree, and the point is that every section stays
  readable — the stage jumps to the panel that owns the focus.
- **The progress rail** is a section index down the right-hand edge: a line at
  `scaleY(--stage-p)`, so it tracks the scrollbar rather than approximating
  it, and one number per section, the one in the frame lit. The links are
  real, so it doubles as a way to jump straight to a section.
- **Where it does not pin.** `(min-width: 1101px) and (min-height: 680px)`,
  and never under `prefers-reduced-motion: reduce`. The width is the sidebar's
  own breakpoint, not an arbitrary "desktop": below it the sidebar is replaced
  by the mobile header, which is not part of the frame and would scroll out of
  reach. Outside that the page is an ordinary scrolling column — but the
  sections still arrive and leave, with the same fade tied to each section's
  travel through the viewport instead of to a frame. With JavaScript off,
  nothing applies at all and every word of every section is simply visible.

## One continuous background

The landing page has exactly one background, and no section paints its own.

*Files: `src/components/PageSky.tsx`, `src/app/backdrop.css`.*

`PageSky` renders a fixed layer behind the whole document, carrying what used
to be the hero's background: the deep ink gradient, `/hero/landscape.webp`,
the turquoise aura and the left-to-right legibility scrim. `backdrop.css`
holds that layer plus the subtractions — every section is transparent now, and
the section colours and the inset "scene fade" shadows that used to hide the
seams between them are gone.

The sections' own photographs are still here, but as **scenes of that one
layer** rather than nine opaque panels: each dissolves in over the landscape
as its section takes the frame and out again behind the next one, so the
artwork changes with the content while the background itself never cuts,
restarts or exposes an edge. `SCENES` in `PageSky.tsx` is the list, and its
index order has to match the panels in `EdgeciplineHero`.

Three things to know before editing it:

- The layer is a **sibling of `.site-shell`**, not a child, so no clip,
  containment or stacking context inside the page can cut into it. It is
  `pointer-events: none` throughout and the document scrolls normally.
- It reads two values, neither of which costs a React render: `--sky-p`
  (document scroll, 0..1, written here) drives a slow drift of the landscape,
  well inside the layer's own 8% overscan so no edge is ever exposed;
  `--stage-p` (written by StageMotion, which publishes it to `.page-sky` as
  well as to `.stage`) drives the scene crossfade.
- Every rule in `backdrop.css` is scoped under `.site-shell` or `.page-sky`.
  The other routes keep their own backgrounds, and the scoping also puts the
  file above the single-class rules it overrides, whatever the import order.

## How it is built

| Piece | File | Role |
| --- | --- | --- |
| Motion stylesheet | `src/app/motion.css` | Every keyframe, transition and tuning variable |
| In-view signal | `src/components/motion/RevealObserver.tsx` | Adds `html.motion-ready`, then `data-inview` per element |
| Scroll stage | `src/components/motion/StageMotion.tsx` | Publishes `--stage-p` and each panel's `--mo-progress`, `data-stage-active`, `data-mo-live` |
| Page background | `src/components/PageSky.tsx`, `src/app/backdrop.css` | The one continuous background, and `--sky-p` |
| Pointer state | `src/components/motion/SceneMotion.tsx` | Publishes `--mo-px` / `--mo-py` on the three sections that track the pointer |
| Card spotlight | `src/components/motion/Spotlight.tsx` | Publishes `--mo-sx/--mo-sy/--mo-tx/--mo-ty` on the hovered step card |
| CTA magnetism | `src/components/motion/Magnetic.tsx` | Publishes `--mo-mx/--mo-my` on the hero buttons |
| Route nav | `src/components/nav/SideNavLinks.tsx` | Which page is current, from the route (no scroll spy) |
| Count up | `src/components/motion/CountUp.tsx` | Replays `[data-count]` numbers once, then restores the markup |
| Frame driver | `src/components/motion/scroll-driver.ts` | The page's single `scroll`/`resize` listener and single rAF; also flags `html[data-scrolling]` |
| Reduced motion | `src/components/motion/reduced-motion.ts` | `useReducedMotion`, so no animation library reaches the browser |

The islands render **no markup at all** — they only publish state, and
`motion.css` decides what that state looks like. Every section component
therefore stays a Server Component, and the whole page still prerenders as
static HTML.

Two properties of this arrangement are worth preserving if you edit it:

- **Reveals are gated on `html.motion-ready`.** With JavaScript disabled or
  still loading, the page renders fully visible rather than stuck at opacity 0.
  Anything already on screen when the islands mount is marked `data-inview="now"`
  and never animates, so nothing the visitor is already reading can flicker.
- **Entrance keyframes only declare `from`.** The element's normal CSS is the
  finished state, so turning an animation off (reduced motion, offscreen idling)
  lands on the correct final rendering instead of a half-built one.

Reveals animate `translate` and `opacity`. `transform` is deliberately left
free for parallax, pointer depth and the hover lifts that already existed, so
the two never fight over the same property.

## Tuning

Global knobs, at the top of `motion.css`:

| Variable | Default | Effect |
| --- | --- | --- |
| `--mo-parallax` | `1` | Scroll and pointer displacement. `0` disables all of it. |
| `--mo-glow` | `1` | Strength of every glow and pulse. `0` is flat. |
| `--mo-ambient` | `1` | Duration multiplier for continuous loops. `1.5` slows everything down. |
| `--mo-rise` | `26px` | How far a revealed element travels. |
| `--mo-dur-micro/-fast/-/-slow` | `.2s/.45s/.72s/1.1s` | The four durations everything is built from. |

Per-section knobs, set on the section itself:

| Section | Variable | Effect |
| --- | --- | --- |
| Hero | `--hero-depth`, `--hero-pointer` | Scroll parallax and pointer depth for the hero layers |
| Hero globe | `--globe-spin`, `--globe-cage`, `--globe-nodes` | One full turn (48s), graticule strength, node strength |
| Emotional Loop | `--loop-cycle` | Time for one light to travel the whole loop |
| Chart Story | `--chart-draw`, `--chart-delay`, `--chart-candle-step` | Line draw duration, start delay, candle cascade pace |
| Built by Traders | `--story-depth`, `--story-pointer` | Parallax, and the portrait's pointer cap (6px) |
| How It Works | `--step-stagger`, `--step-tilt` | Card cascade spacing and the hover tilt angle |
| Trading DNA | `--dna-draw`, `--dna-breathe`, `--dna-pointer` | Strand draw time, breath period, helix pointer depth |
| Weekly Reflection | `--wr-stagger`, `--wr-dial` | Card cascade, discipline dial draw time |
| Journey | `--jy-draw`, `--jy-delay` | Path draw time and its start delay |
| Pricing | `--pr-stagger` | Card cascade spacing |
| FAQ | `--faq-speed` | Accordion open/close, 250-350ms |
| Final CTA | `--cta-depth` | Closing parallax |

Breakpoint behaviour is already dialled in: `--mo-parallax` drops to `.5` below
1024px and `.3` below 768px, pointer effects switch off below 1024px, and the
particle and decorative-wave counts are reduced on phones.

## Section 01 — Hero

*Files: `src/components/HeroScene.tsx`, `src/components/hero/PlanetAtmosphere.tsx`,
`src/components/MotionContent.tsx`, section 3 of `motion.css`.*

- **Opening sequence**, roughly 1.9s: background, landscape (15px rise), planet
  (scale 0.96 → 1), rock, trader, then eyebrow, headline line 1, headline line 2,
  summary, buttons and the social proof cluster. It is pure CSS, so it runs on
  first paint and does not wait for hydration or block rendering.
- **Living planet**: a pulsing atmospheric aura, floating motes, and a slow
  cyan/purple light sweep clipped to the artwork's own silhouette, so the light
  travels across the planet and the DNA spiral rather than a plain rectangle.
  The artwork is a flat image — nothing here animates individual strands.
- **Rotating energy mesh** (`GlobeMesh.tsx`, `globe-mesh.ts`): the planet is a
  flat front view, so it cannot itself turn — the back of it does not exist in
  the file. What turns is the layer over it: a spherical graticule and 22
  network nodes, orthographically projected and rotating about the planet's
  axis, blended over the artwork with `screen`. Meridians sweep from a full
  circle to edge-on and back exactly as a great circle through the poles does;
  nodes orbit their own latitude, growing and brightening as they come round
  the near side. The bright moving elements are the ones the eye tracks, so the
  globe reads as rotating with the artwork left completely untouched.

  The sphere's circle was measured off the artwork (a circle fit to its limb:
  centre 840,835, radius 660 in the asset's 1600 box), and the mesh sits at 95.5%
  of that radius, inside the atmosphere ring.
- **Three-level parallax**: planet 86px, rock 120px, trader 104px across the
  hero's travel, all small enough that no background edge is ever exposed. The
  landscape is no longer one of these layers: it belongs to the page now and
  drifts on `--sky-p` instead (see *One continuous background*).
- **Trader figure**: a 3px vertical breath and a weak turquoise rim. No spin.
- **CTAs**: neon border glow, the arrow slides, a pressed state, and a
  desktop-only magnetic pull capped at 7px. The links keep their real `href`,
  focus ring and keyboard behaviour.
- **Hand-off**: there is nothing to hand over to any more — the background
  behind the hero and behind the Emotional Loop is the same layer, so the veil
  that used to fade the hero into a flat `#020c11` is gone. What replaced it
  is `--hero-exit`, which eases the hero's own cast (planet, rock, figure,
  keywords) back over the last third of its travel while the landscape carries
  on. The copy is untouched, so nothing readable ever fades.

The headline is split into two spans — one per line — and no further.

## Section 02 — Emotional Loop

*Files: `src/components/EmotionalLoopSection.tsx`, section 4 of `motion.css`.*

- **Sequential reveal**: heading and quotation rise in; the four connector arcs
  draw themselves in order.
- **Energy transfer**: one light circulates the loop — each arc owns a quarter
  of `--loop-cycle`, and each node brightens on the same beat, so the energy
  genuinely hands over from stage to stage instead of all four pulsing at once.
  The diagram never rotates and no text rotates.
- **Node interaction**: hover or keyboard focus scales the node 5.5%, intensifies
  its neon, emphasises the title, brings the description to full strength and
  settles the other three to 55%. Implemented with `:has()`, so it needs no
  JavaScript. The labels are always visible without interacting.
- **Awareness moment**: `--loop-awake` ramps from 0 to 1 between 52% and ~80% of
  the section's travel. The travelling light drops to 45% strength, the node
  hand-over calms, and the right-hand quotation warms toward teal with a growing
  glow. It is a scroll-linked state, not an autoplay sequence, so scrolling is
  never blocked.
- **Mobile** keeps the existing 2×2 diagram and reading order, loses the pointer
  effects and keeps the arrows meaningful. No fixed-height scroll-jacking.

## Section 03 — Chart Story

*Files: `src/components/ChartStorySection.tsx`,
`src/components/chart/ChartCanvas.tsx`, `src/components/chart/chart-geometry.ts`,
section 5 of `motion.css`.*

The chart is no longer a flattened bitmap. `scripts/extract-chart-geometry.mjs`
pulls the real geometry out of the supplied editable artwork
(`3/…/02_trading_chart_transparent.svg`) into `chart-geometry.ts`, and
`ChartCanvas` draws it as SVG in the artwork's own 3840×920 viewBox with the
same cover framing, so the composition sits exactly where the image did.

- **Price line**: a genuine `<path>` with a stroke-dash reveal (`--chart-draw`),
  a blurred halo copy underneath, and a light that keeps crossing it afterwards.
- **Candles**: 105 real candles arriving left to right, growing from half length
  with the artwork's own colours and opacities. On phones the cascade collapses
  into a single group fade rather than 105 staggered animations.
- **Checkpoints**: the five markers scale in and pulse, each timed from its own
  position along the line (`--at`), so they light up as the drawing reaches
  them. The four labels follow. The final marker is greener and breathes more
  slowly than the three mistake markers.
- **Secondary waves**: twelve faint cyan/blue/purple waves from the same artwork
  drift slowly behind the chart.
- Nothing claims to be live market data; the caption says so explicitly.
- No artificial scroll duration — the section scrolls at normal speed.

Two now-unused assets stayed in `public/chart-story/` rather than being deleted:
`trading-chart.webp` and `event-glows.webp`. Removing them saves 196KB from the
repository whenever you are ready.

## Section 04 — Built by Traders

*Files: `src/components/BuiltByTradersSection.tsx`,
`src/components/story/NeuralOverlay.tsx`, section 6 of `motion.css`.*

- **Portrait entrance** with soft atmospheric light behind the subject
  (`.story-aura`), and different parallax depths for the nebula, the ribbons and
  the portrait.
- **Neural pulse**: the supplied editable wave paths, split into one coloured
  strand per stage — purple for the struggles, cyan for awareness, green for
  growth. Each strand has a blurred halo, a core that draws itself, and a dotted
  copy whose dash offset travels, which reads as small lights moving along the
  line without a DOM node per particle. These are overlay paths; the portrait is
  never deformed.
- **Three-stage transformation**: *Real Struggles*, *Real Traders*, *A Clearer
  Tomorrow* each reveal and light up in their own strand's colour as that strand
  activates.
- **Content**: the two headline lines stagger, the body copy fades, the three
  feature highlights cascade with icon micro-interactions on hover.
- **Pointer**: the portrait moves at most 6px (`--story-pointer`), so the face
  stays visually stable.
- **Hand-off**: `--story-settle` fades the scene into the cyan the next
  section's cards sit on.

## Section 05 — How It Works

*Files: `src/components/landing/HowItWorks.tsx`, `HowItWorks.module.css`,
section 7 of `motion.css`.*

- **Card entrance**: left to right, 24px rise, 120ms apart (`--step-stagger`),
  with a 22px scroll parallax (`--step-depth`) folded into the same transform
  as the hover tilt so the two never overwrite each other.
- **Spotlight hover** (desktop, fine pointer only): a radial highlight follows
  the pointer inside the card, the card tilts at most 3° (`--step-tilt`), the
  cyan border brightens and the icon lifts and glows. It is a gradient position,
  not an animated `backdrop-filter`.
- **Step-specific effects**: 01 fills an upload progress line and pulses the
  cloud icon once; 02 sparks the brain icon while five data motes converge on
  it; 03 grows four bars with a calm green glow. These are keyed to
  `data-stage-active` rather than `data-inview`, so each plays when the
  section takes the frame — in both scroll directions — instead of all three
  firing at once, off frame, and never again.
- **Connector**: the existing dotted cyan rule now carries a light that walks
  01 → 02 → 03 and pauses briefly at each. It is hidden at the breakpoint where
  the cards stop being in one row.
- **Mobile**: cards stack, all content stays visible without hover, and each
  card animates as it enters the viewport.

## Section 06 — Trading DNA

*Files: `src/components/sections/TradingDNA.tsx`, `TradingDNA.module.css`,
`DnaHelix.tsx`, `dna-helix.ts`, `DnaFeatureIcon.tsx`, section 8 of `motion.css`.*

The supplied package ships a `vectors/` folder alongside every bitmap, so this
section is built from the vector sources rather than the WebP files: the helix
and the four feature icons are real SVG, the five tags are CSS pills with real
text, and the insight panel is a CSS skin. Only the particle backdrop is still
a bitmap. That is 1.7MB of artwork replaced by 70KB plus markup, and everything
is editable, crisp at any size and animatable.

- **Helix**: rebuilt parametrically from the supplied vector, which turned out
  to be `x = 500 ± 160 · sin(y / 126)` with rungs every 32 units (see
  `dna-helix.ts`; the fit is within 0.07 units of all 192 of the artwork's own
  sample points). The strands draw themselves on entry, the ladder fills in
  behind them, and each strand then carries a light down its length. The whole
  helix breathes — scale 1 → 1.025, y 0 → -8 — and takes a small pointer depth
  on desktop. Its bloom is a CSS drop-shadow rather than the artwork's Gaussian
  filter, so the breath never forces a re-rasterise.
- **Feature rows**: staggered reveal, then a halo and a 2px lift on hover, with
  the icon brightening in its own colour.
- **Tags**: staggered arrival, then a slow glow pulse driven by a pseudo-element
  opacity so the pulse stays on the compositor.
- **Backdrop**: slow particle drift plus scroll parallax, and the speck field
  inside the helix shimmers as one group rather than 96 separate animations.
- **Mobile**: `--mo-glow` drops to `.7`, the composition stacks inside a 500px
  column, and the helix is scaled rather than cropped.

## Sections 06-10 — the screenshot build

*Files: `src/components/sections/{WeeklyReflection,Journey,Pricing,Faq,FinalCta}.tsx`
with a CSS module each, plus `journey-path.ts`, `pricing-data.ts`,
`faq-data.ts`, and sections 9-13 of `motion.css`.*

These five were rebuilt from the supplied reference screenshot. Everything in
them is real markup — no part of the screenshot is used as an image.

- **Weekly Reflection & Habits**: the day streak counts up once (`CountUp.tsx`,
  which restores the markup's own number afterwards), the discipline dial draws
  its arc with the percentage counting alongside it, the checklist mark draws
  itself, and the seven bars grow 80ms apart. The reflection card gets a
  highlight travelling its top edge on hover.
- **Your Journey**: the curve is generated through its waypoints in
  `journey-path.ts`, so the four pins sit exactly on it at any width. The path
  draws itself, then each milestone lights up as the line reaches it — the
  timing comes from the milestone's own position along the path, not a guessed
  delay — with a single radial pulse and a light that keeps travelling
  afterwards. On mobile the curve becomes a vertical rail.
- **Pricing**: cards cascade 120ms apart, the featured card breathes on a
  pseudo-element's opacity, hover lifts 6px at 1.015 scale.
- **FAQ**: one open at a time, `aria-expanded` + `aria-controls` with the panel
  as a labelled region, `inert` while collapsed. The height animates from
  `0fr` to `1fr`, so nothing is measured and nothing clips. The plus is two
  bars, and the upright one collapses into a real minus.
- **Final CTA**: the scene is composed from the existing mountain plate, the
  existing trader silhouette and a CSS moon whose light builds with scroll
  position. Eight drifting motes, and a faint breath on the logo.

### Content that is deliberately not there

- `pricing-data.ts` has **no monthly prices**. The reference shows a
  Monthly/Yearly selector but only ever shows the Yearly figures, so the
  selector renders Monthly disabled rather than inventing numbers. Fill the
  three `monthly` entries in and it goes live on its own.
- `faq-data.ts` has **two answers set to null** — "Is my trading data secure?"
  and "When will it be available?". Neither can be answered from anything the
  project already states, and both would mean inventing a security guarantee or
  a release date. The accordion renders a question only once it has an answer.

## Global behaviour

- **Sidebar**: this is a multi-page site, so the current link comes from the
  route — there is no scroll spy and nothing is measured. Only colour and the
  left rule cross-fade, so highlighting can never shift the layout. The links
  are `next/link`, so the next page is prefetched and keyboard, middle-click
  and the URL all behave natively.
- **Buttons, links, icons**: 180–250ms hover transitions, a pressed state, and
  scale/glow icon responses. Nothing spins continuously.
- **One listener, one frame**: every island subscribes to `scroll-driver.ts`
  instead of owning a handler. The page has a single passive `scroll` listener,
  a single `resize` listener and a single `requestAnimationFrame` per frame, in
  which the ten scenes and the sidebar spy run back to back. Anything that
  needs a layout box during a gesture — the magnetic buttons, the card
  spotlight, the pointer depth — caches it and invalidates it from that same
  frame, so no handler ever forces a synchronous layout.
- **Standing the loops down**: ambient loops are paused by selector while the
  page is scrolling (`html[data-scrolling]`) and while their own section is off
  screen (`[data-mo-scene]:not([data-mo-live])`, published by `SceneMotion`).
  This deliberately is *not* an inherited custom property, which is what it was
  before: changing one on `<html>` invalidates the style of every element on
  the page, and the flag flips twice per scroll gesture, which is where the
  page caught. A selector only re-styles what it can match. The two rules that
  run an entrance alongside a loop pass a list (`running, paused`) so a reveal
  is never frozen by the pause.
- **`@property`**: `--mo-progress`, `--mo-px` and `--mo-py` are registered as
  `<number>`, so the value a scene writes every frame is parsed once into a
  float rather than re-tokenised inside each `calc()` that reads it.

  Earlier passes removed the things that cost the most per scrolled frame:
  `backdrop-filter` on the stat and step cards, the `feGaussianBlur` inside the
  chart SVG (which was re-rasterised on every frame of the wave drift), the
  `blur()` on the journey line, and `will-change` on ~50 pending reveals. The
  sections also carry `contain: layout paint`, which they already satisfied
  through `overflow: hidden`.
- **Reduced motion**: section 16 of `motion.css` removes every decorative
  keyframe, zeroes the displacement multipliers and hides the elements whose
  only purpose is movement. `globals.css` already collapses transitions and
  smooth scrolling. Pointer tracking, magnetism and the spotlight are not even
  attached when the preference is set.
- **Performance**: only `transform`, `translate`, `opacity`, `filter` and
  `stroke-dashoffset` are animated. The scroll handler never reads layout — the
  section geometry is cached and re-measured by a `ResizeObserver`, which is also
  what keeps the scroll maths correct after late-loading imagery and breakpoint
  changes.
- **SEO and accessibility**: metadata, canonical URL, Open Graph, robots and
  sitemap are untouched; one `h1` with `h2` per later section; all copy is real
  HTML; the chart carries a `<title>` and a caption instead of a hidden
  duplicate image.

## Regenerating the derived files

```bash
node scripts/extract-chart-geometry.mjs   # src/components/chart/chart-geometry.ts
node scripts/make-globe-mask.mjs          # public/hero/globe-mask.webp
node scripts/make-globe-keyframes.mjs     # the two @keyframes tables in motion.css
```

`make-globe-keyframes.mjs` prints the `mo-globe-meridian` and `mo-globe-node`
keyframes. They have the globe's 18° tilt baked into their numbers, so if
`GLOBE_TILT` in `src/components/hero/globe-mesh.ts` changes, rerun it and paste
the two blocks over the ones in `motion.css`.

## Deliberate deviations from the brief

- **No GSAP/ScrollTrigger, Lenis or Three.js.** Every scroll timeline here is a
  single 0..1 progress value per section, which `motion.css` maps to the
  individual layers; adding a second scroll system (and ~70KB) to do that would
  cost more than it returns, and Lenis would have had to be reconciled with the
  existing anchor navigation and `scroll-behavior`. Nothing in these five
  sections benefits from WebGL. If you do want GSAP, the natural seam is
  `SceneMotion`: replace its scroll handler, keep the published variables, and
  no CSS has to change.
- **`motion` (Framer Motion) is used for spring smoothing and the reduced-motion
  hook inside the islands**, not for rendering. Animating via CSS keeps the
  markup server-rendered, keeps the client bundle small, and means the hero's
  opening sequence does not wait for hydration.
