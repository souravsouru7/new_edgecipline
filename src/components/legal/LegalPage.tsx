import type { CSSProperties } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Mail } from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { renderMarkdown } from "@/components/blog/markdown";
import type { LegalDoc } from "@/data/legal";
import { legalDocs } from "@/data/legal";
import { CONTACT_EMAIL } from "@/data/contact";
import styles from "./Legal.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * Shared shell for /privacy and /terms.
 *
 * Both documents are markdown in the same subset the blog posts use, so they
 * render through the same `renderMarkdown` — which also hands back the real
 * headings, so the contents rail and the section ids always agree with the
 * text. (Those blocks carry the `bl*` prose classes from Blog.module.css;
 * class names are global in this project, and long-form legal text wants the
 * same reading treatment an article does.)
 *
 * A Server Component with no client JavaScript of its own. The one thing worth
 * noting: nothing here reformats or summarises the document. Legal text is the
 * one place on a site where a helpful paraphrase is a liability.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { blocks, headings } = renderMarkdown(doc.body);
  const sibling = legalDocs.find((other) => other.slug !== doc.slug);

  return (
    <div className={css("lgPage")}>
      <a className={css("lgSkip")} href="#document">
        Skip to the document
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("lgHero")} aria-labelledby="legal-title">
        <div className={css("lgHeroGlow")} aria-hidden="true" />
        <span className={css("lgHeroRule")} aria-hidden="true" />

        <div className={css("lgInner")}>
          <div className={css("lgHeroInner")}>
            <nav aria-label="Breadcrumb">
              <ol className={css("lgCrumbs")}>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page">{doc.title}</li>
              </ol>
            </nav>

            <p className={css("lgEyebrow")} data-reveal="fade">
              {doc.eyebrow}
            </p>

            <h1 id="legal-title" className={css("lgTitle")} data-reveal>
              {doc.title}
            </h1>

            <p className={css("lgUpdated")} data-reveal style={vars({ "--mo-delay": ".08s" })}>
              <FileText aria-hidden="true" size={14} />
              Last updated: {doc.updated}
            </p>
          </div>
        </div>
      </section>

      <main className={css("lgBody")}>
        <div className={css("lgInner")}>
          <div className={css("lgLayout")}>
            {headings.length > 1 && (
              <nav className={css("lgToc")} aria-labelledby="legal-toc-title">
                <p className={css("lgTocTitle")} id="legal-toc-title">
                  Contents
                </p>
                <ul className={css("lgTocList")}>
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ul>

                {sibling && (
                  <p className={css("lgTocFoot")}>
                    <Link href={`/${sibling.slug}`}>{sibling.title}</Link>
                  </p>
                )}
              </nav>
            )}

            <article className={css("lgDoc")} id="document">
              {blocks}

              <footer className={css("lgFoot")}>
                <a className={css("lgFootLink")} href={`mailto:${CONTACT_EMAIL}`}>
                  <Mail aria-hidden="true" size={15} />
                  {CONTACT_EMAIL}
                </a>
                <p>
                  Questions about this document? Email us, or use the{" "}
                  <Link href="/contact">contact page</Link>.
                </p>
              </footer>
            </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
