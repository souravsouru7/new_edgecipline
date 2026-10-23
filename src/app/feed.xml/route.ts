import { BLOG_POSTS, postsByDate } from "@/data/blog";
import { BRAND_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/data/brand";

const xml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character] ?? character);

/** A static RSS feed gives crawlers and readers a lightweight article index. */
export function GET() {
  const posts = postsByDate();
  const latest = posts[0]?.updatedAt ?? posts[0]?.publishedAt;
  const items = posts.map((post) => {
    const canonical = absoluteUrl(`/blog/${post.slug}`);
    return `
    <item>
      <title>${xml(post.title)}</title>
      <link>${xml(canonical)}</link>
      <guid isPermaLink="true">${xml(canonical)}</guid>
      <description>${xml(post.description)}</description>
      <category>${xml(post.category)}</category>
      <pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate>
    </item>`;
  }).join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${BRAND_NAME} Blog`)}</title>
    <link>${xml(absoluteUrl("/blog"))}</link>
    <atom:link href="${xml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
    <description>${xml(SITE_DESCRIPTION)}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date(`${latest ?? BLOG_POSTS[0].publishedAt}T00:00:00Z`).toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
