"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { features } from "@/data/features";
import styles from "./Features.module.css";

const css = (name: string) => styles[name] || name;

/**
 * Sticky index of all fourteen features.
 *
 * Two jobs, both cheap:
 *
 *   * filter — a plain substring match over title, tagline and keywords. The
 *     list is 14 items long, so it is filtered in render with no memo games.
 *   * current — which feature the reader is in. Driven by one
 *     IntersectionObserver with a focus band rather than a scroll handler, so
 *     it costs nothing per frame and adds no work to the page's shared scroll
 *     frame.
 *
 * The links are plain anchors to the published ids, so deep links, middle
 * click, keyboard and the URL hash all behave natively, and the list is still
 * a navigable list of links with JavaScript off (it renders unfiltered).
 */
export function FeatureExplorer() {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);
  const searchId = useId();

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return features;
    return features.filter((feature) =>
      [feature.title, feature.tagline, feature.number, ...feature.keywords]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  // Which section is under the reader's eye. The negative margins collapse the
  // viewport to a band just above the middle, so exactly one section is
  // "intersecting" at a time and no measurement is needed.
  useEffect(() => {
    const sections = features
      .map((feature) => document.getElementById(feature.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        // Keep source order: the first section inside the band wins.
        const active = features.find((feature) => seen.get(feature.id));
        setCurrent(active?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Keep the current chip visible in the horizontal scroller. scrollLeft is set
  // directly rather than using scrollIntoView, which would also scroll the page.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !current) return;
    const chip = list.querySelector<HTMLElement>(`[data-chip="${current}"]`);
    if (!chip) return;
    const target = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    const max = list.scrollWidth - list.clientWidth;
    list.scrollLeft = Math.max(0, Math.min(max, target));
  }, [current]);

  return (
    <div className={css("ftExplorer")}>
      <div className={css("ftInner")}>
        <div className={css("ftExplorerInner")}>
          <div className={css("ftIndexWrap")}>
            <ol className={css("ftIndex")} ref={listRef} aria-label="All features">
              {features.map((feature) => (
                <li key={feature.id} hidden={!matches.includes(feature)}>
                  <a
                    href={`#${feature.id}`}
                    data-chip={feature.id}
                    aria-current={current === feature.id ? "true" : undefined}
                  >
                    <b aria-hidden="true">{feature.number}</b>
                    {feature.title}
                  </a>
                </li>
              ))}
            </ol>
            {!matches.length && (
              <p className={css("ftNoMatch")} role="status">
                No feature matches “{query.trim()}”.
              </p>
            )}
          </div>

          <div className={css("ftExplorerHead")}>
            <div className={css("ftSearch")}>
              <Search aria-hidden="true" size={16} />
              <label className="sr-only" htmlFor={searchId}>
                Filter features
              </label>
              <input
                id={searchId}
                type="search"
                value={query}
                placeholder="Filter features"
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <p className={css("ftCount")} aria-live="polite">
              {matches.length} / {features.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
