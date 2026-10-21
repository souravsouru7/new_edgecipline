import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, Mail, SquareArrowOutUpRight } from "lucide-react";

import { Navbar } from "@/components/nav/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/motion/RevealObserver";
import {
  FOUNDER_NAMES_SENTENCE,
  founders,
  getFounder,
  otherFounder,
} from "@/data/founders";
import { WAITLIST_HREF } from "@/data/features";
import { BRAND_NAME, absoluteUrl } from "@/data/brand";
import styles from "@/components/founders/Founders.module.css";

const css = (name: string) => styles[name] || name;
const vars = (value: Record<string, string | number>) => value as CSSProperties;

const url = absoluteUrl;

type Props = { params: Promise<{ slug: string }> };

/** Both founders are known at build time, so both prerender as static HTML. */
export function generateStaticParams() {
  return founders.map((founder) => ({ slug: founder.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const founder = getFounder(slug);
  if (!founder) return {};

  const canonical = url(`/founders/${founder.slug}`);
  const title = `${founder.name} — ${founder.role}, Edgecipline`;
  const description = `${founder.name} is a co-founder of Edgecipline and leads ${founder.leads}. ${founder.bio}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
    siteName: BRAND_NAME,
      title,
      description,
      type: "profile",
      url: canonical, images: [{ url: founder.image, width: 900, height: 900 }],
    },
    twitter: { card: "summary", title, description, images: [founder.image] },
  };
}

/**
 * /founders/[slug]
 *
 * SEO notes:
 *
 *   * `ProfilePage` whose `mainEntity` is the `Person`, using the same `@id`
 *     that /founders and the Organization node reference. One entity, three
 *     pages agreeing on it — which is the whole point of keeping this data in
 *     one module.
 *   * `BreadcrumbList` three levels deep: Home → Founders → the person.
 *   * The other co-founder is named and linked in the body, so each profile
 *     corroborates the other rather than standing alone. The old site did this
 *     deliberately and it is the reason both founders surface rather than one.
 *   * `generateStaticParams` prerenders both; an unknown slug calls
 *     `notFound()` for a real 404.
 */
export default async function FounderProfilePage({ params }: Props) {
  const { slug } = await params;
  const founder = getFounder(slug);
  if (!founder) notFound();

  const other = otherFounder(founder.slug);
  const canonical = url(`/founders/${founder.slug}`);
  const personId = canonical ? `${canonical}#person` : undefined;
  const otherId = other && url(`/founders/${other.slug}`) ? `${url(`/founders/${other.slug}`)}#person` : undefined;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${canonical}#webpage`, url: canonical,
        name: `${founder.name} — ${founder.role}, Edgecipline`,
        inLanguage: "en-IN",
        ...(personId ? { mainEntity: { "@id": personId } } : {}),
      },
      {
        "@type": "Person",
        ...(personId ? { "@id": personId, url: canonical } : {}),
        name: founder.name,
        givenName: founder.givenName,
        familyName: founder.familyName,
        alternateName: [...founder.alternateNames],
        jobTitle: founder.role,
        description: founder.bio,
        knowsAbout: [...founder.expertise],
        email: founder.email,
        sameAs: [founder.linkedin],
        ...(url(founder.image) ? { image: url(founder.image) } : {}),
        ...(url("/")
          ? {
              worksFor: {
                "@type": "Organization",
                "@id": `${url("/")}#organization`,
                name: "Edgecipline Technologies",
                url: url("/"),
              },
            }
          : {}),
        ...(otherId ? { colleague: { "@id": otherId } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url("/") },
          { "@type": "ListItem", position: 2, name: "Founders", item: url("/founders") },
          { "@type": "ListItem", position: 3, name: founder.name, item: canonical },
        ],
      },
    ],
  };

  return (
    <div className={css("fdPage")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
      />

      <a className={css("fdSkip")} href="#profile">
        Skip to the profile
      </a>

      <RevealObserver />
      <Navbar />

      <section className={css("fdHero")} aria-labelledby="founder-name">
        <div className={css("fdHeroGlow")} aria-hidden="true" />
        <span className={css("fdHeroRule")} aria-hidden="true" />

        <div className={css("fdInner")}>
          <nav aria-label="Breadcrumb" style={{ paddingTop: "clamp(80px, 7.6vw, 118px)" }}>
            <ol className={css("fdCrumbs")}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link href="/founders">Founders</Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li aria-current="page">{founder.name}</li>
            </ol>
          </nav>

          <div className={css("fdProfileHero")} style={{ paddingTop: 0 }}>
            <div className={css("fdProfilePortrait")} data-reveal="from-left">
              <Image
                src={founder.image}
                alt={`${founder.name}, ${founder.shortRole} at Edgecipline`}
                width={900}
                height={900}
                priority
                sizes="(max-width: 767px) 128px, 180px"
              />
            </div>

            <div>
              <p className={css("fdLabel")} data-reveal="fade">
                <i aria-hidden="true" />
                Co-Founder
              </p>
              <h1 id="founder-name" className={css("fdProfileName")} data-reveal>
                {founder.name}
              </h1>
              <p className={css("fdProfileRole")} data-reveal style={vars({ "--mo-delay": ".08s" })}>
                {founder.role}, Edgecipline
              </p>
              <p className={css("fdProfileOneLine")} data-reveal style={vars({ "--mo-delay": ".14s" })}>
                <strong>{founder.name}</strong> is a co-founder of Edgecipline and leads{" "}
                {founder.leads}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className={css("fdBody")} id="profile">
        <div className={css("fdInner")}>
          <div className={css("fdProfileLayout")} style={{ paddingTop: "clamp(20px, 2.6vw, 36px)" }}>
            <article className={css("fdProse")}>
              <h2>About {founder.name}</h2>
              {founder.longBio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </article>

            <aside className={css("fdSide")}>
              <section className={css("fdSideCard")} aria-labelledby="owns-title" data-reveal>
                <p className={css("fdOwnsTitle")} id="owns-title">
                  What {founder.givenName} owns at Edgecipline
                </p>
                <ul className={css("fdList")}>
                  {founder.responsibilities.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" size={14} strokeWidth={2.8} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={css("fdSideCard")} aria-labelledby="expertise-title" data-reveal style={vars({ "--mo-delay": ".06s" })}>
                <p className={css("fdOwnsTitle")} id="expertise-title">
                  Areas of expertise
                </p>
                <ul className={css("fdChips")}>
                  {founder.expertise.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className={css("fdSideCard")} aria-labelledby="contact-title" data-reveal style={vars({ "--mo-delay": ".12s" })}>
                <p className={css("fdOwnsTitle")} id="contact-title">
                  Contact
                </p>
                <div className={css("fdContactRows")}>
                  <a className={css("fdQuiet")} href={founder.linkedin} target="_blank" rel="noopener noreferrer">
                    {founder.name} on LinkedIn
                    <SquareArrowOutUpRight aria-hidden="true" size={13} />
                  </a>
                  <a className={css("fdQuiet")} href={`mailto:${founder.email}`}>
                    <Mail aria-hidden="true" size={13} />
                    {founder.email}
                  </a>
                </div>
              </section>
            </aside>
          </div>

          {/* Each profile corroborates the other: both founders named, both linked. */}
          {other && (
            <section className={css("fdOther")} aria-labelledby="other-founder-title" data-reveal>
              <div className={css("fdOtherPortrait")}>
                <Image
                  src={other.image}
                  alt={`${other.name}, ${other.shortRole} at Edgecipline`}
                  width={900}
                  height={900}
                  sizes="80px"
                />
              </div>
              <div>
                <h2 id="other-founder-title" className={css("fdOwnsTitle")} style={{ marginBottom: 8 }}>
                  The other co-founder of Edgecipline
                </h2>
                <p>
                  Edgecipline was founded by {FOUNDER_NAMES_SENTENCE}. Alongside {founder.name},{" "}
                  <strong>{other.name}</strong> is a co-founder of Edgecipline and leads{" "}
                  {other.leads}.
                </p>
                <div className={css("fdOtherLinks")}>
                  <Link className={css("fdCardLink")} href={`/founders/${other.slug}`}>
                    {other.name} profile
                    <ArrowRight aria-hidden="true" size={14} />
                  </Link>
                  <Link className={css("fdQuiet")} href="/founders">
                    Both founders
                    <ArrowRight aria-hidden="true" size={13} />
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <section className={css("fdCta")} aria-labelledby="profile-cta-title">
        <div className={css("fdCtaGlow")} aria-hidden="true" />
        <div className={css("fdInner")}>
          <div className={css("fdCtaInner")}>
            <p className={css("fdLabel")} data-reveal="fade">
              <i aria-hidden="true" />
              Early Access Open
            </p>

            <h2 id="profile-cta-title" data-reveal>
              Join the waitlist today.
            </h2>

            <p data-reveal style={vars({ "--mo-delay": ".1s" })}>
              Be among the first traders to access Edgecipline when we launch. Priority access for
              early members.
            </p>

            <div className={css("fdCtaActions")} data-reveal style={vars({ "--mo-delay": ".18s" })}>
              <Link className="waitlist" href={WAITLIST_HREF}>
                Join Waitlist <span aria-hidden="true">→</span>
              </Link>
              <Link className="demo" href="/founders">
                Both founders
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
