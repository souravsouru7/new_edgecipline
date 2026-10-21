import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { PostCard, PostMeta, formatDate } from "@/components/blog/PostCard";
import { renderMarkdown } from "@/components/blog/markdown";
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from "@/data/blog";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, ORGANIZATION_ID, absoluteUrl } from "@/data/brand";
import styles from "@/components/blog/Blog.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const url = absoluteUrl;

type Props = { params: Promise<{ slug: string }> };

/** All six posts are known at build time, so all six prerender as static HTML. */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

  /* No `images` here on purpose: `opengraph-image.tsx` in this segment
     generates the card, and an explicit `images` in metadata would override
     the file convention and put the generic sitewide card back. Twitter has
     no separate `twitter-image` because the crop is identical — 1200x630,
     summary_large_image — and X falls back to og:image, so a second file
     would be the same picture generated twice. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const canonical = url(`/blog/${post.slug}`);

  return {
    title: { absolute: `${post.title} | Edgecipline Blog` },
    description: post.description,
    alternates: { canonical },
    openGraph: {
    siteName: BRAND_NAME,
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      section: post.category,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/**
 * /blog/[slug]
 *
 * SEO notes:
 *
 *   * `BlogPosting` + `BreadcrumbList` structured data per article, with
 *     headline, description, section, dates, word count and the canonical url.
 *     `author` and `publisher` are the Organization — the source data carries
 *     no byline, and inventing a named author would be a fabricated claim.
 *   * `generateStaticParams` prerenders all six as static HTML, and an unknown
 *     slug calls `notFound()` — a real 404, never a soft-404 empty shell.
 *     (`dynamicParams` is not set: this project enables `cacheComponents`,
 *     which rejects that segment config, and `notFound()` already covers it.)
 *   * One `h1` (the title); every `##` in the body becomes an `h2` with a
 *     stable id, which the contents list links to.
 *   * Related posts give each article three outbound internal links, and the
 *     breadcrumb plus "All articles" link back up.
 */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { blocks, headings } = renderMarkdown(post.content);
  const related = getRelatedPosts(post.slug);
  const canonical = url(`/blog/${post.slug}`);
  const wordCount = post.content.trim().split(/\s+/).length;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`, url: canonical, mainEntityOfPage: canonical,
        headline: post.title,
        description: post.description,
        articleSection: post.category,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        ...(post.sources?.length ? { citation: post.sources.map((source) => source.url) } : {}),
        wordCount,
        inLanguage: "en-IN",
        // The post's own generated card, not the sitewide one.
        image: `${canonical}/opengraph-image`,
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@type": "Blog", "@id": `${url("/blog")}#blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: url("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  };

  return (
    <div className={css("blPage")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />

      <a className={css("blSkip")} href="#article">
        Skip to the article
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("blHero")} aria-labelledby="post-title">
        <div className={css("blHeroGlow")} aria-hidden="true" />
        <span className={css("blHeroRule")} aria-hidden="true" />

        <div className={css("blInner")}>
          <div className={css("blArticleHero")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("blCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page" className={css("blCrumbTrim")}>
                  {post.title}
                </li>
              </ol>
            </nav>

            <h1 id="post-title" className={css("blArticleTitle")} data-reveal>
              {post.title}
            </h1>

            <p className={css("blArticleLede")} data-reveal style={vars({ "--mo-delay": ".1s" })}>
              {post.description}
            </p>

            <PostMeta post={post} className={css("blArticleMeta")} />
          </div>
        </div>
      </section>

      <main className={css("blBody")}>
        <div className={css("blInner")}>
          <div className={css("blLayout")}>
            {headings.length > 1 && (
              <nav className={css("blToc")} aria-labelledby="toc-title">
                <p className={css("blTocTitle")} id="toc-title">
                  Contents
                </p>
                <ul className={css("blTocList")}>
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <article className={css("blProse")} id="article">
              {blocks}

              {!!post.sources?.length && (
                <section className={css("blSources")} aria-labelledby="article-sources">
                  <h2 id="article-sources">Sources</h2>
                  <ul>
                    {post.sources.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} rel="noopener noreferrer">{source.title}</a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <footer className={css("blSignoff")}>
                <span className={css("blSignoffMark")} aria-hidden="true">
                  <Sparkles size={18} />
                </span>
                <span>
                  <b>Edgecipline</b>
                  <span>
                    Published {formatDate(post.publishedAt)}
                    {post.updatedAt && ` · Updated ${formatDate(post.updatedAt)}`} in {post.category}
                  </span>
                </span>
              </footer>
            </article>
          </div>

          {related.length > 0 && (
            <section className={css("blRelated")} aria-labelledby="related-title">
              <h2 id="related-title">Keep reading</h2>
              <ul className={css("blGrid")}>
                {related.map((item) => (
                  <li key={item.slug}>
                    <PostCard post={item} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className={css("blSectionLabel")} style={{ marginTop: "clamp(26px, 3vw, 40px)" }}>
            <Link href="/blog" className={css("blCardFoot")} style={{ paddingTop: 0 }}>
              <ArrowLeft aria-hidden="true" size={15} />
              All articles
            </Link>
          </p>
        </div>
      </main>

      <section className={css("blCta")} aria-labelledby="post-cta-title">
        <div className={css("blCtaGlow")} aria-hidden="true" />
        <div className={css("blInner")}>
          <div className={css("blCtaInner")}>
            <p className={css("blLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="post-cta-title" data-reveal>
              See these patterns in your own trades.
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Edgecipline measures the behaviour this article describes — from your own screenshots.
              Join the waitlist for early access.
            </p>

            <div className={css("blCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/pricing">
                See pricing
                <Sparkles aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
