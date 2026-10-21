import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

import { MobileNav } from "@/components/MobileNav";
import { SidebarNav } from "@/components/SidebarNav";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getFeaturedPosts, postsByDate, usedCategories } from "@/data/blog";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, OG_IMAGE_PATH, OG_IMAGE_SIZE, absoluteUrl } from "@/data/brand";
import styles from "@/components/blog/Blog.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const url = absoluteUrl;

const title = "Blog — Trading Psychology, Journaling & Behavior Analytics";
const description =
  "Articles on trading psychology, building a journaling habit, risk management, Trading DNA and NIFTY & BANKNIFTY behaviour — from the team building Edgecipline.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url("/blog") },
  robots: { index: true, follow: true },
  openGraph: {
    siteName: BRAND_NAME,
    title,
    description,
    type: "website",
    url: url("/blog"),
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE_PATH],
  },
};

/**
 * /blog
 *
 * SEO notes, since this is the page most likely to earn search traffic:
 *
 *   * `Blog` + `BreadcrumbList` structured data, with every post listed as a
 *     `BlogPosting` carrying its own url, headline, description and dates.
 *     Built from the same array that renders the cards, so it can never
 *     describe a post the page does not link to.
 *   * Every card stays in the HTML regardless of the active filter, so all six
 *     article URLs are crawlable without running any JavaScript.
 *   * One `h1`; each card title is an `h3` under the `h2` section labels.
 *   * Canonical, OG and Twitter metadata are emitted only when the real
 *     deployment URL is configured, so nothing ever advertises a guessed host.
 */
export default function BlogPage() {
  const posts = postsByDate();
  const featured = getFeaturedPosts()[0] ?? null;
  const categories = usedCategories();

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url("/blog")}#blog`, url: url("/blog"),
        name: "Edgecipline Blog",
        description,
        inLanguage: "en-IN",
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          ...(url(`/blog/${post.slug}`)
            ? { "@id": `${url(`/blog/${post.slug}`)}#article`, url: url(`/blog/${post.slug}`) }
            : {}),
          headline: post.title,
          description: post.description,
          articleSection: post.category,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: url("/blog") },
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

      <a className={css("blSkip")} href="#articles">
        Skip to the articles
      </a>

      <RevealObserver />
      <SidebarNav />
      <MobileNav />

      <section className={css("blHero")} aria-labelledby="blog-title">
        <div className={css("blHeroGlow")} aria-hidden="true" />
        <span className={css("blHeroRule")} aria-hidden="true" />

        <div className={css("blInner")}>
          <div className={css("blHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("blCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">Blog</li>
              </ol>
            </nav>

            <p className={css("blLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Blog
            </p>

            <h1 id="blog-title" className={css("blTitle")} data-reveal>
              Behaviour is the edge.
            </h1>

            <p className={css("blLede")} data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Trading psychology, journaling habits, risk management and what the data says about
              how traders actually behave — written while building Edgecipline.
            </p>
          </div>
        </div>
      </section>

      <main className={css("blBody")} id="articles">
        <div className={css("blInner")}>
          <h2 className="sr-only">Articles</h2>
          <BlogIndex categories={categories} featured={featured} posts={posts} />
        </div>
      </main>

      <section className={css("blCta")} aria-labelledby="blog-cta-title">
        <div className={css("blCtaGlow")} aria-hidden="true" />
        <div className={css("blInner")}>
          <div className={css("blCtaInner")}>
            <p className={css("blLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="blog-cta-title" data-reveal>
              Stop reading about it. Start measuring it.
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Edgecipline turns the behaviour these articles describe into something you can see in
              your own trades. Join the waitlist for early access.
            </p>

            <div className={css("blCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/features">
                See all 14 features
                <Sparkles aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
