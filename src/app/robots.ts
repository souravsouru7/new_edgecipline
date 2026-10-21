import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/data/brand";

/**
 * robots.txt
 *
 * Every page on the site is public marketing content, so all of it is
 * crawlable — there are no authenticated routes and no user-facing data here.
 * Three paths are excluded, none of them a page:
 *
 *   /api/            the two form endpoints — POST-only, nothing to index
 *   /_next/static/   build chunks, useless to a crawler
 *   /opengraph-image the social card, referenced from metadata not linked
 *
 * Excluding /api/ is tidiness, not a security control. robots.txt is a request,
 * not an access check: the endpoints validate and bound their own input, and
 * the service-account key never leaves the server regardless.
 *
 * Named agents, and why each is listed explicitly rather than left to the
 * wildcard:
 *
 *   Googlebot, Bingbot   stated outright so an added `Disallow` under `*`
 *                        later cannot silently take search engines with it.
 *   OAI-SearchBot        OpenAI's *search* crawler, which is what lets
 *                        ChatGPT Search retrieve and cite a page.
 *   PerplexityBot        Perplexity's search index.
 *
 * Note on the separation the brief asks for: `OAI-SearchBot` is search
 * retrieval only. `GPTBot` (OpenAI's model-training crawler) and
 * `ClaudeBot`/`anthropic-ai` are deliberately NOT listed here, because
 * allowing or disallowing model training is an owner's decision about their
 * content, not a technical SEO fix — and silently changing it would be making
 * that decision for you. With no rule of their own they fall under `*`, which
 * currently allows them; add explicit `Disallow` entries if you want to opt
 * out of training while keeping search retrieval.
 *
 * Also worth being plain about: allowing a crawler permits retrieval, it does
 * not cause it. No robots rule makes an AI assistant cite the site.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: "/", disallow: ["/api/", "/_next/static/", "/opengraph-image"] };

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      { userAgent: "Googlebot", ...allowAll },
      { userAgent: "Bingbot", ...allowAll },
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
