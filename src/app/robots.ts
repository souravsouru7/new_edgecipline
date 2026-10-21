import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/data/brand";

/**
 * robots.txt
 *
 * Every page on the site is public marketing content, so all of it is
 * crawlable — there are no authenticated routes and no user-facing data here.
 * Only /api/ is excluded. CSS, JavaScript, images, and the social card remain
 * crawlable so bots can render the same page users see.
 */
export default function robots(): MetadataRoute.Robots {
  // Crawlers need the CSS, JavaScript and image resources referenced by pages
  // to render them accurately. Only the POST-only form endpoints are excluded.
  const allowAll = { allow: "/", disallow: "/api/" };

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
