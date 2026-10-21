/**
 * /blog content, ported from the previous site's `edgeclipine/lib/blog.ts`.
 *
 * The six posts below — titles, descriptions, categories, dates, read times
 * and the full markdown bodies — were copied out of that file programmatically
 * rather than retyped, so every character of the article text is the original.
 * The types, the helpers and the surrounding page are new.
 *
 * The bodies use a deliberately small markdown subset, which is all the
 * original content ever used: `##` headings, `- ` and `1. ` lists, paragraphs,
 * `**bold**` and `*emphasis*`. No links, code, tables or blockquotes appear
 * anywhere in it. `renderMarkdown` in components/blog/markdown.tsx handles
 * exactly that subset and builds React elements, so no post content is ever
 * passed through dangerouslySetInnerHTML.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO date, used for <time> and for datePublished in the article schema. */
  publishedAt: string;
  /** Minutes, as the original editorial estimate. */
  readTime: number;
  featured?: boolean;
  content: string;
}

export const CATEGORIES = [
  "Trading Psychology",
  "Trading Journal",
  "Risk Management",
  "Price Action",
  "Behavior Analytics",
  "NIFTY & Options",
];

export const BLOG_POSTS: BlogPost[] = [] = [
  {
    slug: "why-90-percent-traders-fail",
    title: "Why 90% of Traders Fail — And It's Not What You Think",
    description:
      "Everyone blames the market. The real culprit is behavioral. Here's what the data actually shows about why most traders blow their accounts.",
    category: "Trading Psychology",
    publishedAt: "2025-12-15",
    readTime: 6,
    featured: true,
    content: `## The Uncomfortable Truth

Most traders spend years searching for the perfect strategy. They buy courses, follow gurus, and study setups. But the data tells a different story.

A 2024 SEBI study found that 90% of individual traders lose money over a 5-year period. The common assumption is that they're using wrong strategies. But when researchers dug deeper, they found something surprising: **most losing traders knew their edge. They simply couldn't execute it consistently.**

## Behavior, Not Strategy

Here's what separates consistently profitable traders from the 90% who fail:

**1. Revenge trading after losses**
The emotional need to "get your money back" after a loss leads to oversized positions, broken rules, and compounding losses. It's not a strategy problem — it's an emotional regulation problem.

**2. Bad time-of-day habits**
Most traders have peak performance windows. But they keep trading outside those windows, especially when trying to recover from a bad session.

**3. Setup delusion**
Traders convince themselves that a mediocre setup is valid because they want to trade. The setup looks like the one they've been waiting for. It isn't.

**4. Inconsistent position sizing**
In winning trades: too small. In "sure thing" trades: too large. This asymmetry alone can turn a positive strategy into a losing one.

## What Journaling Changes

The problem with most trading journals is that they only track P&L. Green days feel like skill. Red days feel like bad luck. But behavior analytics changes this.

When you track *why* you took a trade, *what emotion you felt*, and *whether you followed your rules*, patterns emerge. You start seeing that you lose 3x more on Friday afternoons. You start seeing that your revenge trades have a 28% win rate versus your regular setup's 67%.

This is what Edgecipline is built to reveal.

## The Mirror Principle

The market is a mirror. It doesn't care about your P&L target. It simply reflects your decisions back at you. The traders who get consistently profitable aren't those with the best strategies — they're the ones who know themselves well enough to stay disciplined when it counts.

Journaling is the mirror. Behavior analytics is the flashlight.

## Where to Start

1. **Track every trade, not just the losses.** Winners have patterns worth repeating.
2. **Record your emotional state.** Just one word: calm, anxious, confident, frustrated.
3. **Note your setup type.** In 3 months, you'll see which setups you actually execute well.
4. **Review weekly, not daily.** Daily P&L creates noise. Weekly behavior creates signal.

The 10% of traders who succeed do one thing differently: they take their psychology as seriously as their strategy. That's the edge.`,
  },
  {
    slug: "how-to-build-a-trading-journal-habit",
    title: "How to Build a Trading Journal Habit That Actually Sticks",
    description:
      "Most traders start a journal and quit in two weeks. Here's the psychology behind building a journaling habit that compounds over time.",
    category: "Trading Journal",
    publishedAt: "2025-11-28",
    readTime: 5,
    featured: true,
    content: `## Why Journals Fail

You've probably started a trading journal before. Maybe a spreadsheet, maybe a notebook. Maybe a $10/month app. And you stopped.

The reason isn't laziness. It's friction.

Traditional journaling requires too many steps: open the journal, type the entry price, type the exit price, calculate R:R, write notes, select emotions... By the time you've finished one trade entry, your next setup is forming.

## The Friction Problem

The highest-paid habit researchers have found one consistent truth: **the harder a behavior is to start, the less often it happens.** Every additional step reduces follow-through by roughly half.

This is why Edgecipline starts with a screenshot. One screenshot. That's the entire input. The AI extracts everything else.

## Building the Habit Loop

Every habit has three parts: cue, routine, reward.

**For trade journaling:**
- **Cue**: Close your trade
- **Routine**: Take screenshot (2 seconds)
- **Reward**: See your running behavioral stats update

The reward must be immediate. "Build discipline over months" is not a reward your brain can feel. Seeing your win rate update in real-time is.

## The Minimum Viable Journal Entry

If you can't use AI screenshot extraction, here's the minimum viable entry:
1. Trade direction + instrument (e.g., "BANKNIFTY CE long")
2. Result (W/L/BE)
3. One word: your emotional state
4. Did you follow your rules? (Y/N)

That's it. Four data points. If you can't maintain that, nothing else will work.

## The Weekly Review

Journals only compound when you review them. The review is where insights form.

Schedule 30 minutes every Sunday. Look for:
- Which setups are actually working?
- What time of day am I losing?
- What emotion precedes my worst trades?
- What does my "worst week" look like before it starts?

The patterns that emerge from 30 days of consistent data will change how you trade.

## The Compound Effect

Day 1 of journaling: no insight.
Day 30: "I trade worse on Mondays."
Day 90: "My setup's win rate drops from 65% to 31% when I trade after 2pm."
Day 180: "I've identified my revenge trading trigger — it's always after a morning that starts with a loss."

This is why discipline compounds. Not because of willpower. Because of data.`,
  },
  {
    slug: "nifty-banknifty-trading-psychology",
    title: "NIFTY & BANKNIFTY Psychology: The India-Specific Edge",
    description:
      "Indian equity markets have unique psychological traps that Western trading books don't cover. Here's what actually matters for NIFTY and BANKNIFTY traders.",
    category: "NIFTY & Options",
    publishedAt: "2025-11-10",
    readTime: 7,
    featured: false,
    content: `## The India Difference

Indian markets — especially NIFTY and BANKNIFTY — have characteristics that create unique psychological traps. If you're reading Western trading psychology books, you're getting maybe 60% of what applies to you.

Here's the other 40%.

## The Expiry Psychology Problem

BANKNIFTY weekly expiry (Thursday) creates a psychological phenomenon unique to Indian markets: **expiry FOMO**.

As options approach zero value on expiry day, retail traders dramatically increase their trade frequency. The market becomes highly volatile, and the P&L swings are extreme. This is psychologically addictive — and catastrophic for most retail traders.

Data from multiple broker studies shows that retail trader loss ratios peak on expiry days. Not because setups are worse — but because behavior degrades under expiry pressure.

## Morning Session Trap

Indian market opens at 9:15 AM, and the first 15 minutes are often the most volatile. Most retail traders feel compelled to trade the opening.

The reality: institutional positioning in the first 15 minutes is unpredictable. Many consistent Indian traders have a "9:15–9:30 no-trade rule."

If you track your P&L by time-of-day, you may find that your first-15-minute trades have dramatically different win rates than your 10:00–11:00 trades.

## The Options Premium Decay Trap

Most new options traders don't intuitively understand theta (time decay). They hold losing positions too long because they hope for a reversal. But theta is constant — your option loses value every minute you hold it, even if the underlying doesn't move.

This creates irrational loss aversion in options. Traders hold positions 40% longer than they should, hoping to avoid realizing the loss. The result: more theta loss and more emotional damage.

## What This Means for Your Journal

If you're journaling your NIFTY/BANKNIFTY trades, specifically track:
1. **Expiry vs non-expiry day performance** (most traders are net negative on expiry days)
2. **Time of entry** (9:15–9:30 vs 10:00+ performance often differs by 30+ points in win rate)
3. **Trade duration vs outcome** (are you holding losers too long?)

The data from these three filters alone will fundamentally change how you approach Indian markets.`,
  },
  {
    slug: "risk-management-for-retail-traders",
    title: "Risk Management for Retail Traders: Beyond the 1% Rule",
    description:
      "The classic 1% per trade risk rule is necessary but insufficient. Here's a complete risk framework for retail traders who want to survive and grow.",
    category: "Risk Management",
    publishedAt: "2025-10-22",
    readTime: 8,
    featured: false,
    content: `## Why the 1% Rule Alone Fails

The "risk only 1% per trade" rule is the first thing every trading course teaches. It's correct. It's also insufficient.

Here's why: position sizing is one dimension of risk. There are at least four others that most retail traders ignore until they blow their accounts.

## The 5 Dimensions of Trading Risk

**1. Per-trade risk (the 1% rule)**
Risk no more than 1–2% of your account per trade. With a ₹1 lakh account, your maximum loss per trade should be ₹1,000–2,000.

**2. Correlation risk**
If you have 3 open NIFTY positions and 2 BANKNIFTY positions, you're not 5 separate trades — you're essentially one large position on Indian equity indices. When one sells off, they all sell off.

**3. Session risk**
Many traders cap their loss per trade but have no cap on how much they'll lose in a day. This allows revenge trading to compound. Set a daily loss limit (e.g., 3% of account = stop for the day).

**4. Drawdown risk**
At what level of account drawdown will you pause and review your strategy? Most traders have no answer. They keep trading through 25% drawdowns, making it worse.

**5. Behavioral risk**
How does your decision-making quality change after a 3-trade losing streak? A 5% drawdown in one day? This is the rarest and most important risk dimension.

## The Daily Loss Limit Framework

- **Daily loss limit**: 3% of account
- **Weekly review trigger**: If you hit daily loss limit twice in a week
- **Strategy pause**: If you're down 10% from account peak, pause for 2 days of review
- **Position review**: No more than 2 correlated positions at once

## The Journal-Risk Connection

Risk management without journaling is theory. With journaling, it becomes data-driven.

After 30 days of tracked trades, you'll be able to answer:
- What's my average loss vs my rule-defined max loss? (Are you actually using stops?)
- What's my drawdown pattern? (Do losses cluster on certain days?)
- At what drawdown percentage does my win rate start dropping?

This is the difference between risk management as a principle versus as a practice.`,
  },
  {
    slug: "what-is-trading-dna",
    title: "Your Trading DNA: Why Every Trader Has a Unique Behavioral Fingerprint",
    description:
      "No two traders fail the same way. Understanding your unique behavioral fingerprint is the first step to fixing it.",
    category: "Behavior Analytics",
    publishedAt: "2025-10-05",
    readTime: 5,
    featured: false,
    content: `## The Behavioral Fingerprint

Every trader has a unique set of behavioral patterns that emerge under different market conditions. Just like a fingerprint, no two trading DNAs are identical.

Some traders are revenge traders. Others are chronic over-traders. Some exit winners too early. Others hold losers too long. Many have time-of-day blind spots. A few have specific instrument weaknesses.

Understanding your Trading DNA is the difference between fixing a symptom and fixing the cause.

## The Four Behavioral Archetypes

After analyzing hundreds of trading journals, four dominant behavioral archetypes emerge:

**The Revenge Trader**
- After a loss, increases position size to "get it back"
- Win rate drops sharply after their first loss of the day
- Typically their biggest losing days start with a small loss that triggers the spiral

**The FOMO Chaser**
- Enters setups late, after the move has started
- Frequently takes trades that don't meet their own criteria
- Worst performance happens after watching a big move they missed

**The Early Exit**
- Consistently closes winners before target
- P&L math: right direction, wrong size outcome
- Has a high win rate but poor R:R due to premature exits

**The Loss Holder**
- Won't accept a loss until it's 3x their planned stop
- Classic loss aversion in action
- Great at identifying direction, terrible at respecting stops

## How to Identify Your Archetype

You can't identify your archetype from memory. Memory is biased toward your best trades. The data doesn't lie.

Track these four metrics for 30 trades:
1. What was my planned stop vs actual exit on losing trades?
2. What was my planned target vs actual exit on winning trades?
3. What's my win rate on the trade directly after a loss?
4. What was my emotional state before my worst trades?

The patterns that emerge from this data will tell you exactly what your Trading DNA looks like — and exactly where to focus your psychological work.`,
  },
  {
    slug: "ai-in-trading-journals",
    title: "How AI Is Changing Trading Journals Forever",
    description:
      "The spreadsheet era of trading journals is ending. Here's how AI is transforming how traders learn from their trades.",
    category: "Trading Journal",
    publishedAt: "2025-09-18",
    readTime: 4,
    featured: false,
    content: `## The Spreadsheet Problem

For the past 20 years, the "serious trader's journal" meant a spreadsheet. Date, instrument, direction, entry, exit, P&L. Maybe a notes column. Maybe a setup name.

This approach has a fundamental problem: it only captures *what happened*, not *why it happened*. And the "why" is where all the insight lives.

## What AI Changes

AI changes three things about trading journals:

**1. Input cost drops to zero**
The biggest reason traders don't journal is friction. Manual entry is painful. With AI screenshot extraction, you take a photo of your terminal and the AI captures everything: pair, direction, entry, exit, P&L, time, lot size. No typing. No spreadsheets.

**2. Patterns become visible immediately**
A human reviewing a trading journal looks for patterns manually. This takes time and is subject to confirmation bias — you'll see the patterns you're looking for, not the patterns that are actually there.

AI identifies patterns you wouldn't think to look for. "Your win rate drops 34% when you trade on a day where your first trade was a loss" — no trader would discover this from manual review.

**3. Coaching becomes personalized**
Generic trading psychology advice tells you to "control your emotions" and "follow your rules." This is correct and useless.

Personalized AI coaching says: "Your setup A (the one you trade at 10am) has a 71% win rate. Your setup B (the one you trade after 1pm) has a 38% win rate. You should stop trading after 1pm." That's actionable.

## The Behavioral Layer

The real breakthrough isn't data extraction — it's the behavioral layer. When a trading journal tracks not just your trades but your emotional state, your rule adherence, and your setup discipline, it stops being a record and starts being a mirror.

This is why the next generation of trading tools is built around behavior, not just data.

## What This Means for You

If you're still on a spreadsheet, you're not wrong — you're just missing 80% of the available insight. The data is there. The patterns are there. AI makes them visible.

Edgecipline is built on this principle: every screenshot tells a story. The AI's job is to read it.`,
  },
]

/** Newest first — the order the index and the sitemap both use. */
export function postsByDate(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return postsByDate().filter((post) => post.featured);
}

/**
 * Same category first, then the next most recent, so a post always has
 * somewhere to go next — a dead end is a wasted internal link.
 */
export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getBlogPost(slug);
  if (!current) return [];
  const sameCategory = postsByDate().filter(
    (post) => post.slug !== slug && post.category === current.category,
  );
  const rest = postsByDate().filter(
    (post) => post.slug !== slug && post.category !== current.category,
  );
  return [...sameCategory, ...rest].slice(0, count);
}

/** Categories that actually have posts, in the declared order. */
export function usedCategories(): string[] {
  return CATEGORIES.filter((category) =>
    BLOG_POSTS.some((post) => post.category === category),
  );
}

export function postsIn(category: string): BlogPost[] {
  return postsByDate().filter((post) => post.category === category);
}
