# Edgecipline — complete landing page copy

Every piece of text on the home page (`/`), in the order it appears in the
document. Extracted from the rendered HTML, then cross-checked against source
so that collapsed, screen-reader-only and conditionally-hidden copy is included
too.

Notation used below:

| Marker | Meaning |
| --- | --- |
| `[sr-only]` | In the HTML and read by screen readers, but not visible on screen |
| `[alt]` | Image alternative text |
| `[svg]` | Title element inside an inline SVG |
| `[hidden]` | In the code but not rendered — see the note attached |
| `↵` | A deliberate line break inside one heading |

Source of truth for the wording is `src/data/` and the section components in
`src/components/`. Section anchors (`#home`, `#pricing`, …) are the live deep
links.

---

## Sidebar navigation

`[alt]` Edgecipline

Navigate

| # | Label |
| --- | --- |
| 01 | Home |
| 02 | Features |
| 03 | Pricing |
| 04 | About |
| 05 | Blog |
| 06 | FAQ |
| 07 | Contact |

**Early access open**

Join the waitlist to get in before launch.

Join Waitlist →

Founders · Privacy · Terms

> "Discipline creates freedom."

### Mobile header

`[alt]` Edgecipline

---

## 1 · Hero — `#home`

Awareness · Clarity · Better habits · Discipline · Consistency

**AI Trading Journal & Discipline Coach**

# The market moves. ↵ Your patterns repeat.

Edgecipline is an AI trading journal and discipline coach that helps traders
understand their behavior, break bad habits, and build lasting consistency.

Join Waitlist →

Watch Demo

`[sr-only]` Trusted by more than 10,000 traders.

Built for traders. ↵ Backed by real stories.

> **Note.** "Trusted by more than 10,000 traders." is `sr-only` — present in the
> markup and announced to screen readers, but invisible on screen. It is the one
> unverified quantitative claim on the page. See
> `src/components/MotionContent.tsx`.

---

## 2 · The Emotional Loop — `#emotional-loop`

## The Emotional Loop

Same cycle. Different day. ↵ It's not just the market — ↵ it's human nature.

| # | Stage | Line |
| --- | --- | --- |
| 01 | Rush | FOMO kicks in |
| 02 | Rule Break | Ignore your plan |
| 03 | Regret | Look at the results |
| 04 | Repeat | Same patterns |

`[alt]` Rush: FOMO kicks in
`[alt]` Rule Break: Ignore your plan
`[alt]` Regret: Look at the results
`[alt]` Repeat: Same patterns

`[alt]` A four-step behavioral cycle: rush, rule break, regret, then repeat.

**Until you ↵ become aware, ↵ the loop continues.**

---

## 3 · The chart is not the whole story — `#chart-story`

## The chart is not ↵ the whole story.

Behind every candle is a thought, an emotion, a decision. Edgecipline helps you
see the full picture.

Badges: **Real Struggles** · **Real Traders** · **A Clearer Tomorrow**

| # | Moment | Line |
| --- | --- | --- |
| 1 | FOMO | Entered late |
| 2 | Moved Stop | Let emotion win |
| 3 | Revenge Trade | Chased the move |
| 4 | Pattern Noticed | Starting to improve |

`[svg]` An illustrative price chart: a candle sequence with a rising line and
five highlighted moments where a decision was made.

Caption: An illustrative chart, not live market data: it shows how feelings and
decisions shape outcomes beyond individual price candles.

---

## 4 · Built by traders — `#story`

## Built by traders, ↵ for traders.

Edgecipline was born from real trading struggles — the overtrading, the
impulsive decisions, the frustration. We built it to help traders like us gain
self-awareness, understand behavior, and trade with a calmer, clearer mind.

Rail labels: **Real Struggles** · **Real Traders** · **A Clearer Tomorrow**

- Real Experience
- Practical Insights
- A Calmer Stronger You

---

## 5 · How It Works — `#how-it-works`

## How It Works

A simple process. A powerful shift.

**01 · Upload Your Trades**
Import your trading history in seconds.

**02 · AI Analysis**
Our AI analyses your behavior, patterns and emotional triggers.

**03 · Learn & Improve**
Get personalized insights to build better habits and consistency.

---

## 6 · Your Trading DNA — `#trading-dna`

## Your Trading DNA

A deeper process. A powerful shift.

| Trait | Line |
| --- | --- |
| Emotional Triggers | What sets you off? |
| Risk Behavior | How you handle risk. |
| Strengths & Edges | Where you naturally excel. |
| Trading Personality | Your unique trading style. |

`[svg]` Glowing DNA helix representing trading behavior patterns.

Helix labels: Emotions · Risk · Behavior · Discipline · Execution

**A deeper understanding leads to better decisions.**

Know your patterns. Trade a stronger version of yourself.

---

## 7 · Weekly Reflection & Habits — `#reflection`

## Weekly Reflection & Habits

Turn insights into consistent action.

- **12** Day Streak
- **78%** Discipline Score

**Weekly Reflection**
Review your week. Spot patterns. Set better intentions.

**Your Progress**
Mon · Tue · Wed · Thu · Fri · Sat · Sun

---

## 8 · Your Journey — `#journey`

## Your Journey to a Stronger You

Small changes. A massive difference.

| Step | Title | Line |
| --- | --- | --- |
| 1 | Awareness | Understand your patterns. |
| 2 | Better Habits | Make smarter decisions. |
| 3 | More Discipline | Stay consistent. |
| 4 | A Stronger You | Trade with clarity. |

---

## 9 · Pricing Plans — `#pricing`

## Pricing Plans

Simple and transparent. Choose your path.

Billing toggle: **Monthly** | **Yearly — 20% OFF**

### Standard — ₹349 / month

- Trading Journal
- Basic AI Insights
- Weekly Reflections
- Community Access

Join Waitlist →

### Professional — ₹899 / 3 months · *Most Popular*

- Advanced AI Analysis
- Trading DNA Report
- Personalized Coaching Insights
- Priority Support

Join Waitlist →

### Ultimate — ₹1,499 / 6 months

- Full AI Coach Access
- Deep Behavior Analysis
- Advanced Analytics
- Early Access to New Features

Join Waitlist →

> **Note.** `[hidden]` **Monthly prices do not exist.** Every plan's `monthly`
> price is `null` in `src/components/sections/pricing-data.ts`, so the Monthly
> option renders disabled and only the Yearly column above is priced. The three
> prices shown are the Yearly figures. Fill the three `monthly` entries in and
> the selector becomes live on its own.

---

## 10 · Frequently Asked Questions — `#faq`

## Frequently Asked ↵ Questions

Everything you need to know.

**What is Edgecipline?**

Edgecipline is an AI trading journal and discipline coach that helps traders
understand their behavior, break bad habits, and build lasting consistency.

**How does the AI analysis work?**

You import your trading history in seconds. The AI analyses your behavior,
patterns and emotional triggers, then turns that into personalized insights you
can use to build better habits and consistency.

**Who is this for?**

Edgecipline was born from real trading struggles — the overtrading, the
impulsive decisions, the frustration. It is built for traders who want to gain
self-awareness, understand their behavior, and trade with a calmer, clearer
mind.

> **Note.** `[hidden]` **Two further questions exist but are not rendered**,
> because their answers are `null` in
> `src/components/sections/faq-data.ts` — answering either would mean inventing
> a security guarantee or a release date:
>
> - Is my trading data secure?
> - When will it be available?
>
> Write the answers in and each question appears on its own. The accordion only
> renders a question once it has an approved answer.

---

## 11 · Final call to action — `#waitlist`

## A calmer mind. ↵ A stronger trader.

Same markets. A better you.

### Waitlist form

| Field | Label | Placeholder / options |
| --- | --- | --- |
| Name | Name | Your name |
| Email | Email * | your@email.com |
| Phone | Phone | Optional |
| Experience | Trading experience | Select · Less than 1 year · 1–3 years · 3–5 years · More than 5 years |

Submit button: **Join the waitlist**

Free to join, no card required. We email you about launch and early access —
nothing else.

Watch Demo

#### Form state messages

While submitting: **Joining…**

On success: **You're on the list.**
We'll email you when early access opens. Priority goes to the people who joined
first.

Already registered: **You're already on the list.**
That email is already registered — nothing more to do. We'll be in touch before
launch.

Validation — empty email: Add your email — it's how we let you know.

Validation — malformed email: That email address doesn't look right.

Service unavailable (HTTP 503): The waitlist is temporarily unavailable. Email
support@edgecipline.com and we'll add you.

Other failure: That didn't go through. Try again, or email
support@edgecipline.com.

Network failure: That didn't go through — check your connection, or email
support@edgecipline.com.

> **Note.** `[hidden]` The form also contains a field labelled **Company
> website**. It is a honeypot: positioned off-screen, `aria-hidden`,
> `tabIndex={-1}` and `autoComplete="off"`, so no person reaches it and anything
> that fills it is automated. It is not real copy.

---

## Footer

`[alt]` Edgecipline

Trade Disciplined · Live Freer

---

## Scroll rail

The pinned progress rail down the side of the page:

| # | Label |
| --- | --- |
| 01 | Home |
| 02 | The loop |
| 03 | The story |
| 04 | Built by traders |
| 05 | How it works |
| 06 | Trading DNA |
| 07 | Reflection |
| 08 | Journey |
| 09 | Pricing |
| 10 | FAQ |
| 11 | Join |

---

## Screen-reader-only anchor sections

Two headings exist solely so that links pointing at them have a destination.
They carry no visible copy:

- `#ai-coach` — **AI Coach**
- `#demo` — **Watch the Edgecipline demo**

---

## Accessible labels

Not visible copy, but part of the page's text layer:

- Primary navigation
- Mobile navigation
- Open navigation / Close navigation *(the mobile toggle, by state)*
- Company and legal
- Edgecipline home
- Sections
- Billing period
- Skip to content

---

## Counted elsewhere

These strings are set sitewide rather than by the landing page, in
`src/data/brand.ts`:

- Site title and meta description
- Slogan: **Trade Disciplined · Live Freer**
- Brand etymology — the note that "Edgecipline" is a portmanteau of *Edge* and
  *discipline*, not a misspelling
- Legal name: **Edgecipline Technologies**
