import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { BlogPost } from "@/data/blog";
import styles from "./Blog.module.css";

const css = (name: string) => styles[name] || name;

/** "2025-12-15" → "15 December 2025", and the machine-readable form for <time>. */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Category, date and read time. The same row on a card and on an article. */
export function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <p className={[css("blMeta"), className].filter(Boolean).join(" ")}>
      <span className={css("blCat")}>{post.category}</span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span className={css("blDot")} aria-hidden="true" />
      <span>{post.readTime} min read</span>
    </p>
  );
}

/**
 * One post on the index.
 *
 * The heading's link is stretched over the whole card with an `::after`
 * overlay, so the card is one big target without nesting anything inside an
 * anchor — the accessible name stays the post title, and the focus ring is
 * drawn on the card via `:has()`.
 */
export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article className={css("blCard")}>
      <div>
        <PostMeta post={post} />
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.description}</p>
        {!featured && (
          <p className={css("blCardFoot")}>
            Read the article
            <ArrowRight aria-hidden="true" size={15} />
          </p>
        )}
      </div>
      {featured && (
        <p className={css("blCardFoot")}>
          Read the article
          <ArrowRight aria-hidden="true" size={15} />
        </p>
      )}
    </article>
  );
}
