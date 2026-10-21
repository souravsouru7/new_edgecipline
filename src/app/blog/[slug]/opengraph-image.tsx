import { notFound } from "next/navigation";

import { BLOG_POSTS, getBlogPost } from "@/data/blog";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * A card per article.
 *
 * This is the route where a generic card cost the most: six articles all
 * previewed as the same picture, so sharing one of them told nobody which one
 * it was. Now each carries its own headline, its category and its date.
 *
 * `generateStaticParams` matches the page's own, so all six are rendered at
 * build time rather than on first request — a social crawler that times out
 * waiting for an image falls back to no card at all.
 */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

/**
 * A static `alt` rather than `generateImageMetadata`.
 *
 * The dynamic variant can give each post its own alt text, but it also moves
 * the card to `/blog/<slug>/opengraph-image/<id>`. A predictable URL is worth
 * more here: it is the one the `BlogPosting` schema points at, so the article
 * thumbnail and the social card are the same image rather than two guesses.
 */
export const alt = "An Edgecipline article — trading psychology, journaling and risk";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  // `proxy.ts` already 404s unknown slugs, so this is belt and braces — but an
  // image route that renders a card for a post that does not exist is worse
  // than one that 404s.
  if (!post) notFound();

  const date = new Date(`${post.updatedAt ?? post.publishedAt}T00:00:00Z`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );

  return ogCard({
    eyebrow: post.category,
    title: post.title,
    lede: post.description,
    foot: `${date} · ${post.readTime} min read`,
  });
}
