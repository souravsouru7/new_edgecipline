"use client";

import { memo, useCallback, useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { faqCategories, faqItems, type FaqCategory, type FaqItem } from "@/data/faq";
import styles from "./Faq.module.css";

const css = (name: string) => styles[name] || name;

/**
 * One question.
 *
 * Memoised on purpose. Opening an answer changes the `open` array, which
 * re-renders the browser — and without this every one of the twenty-seven
 * rows would reconcile on each toggle, on top of the layout the height
 * animation already costs. With a stable `onToggle` and primitive props, only
 * the row that actually changed re-renders.
 */
const FaqRow = memo(function FaqRow({
  item,
  expanded,
  visible,
  onToggle,
}: {
  item: FaqItem;
  expanded: boolean;
  visible: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <li hidden={!visible}>
      <div className={css("fqItem")} id={item.id} data-open={expanded ? "" : undefined}>
        <h3>
          <button
            type="button"
            id={`${item.id}-button`}
            aria-expanded={expanded}
            aria-controls={`${item.id}-panel`}
            onClick={() => onToggle(item.id)}
          >
            <span>{item.q}</span>
            <span className={css("fqChevron")} aria-hidden="true">
              <ChevronDown size={18} />
            </span>
          </button>
        </h3>
        <div
          className={css("fqPanel")}
          id={`${item.id}-panel`}
          role="region"
          aria-labelledby={`${item.id}-button`}
          inert={!expanded}
        >
          <div>
            <p>{item.a}</p>
          </div>
        </div>
      </div>
    </li>
  );
});

/**
 * The question browser: search, a category rail, and the answers.
 *
 * Twenty-five questions is past the point where scrolling works, so the page
 * is built around finding. Three decisions behind this:
 *
 *   * Everything is rendered, always. Filtering toggles `hidden` rather than
 *     unmounting, so all 25 answers are in the HTML for crawlers and for
 *     in-page browser search, and the FAQPage structured data the server emits
 *     can never describe a question the page does not show.
 *   * Several answers can be open at once. This is reference material, not a
 *     one-at-a-time tour — closing the thing someone just read to open the
 *     next one is the wrong behaviour here.
 *   * The rail counts what each category holds, and the counts follow the
 *     search, so a filter shows its own shape rather than going quiet.
 *
 * A question deep-linked by hash (`/faq#what-is-trading-dna`) opens on load.
 */
export function FaqBrowser() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<readonly string[]>([]);
  const [active, setActive] = useState<FaqCategory | null>(null);
  const base = useId();

  const needle = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return faqItems;
    return faqItems.filter((item) =>
      `${item.q} ${item.a} ${item.category}`.toLowerCase().includes(needle),
    );
  }, [needle]);

  const matched = useMemo(() => new Set(matches.map((item) => item.id)), [matches]);

  const countIn = (category: FaqCategory) =>
    matches.filter((item) => item.category === category).length;

  // Stable identity, so FaqRow's memo actually holds: without this every
  // toggle hands all 27 rows a new callback and re-renders the lot.
  const toggle = useCallback(
    (id: string) =>
      setOpen((current) =>
        current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
      ),
    [],
  );

  // Open a question that was deep-linked, and keep the rail in step with the
  // hash. One listener, no scroll work.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      if (faqItems.some((item) => item.id === hash)) {
        setOpen((current) => (current.includes(hash) ? current : [...current, hash]));
      }
      const category = faqCategories.find((name) => slug(name) === hash);
      if (category) setActive(category);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <>
      <div className={css("fqSearchRow")}>
        <div className={css("fqSearch")}>
          <Search aria-hidden="true" size={17} />
          <label className="sr-only" htmlFor={`${base}-search`}>
            Search the questions
          </label>
          <input
            id={`${base}-search`}
            type="search"
            value={query}
            placeholder="Search the questions — pricing, Trading DNA, brokers…"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className={css("fqClear")}
              type="button"
              aria-label="Clear the search"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p className={css("fqCount")} aria-live="polite">
          {matches.length} of {faqItems.length} questions
        </p>
      </div>

      <div className={css("fqLayout")}>
        <nav className={css("fqRail")} aria-label="Question categories">
          <p className={css("fqRailTitle")}>Categories</p>
          <ul className={css("fqRailList")}>
            {faqCategories.map((category) => {
              const count = countIn(category);
              return (
                <li key={category} hidden={count === 0}>
                  <a
                    href={`#${slug(category)}`}
                    aria-current={active === category ? "true" : undefined}
                    onClick={() => setActive(category)}
                  >
                    <span>{category}</span>
                    <b aria-hidden="true">{count}</b>
                    <span className="sr-only">{count} questions</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={css("fqGroups")}>
          {faqCategories.map((category) => {
            const inCategory = faqItems.filter((item) => item.category === category);
            const visible = inCategory.filter((item) => matched.has(item.id));
            return (
              <section
                key={category}
                className={css("fqGroup")}
                id={slug(category)}
                hidden={visible.length === 0}
                aria-labelledby={`${slug(category)}-title`}
              >
                <header className={css("fqGroupHead")}>
                  <h2 id={`${slug(category)}-title`}>{category}</h2>
                  <span>
                    {visible.length} {visible.length === 1 ? "question" : "questions"}
                  </span>
                </header>

                <ul className={css("fqList")}>
                  {inCategory.map((item) => (
                    <FaqRow
                      key={item.id}
                      item={item}
                      expanded={open.includes(item.id)}
                      visible={matched.has(item.id)}
                      onToggle={toggle}
                    />
                  ))}
                </ul>
              </section>
            );
          })}

          {matches.length === 0 && (
            <div className={css("fqEmpty")} role="status">
              <p>
                Nothing matches <b>“{query.trim()}”</b>. Try a broker name, “Trading DNA”,
                “pricing” or “Android”.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/** "AI & Features" → "ai-features". Stable, so the anchors are linkable. */
function slug(category: string) {
  return category
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
