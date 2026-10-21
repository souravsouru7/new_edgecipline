/**
 * /blog content, ported from the previous site's `edgeclipine/lib/blog.ts`.
 *
 * The six original posts have been edited to correct unsupported statistics,
 * stale market details, and unsourced performance claims. Updated articles
 * carry an explicit editorial date; cited sources are rendered on the page.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** ISO date, used for <time> and for datePublished in the article schema. */
  publishedAt: string;
  /** Actual substantive editorial update, when different from publication. */
  updatedAt?: string;
  sources?: readonly { title: string; url: string }[];
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
    title: "Why Many Retail F&O Traders Lose Money — And What Journaling Can Reveal",
    description:
      "SEBI reported widespread losses among individual equity F&O traders. Learn what that study does and does not show, and how reviewing your own decisions may help.",
    category: "Trading Psychology",
    publishedAt: "2025-12-15",
    updatedAt: "2026-10-21",
    sources: [{
      title: "SEBI: Updated study of individual equity F&O traders, September 2024",
      url: "https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2024/updated-sebi-study-reveals-93-of-individual-traders-incurred-losses-in-equity-fando-between-fy22-and-fy24-aggregate-losses-exceed-1-8-lakh-crores-over-three-years_86906.html",
    }],
    readTime: 6,
    featured: true,
    content: `## The Uncomfortable Truth

Many traders spend years searching for a better strategy. A trading journal can also help them examine how they followed the strategy they already had.

SEBI reported that 93% of individual traders in India's equity futures and options segment incurred losses between FY22 and FY24. That statistic applies to this segment and period; the study does not establish that psychology or inconsistent execution caused those losses.

## Behavior, Not Strategy

The following behaviors are useful to review in your own trading records:

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

When you track *why* you took a trade, *what emotion you felt*, and *whether you followed your rules*, you can compare decisions across sessions and setups. Any pattern needs enough observations and careful interpretation before it can guide a change.

This is what Edgecipline is built to reveal.

## The Mirror Principle

The market is a mirror. It doesn't care about your P&L target. A journal can show whether you followed your plan, while results also depend on the strategy, costs, market conditions, and risk.

Journaling is the mirror. Behavior analytics is the flashlight.

## Where to Start

1. **Track every trade, not just the losses.** Winners have patterns worth repeating.
2. **Record your emotional state.** Just one word: calm, anxious, confident, frustrated.
3. **Note your setup type.** In 3 months, you'll see which setups you actually execute well.
4. **Review weekly, not daily.** Daily P&L creates noise. Weekly behavior creates signal.

Reviewing your behavior alongside strategy and risk gives you a clearer record of what you can change.`,
  },
  {
    slug: "how-to-build-a-trading-journal-habit",
    title: "How to Build a Trading Journal Habit That Actually Sticks",
    description:
      "Most traders start a journal and quit in two weeks. Here's the psychology behind building a journaling habit that compounds over time.",
    category: "Trading Journal",
    publishedAt: "2025-11-28",
    updatedAt: "2026-10-21",
    readTime: 5,
    featured: true,
    content: `## Why Journals Fail

You've probably started a trading journal before. Maybe a spreadsheet, maybe a notebook. Maybe a $10/month app. And you stopped.

The reason isn't laziness. It's friction.

Traditional journaling requires too many steps: open the journal, type the entry price, type the exit price, calculate R:R, write notes, select emotions... By the time you've finished one trade entry, your next setup is forming.

## The Friction Problem

The more steps a journal entry requires, the harder it can be to maintain the habit. A short entry that you complete regularly is more useful than a detailed template you stop using.

This is why Edgecipline starts with a screenshot. One screenshot. That's the entire input. The AI extracts everything else.

## Building the Habit Loop

Every habit has three parts: cue, routine, reward.

**For trade journaling:**
- **Cue**: Close your trade
- **Routine**: Take a screenshot and check the captured details
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

After a period of consistent entries, review whether you have enough comparable trades to spot a useful pattern.

## The Compound Effect

For example, a trader might notice more rule breaks after an early loss or a difference between morning and afternoon sessions. These are questions to test against their own records, not typical outcomes or promised timelines.

This is why discipline compounds. Not because of willpower. Because of data.`,
  },
  {
    slug: "nifty-banknifty-trading-psychology",
    title: "NIFTY & BANKNIFTY Psychology: The India-Specific Edge",
    description:
      "Indian equity markets have unique psychological traps that Western trading books don't cover. Here's what actually matters for NIFTY and BANKNIFTY traders.",
    category: "NIFTY & Options",
    publishedAt: "2025-11-10",
    updatedAt: "2026-10-21",
    sources: [{
      title: "NSE equity derivatives contract specifications",
      url: "https://www.nseindia.com/static/products-services/equity-derivatives-contract-specifications",
    }],
    readTime: 7,
    featured: false,
    content: `## The India Difference

NIFTY and BANKNIFTY options traders face market hours, expiry schedules, and contract mechanics that deserve attention in a trading review. General trading psychology advice may miss these details.

## The Expiry Psychology Problem

Expiry schedules can affect how traders plan a session. Check the current NSE contract specifications for the instrument you trade; expiry days and available contracts can change.

Near expiry, an option's remaining time value can decline quickly. Rapid price changes and a short decision window can tempt a trader to depart from a plan.

Compare your own expiry and non-expiry trades before deciding whether that pressure affects your decisions. A difference in outcomes alone does not establish the cause.

## Morning Session Trap

Indian market opens at 9:15 AM, and the first 15 minutes are often the most volatile. Most retail traders feel compelled to trade the opening.

Some traders choose to observe the opening before placing a trade. Your journal can show how opening trades compare with later ones in your own history.

If you track your P&L by time-of-day, you may find that your first-15-minute trades have dramatically different win rates than your 10:00–11:00 trades.

## The Options Premium Decay Trap

Time decay is one factor in an option's price. Its effect is not constant, and changes in the underlying price, volatility, and other factors also matter.

Some traders may hold a losing option longer than their plan allows, hoping to avoid realizing the loss. Record planned and actual exits to see whether this occurs in your own trades.

## What This Means for Your Journal

If you're journaling your NIFTY/BANKNIFTY trades, specifically track:
1. **Expiry vs non-expiry day performance** (compare your own results)
2. **Time of entry** (compare your own performance across trading sessions)
3. **Trade duration vs outcome** (are you holding losers too long?)

These filters can help you ask more precise questions about your own decisions.`,
  },
  {
    slug: "risk-management-for-retail-traders",
    title: "Risk Management for Retail Traders: Beyond the 1% Rule",
    description:
      "A per-trade limit is only one part of a risk plan. Consider correlation, session limits, drawdowns, and decisions after losses.",
    category: "Risk Management",
    publishedAt: "2025-10-22",
    updatedAt: "2026-10-21",
    readTime: 8,
    featured: false,
    content: `## Why the 1% Rule Alone Fails

Some traders use a 1% per-trade limit as a planning example. No fixed percentage is appropriate for every person or strategy, and position size is only one part of risk.

Here are four other dimensions to consider when reviewing your own plan.

## The 5 Dimensions of Trading Risk

**1. Per-trade risk (the 1% rule)**
Define a loss limit that fits your circumstances and understand how position size, leverage, and gaps can affect the actual loss.

**2. Correlation risk**
If you have 3 open NIFTY positions and 2 BANKNIFTY positions, you're not 5 separate trades — you're essentially one large position on Indian equity indices. When one sells off, they all sell off.

**3. Session risk**
Consider whether your plan has a session loss limit and what action you will take if you reach it.

**4. Drawdown risk**
At what level of account drawdown will you pause and review your strategy? Record the threshold in advance instead of deciding while under pressure.

**5. Behavioral risk**
How does your decision-making change after consecutive losses or a large drawdown? Review your records before drawing conclusions.

## The Daily Loss Limit Framework

- **Daily loss limit**: Define when you will stop for the session
- **Weekly review trigger**: Review repeated breaches of your own limit
- **Strategy pause**: Set a drawdown level that prompts a review
- **Position review**: Check combined exposure to correlated instruments

## The Journal-Risk Connection

Risk management without journaling is theory. With journaling, it becomes data-driven.

With enough recorded trades, you can begin to ask:
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
    updatedAt: "2026-10-21",
    readTime: 5,
    featured: false,
    content: `## The Behavioral Fingerprint

Every trader has a unique set of behavioral patterns that emerge under different market conditions. Just like a fingerprint, no two trading DNAs are identical.

Some traders are revenge traders. Others are chronic over-traders. Some exit winners too early. Others hold losers too long. Many have time-of-day blind spots. A few have specific instrument weaknesses.

Understanding your Trading DNA is the difference between fixing a symptom and fixing the cause.

## The Four Behavioral Archetypes

The following are illustrative behavior patterns to look for. They are not validated trader categories or findings from a published study:

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
- Exits beyond their planned stop
- Classic loss aversion in action
- Great at identifying direction, terrible at respecting stops

## How to Identify Your Archetype

You can't identify your archetype from memory. Memory is biased toward your best trades. The data doesn't lie.

Track these four metrics for 30 trades:
1. What was my planned stop vs actual exit on losing trades?
2. What was my planned target vs actual exit on winning trades?
3. What's my win rate on the trade directly after a loss?
4. What was my emotional state before my worst trades?

Use these observations as prompts for a closer review of your plan, sample size, and market conditions.`,
  },
  {
    slug: "ai-in-trading-journals",
    title: "How AI Is Changing Trading Journals Forever",
    description:
      "The spreadsheet era of trading journals is ending. Here's how AI is transforming how traders learn from their trades.",
    category: "Trading Journal",
    publishedAt: "2025-09-18",
    updatedAt: "2026-10-21",
    readTime: 4,
    featured: false,
    content: `## The Spreadsheet Problem

For the past 20 years, the "serious trader's journal" meant a spreadsheet. Date, instrument, direction, entry, exit, P&L. Maybe a notes column. Maybe a setup name.

This approach has a fundamental problem: it only captures *what happened*, not *why it happened*. And the "why" is where all the insight lives.

## What AI Changes

AI changes three things about trading journals:

**1. Input takes fewer steps**
Manual entry can be tedious. Screenshot extraction is designed to capture fields such as pair, direction, entry, exit, P&L, time, and lot size. Review extracted details before relying on them.

**2. Patterns become visible immediately**
A human reviewing a trading journal looks for patterns manually. This takes time and is subject to confirmation bias — you'll see the patterns you're looking for, not the patterns that are actually there.

Analysis can group trades in ways you might not check manually, such as performance after an early loss. A difference in a small sample is a prompt to investigate, not proof of a reliable edge.

**3. Coaching becomes personalized**
Generic trading psychology advice tells you to "control your emotions" and "follow your rules." This is correct and useless.

Personalized coaching can point out a difference between setups or trading sessions and ask you to review your rules. It should not turn a correlation into an unqualified trading instruction.

## The Behavioral Layer

The real breakthrough isn't data extraction — it's the behavioral layer. When a trading journal tracks not just your trades but your emotional state, your rule adherence, and your setup discipline, it stops being a record and starts being a mirror.

This is why the next generation of trading tools is built around behavior, not just data.

## What This Means for You

If you use a spreadsheet, you can still record setup, emotion, rule adherence, and result. Software may make those records easier to organize and compare.

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
