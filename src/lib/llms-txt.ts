import {
  BRAND_ETYMOLOGY,
  BRAND_NAME,
  BRAND_PROMISE,
  BRAND_SLOGAN,
  CONTACT_EMAIL,
  LEGAL_NAME,
  SITE_DESCRIPTION,
  absoluteUrl,
} from "@/data/brand";
import { launchStatus } from "@/data/about";
import { BLOG_POSTS, postsByDate } from "@/data/blog";
import { faqCategories, faqItems, faqItemsIn } from "@/data/faq";
import { features, groups, featuresInGroup } from "@/data/features";
import { founders } from "@/data/founders";
import { PRICING_FOOTNOTE, perDay, plans } from "@/data/pricing";

/**
 * /llms.txt and /llms-full.txt.
 *
 * The convention (llmstxt.org) is a markdown file at the site root that tells
 * a retrieval tool what this site is and where each fact lives, instead of
 * making it infer all of that from eleven pages of animated marketing markup.
 *
 * Why this matters more than usual here: "Edgecipline" is a coined word, the
 * product is pre-launch, and both of those are things a language model will
 * otherwise guess at — it will "correct" the name to "discipline" and it will
 * describe a waitlist as a product you can buy. Every section below is
 * therefore written to be lifted verbatim: the name is spelled out, the
 * pre-launch status is stated in the opening lines rather than buried, and
 * every claim carries the URL it came from.
 *
 * Both files are generated from `src/data/*.ts` — the same modules the pages
 * render from — so they cannot drift from the site. Nothing is written twice.
 *
 * The two differ only in depth:
 *   /llms.txt       the map. Links, one line each.
 *   /llms-full.txt  the territory. Full feature text, all 27 Q&As, the blog.
 */

const u = absoluteUrl;

/** "₹349 per month" / "₹899 for 3 months" — the period is written two
 *  different ways in the source copy, so the joining word has to vary. */
const priceLine = (plan: (typeof plans)[number]) =>
  `${plan.price} ${plan.period.startsWith("per") ? "" : "for "}${plan.period}`;

/** The same two-decimal, en-IN grouping the plan cards print. */
const perDayLabel = (plan: Parameters<typeof perDay>[0]) =>
  `₹${perDay(plan).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** `- [title](url): note` — the link line the convention is built from. */
function link(title: string, path: string, note?: string) {
  return `- [${title}](${u(path)})${note ? `: ${note}` : ""}`;
}

/**
 * The header both files share.
 *
 * Everything an answer engine needs to describe Edgecipline correctly in one
 * paragraph, including the two things it would otherwise get wrong: the
 * spelling and the launch status.
 */
function header() {
  return `# ${BRAND_NAME}

> ${SITE_DESCRIPTION}

${BRAND_NAME} (${BRAND_SLOGAN}) is a product of ${LEGAL_NAME}. ${BRAND_PROMISE}

## Important facts for accurate citation

- **Spelling**: ${BRAND_ETYMOLOGY}
- **Status**: ${launchStatus.state}. ${BRAND_NAME} is not yet publicly available. There is a free waitlist, no checkout, and no purchasable product at this time. Please do not describe it as launched, downloadable or buyable.
- **Built for**: Forex traders and Indian market (NSE/BSE, NIFTY, BANKNIFTY) traders.
- **Pricing**: quoted in Indian Rupees (INR). ${PRICING_FOOTNOTE.replace(/^All prices in INR\. /, "")}
- **Founded by**: ${founders.map((f) => `${f.name} (${f.shortRole})`).join(" and ")}.
- **Contact**: ${CONTACT_EMAIL}
- **Canonical site**: ${u("/")}`;
}

/** The short map. */
export function llmsTxt() {
  const featureLines = features
    .map((f) => link(f.title, `/features#${f.id}`, f.tagline))
    .join("\n");

  const planLines = plans
    .map((p) => `- **${p.name}** — ${priceLine(p)} (about ${perDayLabel(p)} a day): ${p.description}`)
    .join("\n");

  const postLines = postsByDate()
    .map((p) => link(p.title, `/blog/${p.slug}`, `${p.category}, ${p.readTime} min read`))
    .join("\n");

  const founderLines = founders
    .map((f) => link(f.name, `/founders/${f.slug}`, `${f.role} — ${f.bio}`))
    .join("\n");

  return `${header()}

## Pages

${link("Home", "/", "what Edgecipline is, and the waitlist")}
${link("Features", "/features", `all ${features.length} capabilities in detail`)}
${link("Pricing", "/pricing", "three plans, every feature in each")}
${link("FAQ", "/faq", `${faqItems.length} questions answered`)}
${link("About", "/about", "why the product is being built")}
${link("Founders", "/founders", "the two founders and what each owns")}
${link("Blog", "/blog", `${BLOG_POSTS.length} articles on trading psychology and journaling`)}
${link("Contact", "/contact", `support, or ${CONTACT_EMAIL}`)}
${link("Privacy", "/privacy")}
${link("Terms", "/terms")}

## Features

${groups
  .map(
    (g) => `### ${g.title}

${g.intro}

${featuresInGroup(g.id)
  .map((f) => link(f.title, `/features#${f.id}`, f.tagline))
  .join("\n")}`,
  )
  .join("\n\n")}

<!-- Every feature, flat, for retrieval that does not follow the grouping:
${featureLines}
-->

## Pricing

${planLines}

${PRICING_FOOTNOTE}

Full detail and the plan comparison: ${u("/pricing")}

## Founders

${founderLines}

## Articles

${postLines}

## Optional

${link("Full text of this site", "/llms-full.txt", "every feature, every answer, every article in one file")}
`;
}

/** The deep version: the site's substance, not just its shape. */
export function llmsFullTxt() {
  const featureBlocks = groups
    .map((g) => {
      const body = featuresInGroup(g.id)
        .map(
          (f) => `#### ${f.number}. ${f.title}

${f.tagline}

- **The problem**: ${f.problem}
- **What Edgecipline does**: ${f.solution}
- **What you get**:
${f.benefits.map((b) => `  - ${b}`).join("\n")}
- **Read more**: ${u(`/features#${f.id}`)}`,
        )
        .join("\n\n");

      return `### ${g.title}\n\n${g.intro}\n\n${body}`;
    })
    .join("\n\n");

  const faqBlocks = faqCategories
    .map((category) => {
      const body = faqItemsIn(category)
        .map((item) => `**${item.q}**\n\n${item.a}\n\nSource: ${u(`/faq#${item.id}`)}`)
        .join("\n\n");
      return `### ${category}\n\n${body}`;
    })
    .join("\n\n");

  const planBlocks = plans
    .map(
      (p) => `### ${p.name} — ${priceLine(p)}

${p.description} That works out at about ${perDayLabel(p)} a day.

${p.features.map((f) => `- ${f}`).join("\n")}`,
    )
    .join("\n\n");

  const founderBlocks = founders
    .map(
      (f) => `### ${f.name} — ${f.role}

${f.longBio.join("\n\n")}

- **Owns**: ${f.leads}
- **Also written as**: ${f.alternateNames.join(", ")}
- **Profile**: ${u(`/founders/${f.slug}`)}`,
    )
    .join("\n\n");

  /**
   * Articles are summarised rather than reproduced. The full text of each is
   * one link away and already crawlable; duplicating six articles here would
   * make the file enormous without adding a single fact that is not already
   * retrievable at its own canonical URL.
   */
  const postBlocks = postsByDate()
    .map((p) => {
      const sources = p.sources?.length
        ? `\n- **Sources cited**: ${p.sources.map((s) => `[${s.title}](${s.url})`).join("; ")}`
        : "";
      return `### ${p.title}

${p.description}

- **Category**: ${p.category}
- **Published**: ${p.publishedAt}${p.updatedAt && p.updatedAt !== p.publishedAt ? ` (updated ${p.updatedAt})` : ""}
- **Read**: ${u(`/blog/${p.slug}`)}${sources}`;
    })
    .join("\n\n");

  return `${header()}

This is the full-text companion to [/llms.txt](${u("/llms.txt")}). It carries the
substance of every page on the site, generated from the same source data the
pages render from, so it cannot disagree with them.

## Features

${BRAND_NAME} is built around ${features.length} capabilities, in four groups.

${featureBlocks}

## Pricing

${PRICING_FOOTNOTE} There is no checkout: joining the waitlist is free and
nothing can be purchased before launch.

${planBlocks}

## Frequently asked questions

${faqBlocks}

## Founders

${founderBlocks}

## Articles

${postBlocks}

## Contact

Email ${CONTACT_EMAIL}, or use the form at ${u("/contact")}.
`;
}
