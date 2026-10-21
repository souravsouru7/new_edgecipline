"use client";

import { useState } from "react";

import { type BlogPost, postsByDate } from "@/data/blog";
import { PostCard } from "./PostCard";
import styles from "./Blog.module.css";

const css = (name: string) => styles[name] || name;

/**
 * The index grid with its category filter.
 *
 * Filtering toggles `hidden` rather than unmounting, so every post card — and
 * every post link — stays in the served HTML whatever is selected. That
 * matters more here than anywhere else on the site: these cards are the only
 * internal links to the articles, and a crawler must not have to run the
 * filter to find them.
 *
 * The cards themselves are server-rendered and passed in, so this island adds
 * only the filter state.
 */
export function BlogIndex({
  categories,
  featured,
  posts,
}: {
  categories: readonly string[];
  featured: BlogPost | null;
  posts: readonly BlogPost[];
}) {
  const [category, setCategory] = useState<string | null>(null);

  const countIn = (name: string) => posts.filter((post) => post.category === name).length;
  const shows = (post: BlogPost) => !category || post.category === category;
  const visible = posts.filter(shows);

  return (
    <>
      <div className={css("blFilter")} role="group" aria-label="Filter by category">
        <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>
          All <b>{posts.length}</b>
        </button>
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(category === name ? null : name)}
          >
            {name} <b>{countIn(name)}</b>
          </button>
        ))}
      </div>

      {/* The featured post keeps its billing only in the unfiltered view; once
          a category is chosen it takes its place in the grid like the rest. */}
      {featured && category === null && (
        <>
          <p className={css("blSectionLabel")}>Featured</p>
          <ul className={css("blGrid")}>
            <li className={css("blFeatured")}>
              <PostCard post={featured} featured />
            </li>
          </ul>
        </>
      )}

      <p className={css("blSectionLabel")} aria-live="polite">
        {category ? `${category} · ${visible.length} ` : `All articles · ${posts.length} `}
        {(category ? visible.length : posts.length) === 1 ? "article" : "articles"}
      </p>

      <ul className={css("blGrid")}>
        {posts.map((post) => (
          <li key={post.slug} hidden={!shows(post)}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className={css("blEmpty")} role="status">
          <p>No articles in that category yet.</p>
        </div>
      )}
    </>
  );
}

/** Convenience for the page: newest first. */
export { postsByDate };
