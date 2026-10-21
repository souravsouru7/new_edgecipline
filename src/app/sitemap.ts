import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/data/brand";
import { postsByDate } from "@/data/blog";
import { founders } from "@/data/founders";

/**
 * The sitemap. Every URL is absolute and canonical.
 *
 * The origin comes from `absoluteUrl`, which falls back to the production host
 * rather than returning nothing — this file previously emitted an empty
 * urlset whenever NEXT_PUBLIC_SITE_URL was unset, which was the case.
 *
 * Article entries carry their own publication date as `lastModified` rather
 * than today's date — a sitemap that claims every page changed today is worse
 * than no date at all.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const at = absoluteUrl;
  const now = new Date();

  return [
    { url: at("/"), lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: at("/features"), lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: at("/pricing"), lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: at("/blog"), lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: at("/about"), lastModified: now, priority: 0.6, changeFrequency: "yearly" },
    { url: at("/faq"), lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: at("/contact"), lastModified: now, priority: 0.5, changeFrequency: "yearly" },
    { url: at("/founders"), lastModified: now, priority: 0.6, changeFrequency: "yearly" },
    ...founders.map((founder) => ({
      url: at(`/founders/${founder.slug}`),
      lastModified: now,
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
    { url: at("/privacy"), lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: at("/terms"), lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    ...postsByDate().map((post) => ({
      url: at(`/blog/${post.slug}`),
      lastModified: new Date(`${post.publishedAt}T00:00:00Z`),
      priority: post.featured ? 0.6 : 0.5,
      changeFrequency: "yearly" as const,
    })),
  ];
}
