import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/data/brand";
import { postsByDate } from "@/data/blog";
import { founders } from "@/data/founders";
import { legalDateModified, legalDocs } from "@/data/legal";

/**
 * The sitemap. Every URL is absolute and canonical.
 *
 * ON `lastModified`
 * -----------------
 * It is set only where a real date exists: the six articles carry their own
 * editorial dates, and the two legal documents carry the "Last updated" line
 * printed on the page itself. Every other page omits it, deliberately. A
 * sitemap date is a claim about when the content changed, and stamping today
 * onto eight marketing pages that did not change is the kind of false
 * freshness signal crawlers learn to discount — after which the dates that
 * *are* true stop being believed either.
 *
 * ON `priority` AND `changeFrequency`
 * -----------------------------------
 * Google ignores both, and has said so for years; Bing treats them as hints at
 * best. They are kept because they cost nothing and other consumers of the
 * file still read them — but they are not levers. Nothing about this site's
 * ranking will change by editing a number below.
 */

/** The legal pages' own "Last updated" line, as a Date the sitemap can emit. */
function legalModified(updated: string) {
  const iso = legalDateModified(updated);
  return iso ? new Date(`${iso}T00:00:00Z`) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const at = absoluteUrl;
  return [
    {
      url: at("/"),
      priority: 1,
      changeFrequency: "weekly",
      images: [at("/opengraph-image")],
    },
    {
      url: at("/features"),
      priority: 0.8,
      changeFrequency: "monthly",
      images: [at("/features/opengraph-image")],
    },
    { url: at("/pricing"), priority: 0.8, changeFrequency: "monthly" },
    { url: at("/blog"), priority: 0.7, changeFrequency: "weekly" },
    { url: at("/about"), priority: 0.6, changeFrequency: "yearly" },
    { url: at("/faq"), priority: 0.6, changeFrequency: "monthly" },
    { url: at("/contact"), priority: 0.5, changeFrequency: "yearly" },
    { url: at("/founders"), priority: 0.6, changeFrequency: "yearly" },
    ...founders.map((founder) => ({
      url: at(`/founders/${founder.slug}`),
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
    ...legalDocs.map((doc) => ({
      url: at(`/${doc.slug}`),
      lastModified: legalModified(doc.updated),
      priority: 0.3,
      changeFrequency: "yearly" as const,
    })),
    ...postsByDate().map((post) => ({
      url: at(`/blog/${post.slug}`),
      lastModified: new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`),
      priority: post.featured ? 0.6 : 0.5,
      changeFrequency: "yearly" as const,
    })),
  ];
}
