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

export const BLOG_POSTS: BlogPost[] = [
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

SEBI's study of India's equity futures and options (F&O) segment found that 93% of more than 1 crore individual traders incurred losses over the three years from FY22 to FY24. Their average loss was around ₹2 lakh per trader, inclusive of transaction costs, and their aggregate losses exceeded ₹1.8 lakh crore. These figures apply to individual traders in this segment over this period, and the study does not establish that psychology or inconsistent execution caused those losses.

The same study reports how costs and profits were distributed. Individual traders spent an average of ₹26,000 each on F&O transaction costs in FY24, and about ₹50,000 crore collectively over FY22 to FY24, of which 51% was brokerage and 20% exchange fees. In FY24, proprietary traders and foreign portfolio investors (FPIs) booked gross trading profits of ₹33,000 crore and ₹28,000 crore respectively, before transaction costs, and 96% of the proprietary traders' profits and 97% of the FPIs' profits came from algorithmic trading. These figures describe outcomes across groups of participants; on their own, they do not explain why any individual trader lost money.

## Behaviors Worth Reviewing

Strategy, costs and market conditions all shape results. Alongside them, these behaviors are worth checking in your own trading records:

**1. Trading after losses**
Do your position size, rule-following or number of trades change after a loss? Compare the trades you take straight after a losing trade with the rest of your record. Some traders call this pattern revenge trading.

**2. Time-of-day habits**
Do your results differ between sessions? If they do, check whether you keep trading in the periods where your record is weakest, especially when trying to recover from a bad session.

**3. Setup discipline**
Did each trade meet the criteria you set in advance? Marking the trades that did not can show whether you take marginal setups simply to be in the market.

**4. Position sizing**
You cannot know in advance which trades will win, so compare your planned and actual size across every trade. Inconsistent sizing, such as trading larger on setups that feel certain, can change your overall results even when your entries follow your plan.

## What Journaling Changes

A record that holds only P&L shows what happened, but not why.

When you track *why* you took a trade, *what emotion you felt*, and *whether you followed your rules*, you can compare decisions across sessions and setups. Any pattern needs enough observations and careful interpretation before it can guide a change.

This is what Edgecipline is built to reveal.

## What a Journal Can and Cannot Show

A journal can show whether you followed your plan. Your results also depend on your strategy, costs, market conditions and risk.

## Where to Start

1. **Track every trade, not just the losses.** Winning trades can show what you do well.
2. **Record your emotional state.** Just one word: calm, anxious, confident, frustrated.
3. **Note your setup type.** As your record grows, you can compare how consistently you execute each setup.
4. **Review weekly.** A week usually contains more trades than a single day, which makes it easier to compare decisions instead of reacting to one day's result.

Reviewing your behavior alongside strategy, costs and risk gives you a clearer record of what you can change.`,
  },
  {
    slug: "how-to-build-a-trading-journal-habit",
    title: "How to Build a Trading Journal Habit That Actually Sticks",
    description:
      "Why trading journals get abandoned, and how to build a journaling habit that lasts: a four-field minimum entry, a fixed routine and a weekly review.",
    category: "Trading Journal",
    publishedAt: "2025-11-28",
    updatedAt: "2026-10-21",
    sources: [
      {
        title: "Lally, van Jaarsveld, Potts and Wardle (2010), How are habits formed: Modelling habit formation in the real world, European Journal of Social Psychology",
        url: "https://doi.org/10.1002/ejsp.674",
      },
    ],
    readTime: 5,
    featured: true,
    content: `## Why Journals Stop

If you have started a trading journal and stopped, the problem may not be motivation. A detailed entry takes time: entry price, exit price, size, risk-reward, notes and emotions. When each entry takes several minutes, it is easy to skip one trade, then a whole week.

## Reduce the Steps

Keep each entry short enough that you will complete it after every trade. A short entry you complete regularly is more useful than a detailed template you stop using.

This is why Edgecipline starts with a screenshot. Upload it, review the trade details the AI extracts, correct anything it got wrong, and add how you felt and whether you followed your rules. When you have no screenshot, you can enter the trade manually instead.

## Make It a Routine

Habits tend to form through repetition in a consistent context. In a study published in the European Journal of Social Psychology, volunteers repeated a chosen everyday behavior in the same context, such as "after breakfast," for 12 weeks. The time it took them to reach 95% of their maximum automaticity ranged from 18 to 254 days, and missing a single opportunity did not materially affect the process.

The study looked at eating, drinking and exercise habits, not trading, but two practical points carry over:

- **Tie the entry to a fixed cue**, such as closing a trade or the end of the session.
- **Do not give up after a missed day.** Log the missing trades the next day and continue.

## The Minimum Entry

When you are short of time, record four things:

1. Instrument and direction (for example, "BANKNIFTY CE, long")
2. Result (win, loss or breakeven)
3. One word for your emotional state
4. Whether you followed your rules (yes or no)

These four fields are enough to compare rule-following and emotional state with results later. You can add detail when you have more time.

## A Weekly Review Routine

A journal becomes useful when you review it. Set a regular time each week, for example 30 minutes after your last session, and work through the same questions:

- Which setups did I trade, and did each trade meet my criteria?
- Which trades broke my rules, and what happened just before them?
- How did I feel before my weakest trades?
- What one change will I test next week?

Write down the change you choose, and check it at the next review.

## Be Patient With the Data

A few weeks of entries rarely show a reliable pattern. As your history grows, you can compare more trades within each setup, session and emotional state, and your conclusions become more trustworthy. Treat early differences as questions to keep testing.`,
  },
  {
    slug: "nifty-banknifty-trading-psychology",
    title: "NIFTY & BANKNIFTY Psychology: The India-Specific Edge",
    description:
      "How expiry days, SEBI's 2024 index-derivative changes and the opening session can affect NIFTY and BANKNIFTY decisions, and what to record in your journal.",
    category: "NIFTY & Options",
    publishedAt: "2025-11-10",
    updatedAt: "2026-10-21",
    sources: [
      {
        title: "SEBI circular SEBI/HO/MRD/TPD-1/P/CIR/2024/132: Measures to Strengthen Equity Index Derivatives Framework, October 1, 2024",
        url: "https://www.sebi.gov.in/legal/circulars/oct-2024/measures-to-strengthen-equity-index-derivatives-framework-for-increased-investor-protection-and-market-stability_87208.html",
      },
      {
        title: "NSE equity derivatives contract specifications",
        url: "https://www.nseindia.com/static/products-services/equity-derivatives-contract-specifications",
      },
      {
        title: "NSE market timings",
        url: "https://www.nseindia.com/static/market-data/market-timings",
      },
    ],
    readTime: 7,
    featured: false,
    content: `## Why Index Options Need Their Own Review

NIFTY and BANKNIFTY futures and options come with features that general trading-psychology advice rarely covers: fixed expiry dates, contract sizes set by regulation, and a defined trading session. Each of these can shape your decisions, and each can be recorded in a journal.

## What Changed in 2024

SEBI's circular of October 1, 2024 introduced several measures for equity index derivatives, including:

- **One weekly expiry per exchange.** From November 20, 2024, each exchange may offer weekly expiry contracts on only one of its benchmark indices.
- **Larger contracts.** New index derivative contracts introduced after November 20, 2024 must be worth at least ₹15 lakh when introduced, and lot sizes are reviewed to keep the contract value between ₹15 lakh and ₹20 lakh.
- **Upfront option premium.** From February 1, 2025, brokers must collect the option premium upfront from option buyers.
- **Higher margin on expiring short options.** From November 20, 2024, short options contracts expiring that day carry an additional extreme loss margin of 2%.

Expiry days and lot sizes can change, so check NSE's current contract specifications for the instrument you trade before relying on any date or quantity.

## Expiry Day

In the same circular, SEBI described expiry-day trading in index options as "largely speculative," pointing to hyperactive trading, average holding periods measured in minutes, and increased index volatility through the day. That describes the market as a whole, not your own trading, but it is a good reason to review your expiry-day trades separately.

Tag each trade as expiry day or not, then compare the two groups:

- how many trades you take
- how long you hold them
- whether your entries, stops and exits followed your plan

For option buyers, time value generally erodes as expiry approaches, all else being equal. In practice, the premium also moves with the price of the underlying index and with implied volatility. Recording both your plan and what you actually did lets you review a losing expiry trade for the decision, not only the result.

## The Opening Minutes

NSE lists the equity derivatives normal market as opening at 9:15 a.m. Prices can move quickly in the first minutes, and it can be tempting to act at once.

Your journal can show whether trading the open suits you. Record your entry time and group trades into periods such as the first 15 minutes, the rest of the morning, and the afternoon. If your opening trades break your rules more often, or their results differ from your later trades, look more closely. A handful of trades is a prompt for review, not proof.

## Holding Losing Options

With options, holding a losing position past its planned exit can be expensive because, all else being equal, time value keeps eroding while you wait. Write down your planned exit before you enter, record your actual exit afterwards, and compare the two across your losing trades.

## What to Record for Index Options

A few fields make these questions answerable:

1. **Expiry day or not**, and the number of days to expiry at entry
2. **Entry time**, to compare sessions
3. **Planned and actual exit**, by price and time
4. **Option details**: strike price, option type (CE or PE) and expiry date

Edgecipline's Indian market mode records strike price, option type, expiry date and lot details, and asks you to choose your broker when you upload a screenshot. As your history grows, these fields let you compare your own expiry and non-expiry trades, opening and later trades, and planned and actual exits.`,
  },
  {
    slug: "risk-management-for-retail-traders",
    title: "Risk Management for Retail Traders: Beyond the 1% Rule",
    description:
      "A per-trade limit is only one part of a risk plan. Consider correlation, session limits, drawdowns, and decisions after losses.",
    category: "Risk Management",
    publishedAt: "2025-10-22",
    updatedAt: "2026-10-21",
    sources: [
      {
        title: "SEBI circular SEBI/HO/MRD/TPD-1/P/CIR/2024/132: Measures to Strengthen Equity Index Derivatives Framework, October 1, 2024",
        url: "https://www.sebi.gov.in/legal/circulars/oct-2024/measures-to-strengthen-equity-index-derivatives-framework-for-increased-investor-protection-and-market-stability_87208.html",
      },
    ],
    readTime: 8,
    featured: false,
    content: `## Why a Per-Trade Limit Is Not Enough

Some traders use a 1% per-trade limit as a planning example. No fixed percentage is appropriate for every person or strategy, and position size is only one part of risk.

Here are five dimensions to consider when reviewing your own plan.

## The 5 Dimensions of Trading Risk

**1. Per-trade risk**
Define a loss limit that fits your circumstances, and understand how position size, leverage and price gaps can make the actual loss larger than planned. Contract size matters too. Under SEBI's October 2024 circular, a new index derivative contract must have a contract value of at least ₹15 lakh when it is introduced. That is the value of the exposure behind one lot, not the premium an option buyer pays, and an option buyer's maximum loss is generally the premium paid. For futures and for option sellers, however, the contract value shows how much exposure a single lot carries relative to your account.

**2. Correlation risk**
Positions on NIFTY and BANKNIFTY are all exposed to the Indian equity market, so they can lose value at the same time. Three NIFTY positions and two BANKNIFTY positions may behave less like five separate trades and more like one larger position. Check your combined exposure before adding a trade.

**3. Session risk**
Consider whether your plan has a session loss limit and what action you will take if you reach it.

**4. Drawdown risk**
At what level of account drawdown will you pause and review your strategy? Record the threshold in advance instead of deciding while under pressure.

**5. Behavioral risk**
How does your decision-making change after consecutive losses or a large drawdown? Review your records before drawing conclusions.

## The Daily Loss Limit Framework

Write your limits down before the session starts:

- **Daily loss limit**: Define when you will stop for the session
- **Weekly review trigger**: Review repeated breaches of your own limit
- **Strategy pause**: Set a drawdown level that prompts a review
- **Position review**: Check combined exposure to correlated instruments

A written rule might read: "If I reach my daily loss limit, I stop trading for the day. If that happens more than once in a week, I review my trades at the weekend before trading again."

## The Journal-Risk Connection

A written risk plan is easier to follow when you can check it against your records.

With enough recorded trades, you can begin to ask:

- How does your average loss compare with your rule-defined maximum loss? (Are your stops being honored?)
- Do your losses cluster on particular days or sessions?
- Does your rule-following change as a drawdown deepens?

Each of these questions compares your written plan with what you actually did.`,
  },
  {
    slug: "what-is-trading-dna",
    title: "Your Trading DNA: Why Every Trader Has a Unique Behavioral Fingerprint",
    description:
      "What Trading DNA means, which behavior patterns research has documented in real trading records, and how to check your own journal for them.",
    category: "Behavior Analytics",
    publishedAt: "2025-10-05",
    updatedAt: "2026-10-21",
    sources: [
      {
        title: "Shefrin and Statman (1985), The Disposition to Sell Winners Too Early and Ride Losers Too Long: Theory and Evidence, Journal of Finance",
        url: "https://doi.org/10.1111/j.1540-6261.1985.tb05002.x",
      },
      {
        title: "Odean (1998), Are Investors Reluctant to Realize Their Losses?, Journal of Finance",
        url: "https://doi.org/10.1111/0022-1082.00072",
      },
      {
        title: "Coval and Shumway (2005), Do Behavioral Biases Affect Prices?, Journal of Finance",
        url: "https://doi.org/10.1111/j.1540-6261.2005.00723.x",
      },
      {
        title: "Barber and Odean (2000), Trading Is Hazardous to Your Wealth, Journal of Finance",
        url: "https://doi.org/10.1111/0022-1082.00226",
      },
    ],
    readTime: 5,
    featured: false,
    content: `## What Trading DNA Means

"Trading DNA" is Edgecipline's name for a profile of how you trade, built from your journal: your strengths, weaknesses, best setup and best session, including patterns such as increasing position size after a loss. The name is a metaphor. The profile describes patterns in your past records. It is not a fixed trait, and it changes as your trading changes.

## Patterns Found in Real Trading Records

Some behavior patterns have been studied using actual trading data:

- **Selling winners early and holding losers.** Hersh Shefrin and Meir Statman described "a general disposition to sell winners too early and hold losers too long." Terrance Odean later tested this using trading records for 10,000 accounts at a US discount brokerage and found "a strong preference for realizing winners rather than losers."
- **Taking more risk after losses.** Joshua Coval and Tyler Shumway studied proprietary traders at the Chicago Board of Trade and found that they regularly assumed "above-average afternoon risk to recover from morning losses."
- **Trading frequently.** Brad Barber and Terrance Odean studied 66,465 US households with accounts at a discount broker from 1991 to 1996. The households that traded most earned an annual return of 11.4%, while the market returned 17.9%.

These studies covered US investors and traders in specific periods. They show that such patterns appear in real records. They do not show that any particular trader has them, so the useful question is whether they appear in yours.

## Four Patterns to Check

The following are illustrative patterns to look for. They are not validated trader categories or findings from a published study.

**Trading after losses**
- Position size or the number of trades rises after a loss
- Results after the first loss of a session differ from the rest of your record

**Late entries**
- Entries come after a move has already started
- Trades that miss your own criteria appear more often after a large move you did not take

**Early exits**
- Winning trades are closed before their planned target
- A high win rate combined with a small average win compared with the average loss

**Holding losers**
- Losing trades are closed beyond the planned stop
- Average losses are larger than your rule-defined maximum loss

## How to Check Your Own Records

Reviewing trades from memory makes fair comparison difficult. Recorded trades give you something specific to compare. For each pattern, look at planned versus actual values:

1. On losing trades, your planned stop versus your actual exit
2. On winning trades, your planned target versus your actual exit
3. On the trade after a loss, its size and result compared with your other trades
4. Before your weakest trades, the emotional state you recorded

With only a few dozen trades, differences can easily be chance. Use these observations as prompts for a closer review of your plan, sample size, and market conditions, and check them again as your record grows.`,
  },
  {
    slug: "ai-in-trading-journals",
    title: "How AI Is Changing Trading Journals Forever",
    description:
      "What AI can and cannot do for a trading journal: faster screenshot entry, pattern analysis that improves as trades accumulate, and the limits to know.",
    category: "Trading Journal",
    publishedAt: "2025-09-18",
    updatedAt: "2026-10-21",
    readTime: 4,
    featured: false,
    content: `## The Spreadsheet Problem

A spreadsheet journal usually records what happened: date, instrument, direction, entry, exit and P&L, perhaps with a notes column. That record is useful, but unless you add the fields yourself, it does not capture why you took a trade or whether you followed your plan.

## What AI Changes

AI can help a trading journal in three ways:

**1. Input takes fewer steps**
Manual entry can be tedious. Screenshot extraction is designed to capture fields such as pair, direction, entry, exit, P&L, time, and lot size. Review extracted details before relying on them.

In Edgecipline, you see the screenshot and confirm it before extraction starts. The app shows a confidence score for the extracted data, and you can check and correct each trade before it is saved. A screenshot containing several trades can create several journal entries, and images that do not appear to be trade screenshots are rejected and not saved.

**2. Patterns become more meaningful as your history grows**
When you review a journal by hand, it is easy to notice the patterns you already expect and overlook others.

Analysis can group trades in ways you might not check manually, such as performance after an early loss. A difference in a small sample is a prompt to investigate, not proof of a reliable edge. Edgecipline keeps some insights locked until there is enough data, and tells you so instead of guessing.

**3. Feedback is based on your own records**
General advice such as "control your emotions" and "follow your rules" is accurate but hard to act on.

Feedback drawn from your own records can point out a difference between setups or trading sessions and ask you to review the related rule. It should not turn a correlation into an unqualified trading instruction. Edgecipline's AI coach answers questions using your journal data, including your recent trades.

## What AI Cannot Do

- **It can misread a screenshot.** Check every extracted field before you save.
- **It cannot know your reasons or emotions.** You add why you took the trade, how you felt and whether you followed your rules.
- **It cannot make a small sample reliable.** Only more trades make a comparison more trustworthy.
- **It does not predict the market.** It describes your past records, not what prices will do next.

## What This Means for You

If you use a spreadsheet, you can still record setup, emotion, rule adherence, and result. Software may make those records easier to organize and compare.`,
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
