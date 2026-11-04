"use client";

import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BookOpen, Bot, Brain, Camera, ChartColumn, ChevronDown, Dna, Eye, FileText,
  Globe, ListChecks, ShieldAlert, Smartphone, Target, TrendingUp, Check, X,
} from "lucide-react";

import { features, groups, type FeatureId } from "@/data/features";
import { socials } from "@/data/contact";
import styles from "./story.module.css";

type Chapter = {
  id: string;
  kicker: string;
  title: ReactNode;
  body: string;
  align?: "left" | "center";
};

const chapters: Chapter[] = [
  {
    id: "start",
    kicker: "The Edgecipline story",
    title: <>Every trader starts <em>somewhere.</em></>,
    body: "Edgecipline didn't start in a boardroom. It started in a losing streak.",
    align: "center",
  },
  {
    id: "low",
    kicker: "01 · The low",
    title: <>When I started trading, I was <em className={styles.red}>completely low.</em></>,
    body: "Red day after red day. I knew the setups. I didn't know why I kept breaking my own rules.",
  },
  {
    id: "search",
    kicker: "02 · The search",
    title: <>So I did what everyone says: <em>journal every trade.</em></>,
    body: "If the answer was anywhere, it had to be in my own history.",
  },
  {
    id: "problem",
    kicker: "03 · The problem",
    title: <>Every app tracked my trades. <em className={styles.red}>None tracked me.</em></>,
    body: "Hours of manual entries (symbol, entry, exit, lot size) and all I got back was P&L. Nothing about the fear, the FOMO and the revenge that were actually costing me.",
  },
  {
    id: "gap",
    kicker: "04 · The gap",
    title: <>Then a friend named <em>the real gap.</em></>,
    body: "“Your strategy isn't the problem. Your behaviour is. And no app is even looking at it.”",
    align: "center",
  },
  {
    id: "busywork",
    kicker: "05 · Zero busywork",
    title: <>First, we killed the typing. <em>Screenshot in. Data out.</em></>,
    body: "Edgecipline reads your trade screenshot and logs it for you, so your attention goes where the edge really is: your mind.",
  },
  {
    id: "mind",
    kicker: "06 · The mind",
    title: <>Then we put <em>trader psychology</em> at the centre.</>,
    body: "Tag the emotion behind every trade: fear, greed, FOMO, revenge, calm. Here, psychology isn't a notes field. It's the whole point.",
  },
  {
    id: "pattern",
    kicker: "07 · The pattern",
    title: <>It finds the patterns <em>you can&apos;t see.</em></>,
    body: "Edgecipline connects how you felt to how you performed. The FOMO entries, the revenge trades, the calm wins. It shows you which habits are costing you.",
  },
  {
    id: "coach",
    kicker: "08 · The coach",
    title: <>Then it <em>coaches you</em> to break them.</>,
    body: "An AI coach that nudges you in the moment, missions that rebuild discipline, and a self-awareness score that grows as you do.",
  },
  {
    id: "edge",
    kicker: "09 · The edge",
    title: <>Fix the trader. <em>The profit follows.</em></>,
    body: "A trading coach built around your psychology, not just your P&L. Discipline over emotion.",
    align: "center",
  },
];

/** Psychology first: the order the page argues in. */
const showcaseOrder: FeatureId[] = [
  "trading-dna", "psychology", "risk-patterns", "self-awareness", "ai-coach", "missions", "performance-review",
  "analytics", "reports", "checklists", "screenshot", "dual-market", "journal", "android",
];
const icons: Record<FeatureId, ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  "trading-dna": Dna,
  psychology: Brain,
  "risk-patterns": ShieldAlert,
  "self-awareness": Eye,
  "ai-coach": Bot,
  missions: Target,
  "performance-review": TrendingUp,
  analytics: ChartColumn,
  reports: FileText,
  checklists: ListChecks,
  screenshot: Camera,
  "dual-market": Globe,
  journal: BookOpen,
  android: Smartphone,
};
const groupTitle = Object.fromEntries(groups.map((g) => [g.id, g.title]));
const showcase = showcaseOrder.flatMap((id) => features.filter((f) => f.id === id));

const comparison: [string, string][] = [
  ["Records what you traded", "Explains why you traded it"],
  ["Manual entry after every trade", "Screenshot in, data out"],
  ["P&L charts and win rates", "Emotion-to-outcome behaviour patterns"],
  ["Psychology is an optional notes field", "Psychology is the core of the product"],
  ["Leaves the fixing to you", "Coaches you with nudges, missions and streaks"],
];

const marquee = ["Discipline over emotion", "Find your patterns", "Coach the trader", "Screenshot in, data out", "Psychology first"];

export function StoryExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const scrollToRef = useRef<(top: number) => void>((top) => window.scrollTo({ top, behavior: "smooth" }));

  useEffect(() => {
    const root = rootRef.current;
    const host = canvasRef.current;
    if (!root || !host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    const after = root.querySelector<HTMLElement>("[data-after]");
    const dots = Array.from(railRef.current?.querySelectorAll<HTMLElement>("button") ?? []);

    let disposed = false;
    let scene: import("./createStoryScene").StoryScene | undefined;
    const cleanups: (() => void)[] = [];
    let active = -1;

    /* ---- Loader: counts up while three.js loads, completes when ready ---- */
    let loaded = false;
    let shown = 0;
    let loaderFrame = 0;
    const tickLoader = () => {
      const goal = loaded ? 100 : 88;
      shown += (goal - shown) * (loaded ? 0.18 : 0.035);
      if (loaderRef.current) loaderRef.current.textContent = String(Math.round(shown)).padStart(3, "0");
      if (loaded && shown > 99.4) {
        if (loaderRef.current) loaderRef.current.textContent = "100";
        root.dataset.loaded = "";
        return;
      }
      loaderFrame = requestAnimationFrame(tickLoader);
    };
    loaderFrame = requestAnimationFrame(tickLoader);
    const finishLoading = () => { loaded = true; };
    const safety = window.setTimeout(finishLoading, 6000);

    /** Story position from the viewport's centre line: chapter i spans [i, i + 1). */
    const position = () => {
      const mid = window.innerHeight / 2;
      for (let i = 0; i < sections.length; i++) {
        const r = sections[i].getBoundingClientRect();
        if (mid < r.bottom || i === sections.length - 1) {
          return i + Math.min(1, Math.max(0, (mid - r.top) / r.height));
        }
      }
      return 0;
    };

    const onScroll = () => {
      const t = position();
      scene?.setTarget(t);
      const index = Math.min(sections.length - 1, Math.floor(t));
      if (index !== active) {
        active = index;
        dots.forEach((d, i) => d.toggleAttribute("data-active", i === index));
        if (counterRef.current) counterRef.current.textContent = String(index).padStart(2, "0");
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      root.toggleAttribute("data-scrolled", window.scrollY > 40);
      root.toggleAttribute("data-beyond", !!after && after.getBoundingClientRect().top < window.innerHeight * 0.6);
    };

    /* ---- Pointer: scene parallax, trailing cursor, magnetic buttons ---- */
    const cursor = { x: -100, y: -100, cx: -100, cy: -100 };
    let cursorFrame = 0;
    const moveCursor = () => {
      cursor.cx += (cursor.x - cursor.cx) * 0.18;
      cursor.cy += (cursor.y - cursor.cy) * 0.18;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${cursor.cx}px, ${cursor.cy}px, 0)`;
      cursorFrame = requestAnimationFrame(moveCursor);
    };
    if (finePointer && !reduced) cursorFrame = requestAnimationFrame(moveCursor);

    const onPointer = (e: PointerEvent) => {
      scene?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      cursorRef.current?.toggleAttribute("data-hover", !!target?.closest("a, button"));
      // Cards track the pointer for their spotlight.
      const card = target?.closest<HTMLElement>("[data-spot]");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      if (reduced || !finePointer) return;
      root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9;
        el.style.transform = near ? `translate(${dx * 0.25}px, ${dy * 0.35}px)` : "";
      });
    };
    const onResize = () => {
      scene?.resize();
      onScroll();
    };
    const onVisibility = () => (document.hidden ? scene?.stop() : scene?.start());

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onScroll();

    (async () => {
      if (reduced) return finishLoading();
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }, { createStoryScene }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
        import("lenis"),
        import("./createStoryScene"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      // Inertial scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
      const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      scrollToRef.current = (top) => lenis.scrollTo(top, { duration: 1.8 });
      cleanups.push(() => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      });

      const ctx = gsap.context(() => {
        // Chapter copy: kicker, then the title word by word from behind a mask, then the body.
        sections.forEach((section, i) => {
          const copy = section.querySelector("[data-copy]");
          const kicker = section.querySelector("[data-kicker]");
          const title = section.querySelector("[data-title]");
          const rest = section.querySelectorAll("[data-rest]");
          if (!copy || !kicker || !title) return;
          const words = SplitText.create(title, { type: "words", mask: "words" }).words;
          const last = i === sections.length - 1;
          const tl = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
          if (i === 0) {
            tl.to({}, { duration: 0.55 });
          } else {
            tl.fromTo(kicker, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.12 })
              .fromTo(words, { yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0, stagger: 0.012, duration: 0.2, ease: "power3.out" }, "<")
              .fromTo(rest, { autoAlpha: 0, y: 40, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.04, duration: 0.15 }, "-=0.08")
              .to({}, { duration: 0.33 });
          }
          if (!last) tl.to(copy, { autoAlpha: 0, y: -80, filter: "blur(10px)", duration: 0.28, ease: "power2.in" });
          else tl.to({}, { duration: 0.3 });

          if (i === 0) {
            // The opening reveal plays once the loader lifts.
            const intro = gsap.timeline({ paused: true })
              .from(kicker, { autoAlpha: 0, y: 20, duration: 0.9, ease: "power3.out" })
              .from(words, { yPercent: 115, rotate: 5, stagger: 0.06, duration: 1.2, ease: "expo.out" }, "-=0.6")
              .from(rest, { autoAlpha: 0, y: 30, stagger: 0.1, duration: 1, ease: "power3.out" }, "-=0.8");
            const observer = new MutationObserver(() => {
              if ("loaded" in root.dataset) {
                intro.play();
                observer.disconnect();
              }
            });
            observer.observe(root, { attributes: true, attributeFilter: ["data-loaded"] });
            cleanups.push(() => observer.disconnect());
          }
        });

        // Showcase: the feature track scrolls sideways while the section is pinned.
        const pin = root.querySelector<HTMLElement>("[data-pin]");
        const track = root.querySelector<HTMLElement>("[data-track]");
        if (pin && track && window.matchMedia("(min-width: 761px)").matches) {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth + 64),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${track.scrollWidth - window.innerWidth + 64}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        }

        // Every other block after the story rises in once.
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0, y: 60, filter: "blur(10px)", duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row, i) => {
          gsap.from(row, {
            autoAlpha: 0, x: -40, duration: 0.8, delay: i * 0.05, ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 90%" },
          });
        });
      }, root);
      cleanups.push(() => ctx.revert());

      try {
        scene = createStoryScene(host);
      } catch {
        // No WebGL: the CSS backdrop and the copy carry the story on their own.
        return finishLoading();
      }
      if (disposed) return scene.dispose();
      onScroll();
      scene.start();
      host.dataset.ready = "";
      finishLoading();
    })();

    return () => {
      disposed = true;
      window.clearTimeout(safety);
      cancelAnimationFrame(loaderFrame);
      cancelAnimationFrame(cursorFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      cleanups.forEach((fn) => fn());
      scene?.dispose();
    };
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    scrollToRef.current(el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2 - window.innerHeight / 2);
  };

  return (
    <div ref={rootRef} className={`story-page ${styles.page}`}>
      <div ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />
      <div className={styles.loader} aria-hidden="true">
        <Image src="/brand/mark.webp" alt="" width={40} height={50} priority />
        <strong>EDGECIPLINE</strong>
        <span className={styles.loaderCount}><span ref={loaderRef}>000</span>%</span>
        <i className={styles.loaderLine} />
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo} aria-label="Edgecipline home">
            <Image src="/brand/mark.webp" alt="" width={26} height={33} priority />
            <span>EDGECIPLINE</span>
          </Link>
          <nav className={styles.nav} aria-label="Main">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
          </nav>
          <a href="#waitlist" className={styles.cta} data-magnetic>Join waitlist</a>
        </div>
        <div className={styles.bar} aria-hidden="true"><div ref={barRef} /></div>
      </header>

      <ol ref={railRef} className={styles.rail} aria-label="Chapters">
        {chapters.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => jump(c.id)} aria-label={c.kicker}>
              <span>{c.kicker}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className={styles.counter} aria-hidden="true">
        <span ref={counterRef}>00</span> / {String(chapters.length - 1).padStart(2, "0")}
      </div>

      <main className={styles.story}>
        {chapters.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            data-chapter
            className={`${styles.chapter} ${c.align === "center" ? styles.center : ""} ${i === 0 ? styles.hero : ""}`}
            aria-labelledby={`${c.id}-title`}
          >
            <div className={styles.copy} data-copy>
              <p className={styles.kicker} data-kicker>{c.kicker}</p>
              {i === 0 ? (
                <h1 id={`${c.id}-title`} className={styles.title} data-title>{c.title}</h1>
              ) : (
                <h2 id={`${c.id}-title`} className={styles.title} data-title>{c.title}</h2>
              )}
              <p className={styles.body} data-rest>{c.body}</p>
              {i === 0 && (
                <p className={styles.cue} data-rest>
                  Scroll to begin <ChevronDown size={16} aria-hidden="true" />
                </p>
              )}
              {i === chapters.length - 1 && (
                <div className={styles.actions} data-rest>
                  <a href="#waitlist" className={styles.primary} data-magnetic>
                    Join the waitlist <ArrowRight size={18} aria-hidden="true" />
                  </a>
                  <a href="#inside" className={styles.secondary} data-magnetic>See what&apos;s inside</a>
                </div>
              )}
            </div>
          </section>
        ))}

        {/* ---- After the story: the product, plainly ---- */}
        <section id="inside" className={styles.showcase} data-after data-pin aria-labelledby="inside-title">
          <div className={styles.showcaseHead}>
            <p className={styles.kicker}>Inside Edgecipline</p>
            <h2 id="inside-title" className={styles.sectionTitle}>
              A coach for the <em>trader</em>,<br />not a spreadsheet for trades.
            </h2>
          </div>
          <div className={styles.trackWrap}>
            <ul className={styles.track} data-track>
              {showcase.map((f) => {
                const Icon = icons[f.id];
                return (
                  <li key={f.id} className={styles.card} data-spot>
                    <div className={styles.cardTop}>
                      <span className={styles.cardIcon}><Icon size={22} aria-hidden /></span>
                      <span className={styles.cardNum}>{f.number}</span>
                    </div>
                    <p className={styles.cardGroup}>{groupTitle[f.group]}</p>
                    <h3>{f.title}</h3>
                    <p className={styles.cardTag}>{f.tagline}</p>
                    <Link href={`/features#${f.id}`} className={styles.cardLink}>
                      Learn more <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className={styles.compare} aria-labelledby="compare-title">
          <div className={styles.compareHead} data-rise>
            <p className={styles.kicker}>Why it&apos;s different</p>
            <h2 id="compare-title" className={styles.sectionTitle}>
              Other apps watch your trades.<br /><em>Edgecipline watches the trader.</em>
            </h2>
          </div>
          <div className={styles.table} role="table" aria-label="Typical trading journal compared with Edgecipline">
            <div className={styles.tableHead} role="row">
              <span role="columnheader">Typical trading journal</span>
              <span role="columnheader">Edgecipline</span>
            </div>
            {comparison.map(([them, us]) => (
              <div key={us} className={styles.tableRow} role="row" data-row>
                <span role="cell"><X size={16} aria-hidden="true" /> {them}</span>
                <span role="cell"><Check size={16} aria-hidden="true" /> {us}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.marquee} aria-hidden="true">
          <div>
            {[...marquee, ...marquee, ...marquee].map((m, i) => (
              <span key={i}>{m}<b>✦</b></span>
            ))}
          </div>
        </div>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div data-rise>
            <p className={styles.kicker}>Your next chapter</p>
            <h2 id="closing-title" className={styles.closingTitle}>
              Stop fighting the market.<br /><em>Start understanding yourself.</em>
            </h2>
            <div className={styles.actions}>
              <a href="#waitlist" className={styles.primary} data-magnetic>
                Join the waitlist <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link href="/features" className={styles.secondary} data-magnetic>Explore all features</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.logo} aria-label="Edgecipline home">
              <Image src="/brand/mark.webp" alt="" width={26} height={33} />
              <span>EDGECIPLINE</span>
            </Link>
            <p>The trading coach built around your psychology. Discipline over emotion.</p>
          </div>
          <nav aria-label="Product">
            <h3>Product</h3>
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/story">Our story</Link>
            <Link href="/faq">FAQ</Link>
          </nav>
          <nav aria-label="Company">
            <h3>Company</h3>
            <Link href="/about">About</Link>
            <Link href="/founders">Founders</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <nav aria-label="Social">
            <h3>Follow</h3>
            {socials.map((s) => (
              <a key={s.id} href={s.href} target="_blank" rel="me noopener noreferrer">{s.label}</a>
            ))}
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <span>© Edgecipline</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
