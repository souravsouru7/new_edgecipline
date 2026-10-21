import type { ReactNode } from "react";

import styles from "./Blog.module.css";

const css = (name: string) => styles[name] || name;

/**
 * A markdown renderer for exactly the subset the posts use.
 *
 * The six articles in `src/data/blog.ts` only ever use `##` headings, `- ` and
 * `1. ` lists, blank-line-separated paragraphs, `**bold**` and `*emphasis*` —
 * verified against the source, which contains no links, code, tables or
 * blockquotes. So rather than add a markdown dependency and ship a parser to
 * the browser, this handles that subset in ~90 lines on the server.
 *
 * Two properties worth keeping if this is ever extended:
 *
 *   * It builds React elements, never HTML strings, so post content never goes
 *     through `dangerouslySetInnerHTML` and there is no injection surface.
 *   * Anything it does not recognise falls through as a paragraph. An
 *     unsupported construct renders as plain text — visibly wrong, never
 *     broken markup or a blank page.
 *
 * Headings are returned alongside the blocks so the page can build a contents
 * list from the same parse, with ids that match.
 */

export type Heading = { id: string; text: string };

/** "The Uncomfortable Truth" → "the-uncomfortable-truth" */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** `**bold**` and `*emphasis*`; everything else is literal text. */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      out.push(<strong key={`${key}-b${index}`}>{match[1]}</strong>);
    } else {
      out.push(<em key={`${key}-i${index}`}>{match[2]}</em>);
    }
    last = match.index + match[0].length;
    index += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderMarkdown(markdown: string): { blocks: ReactNode[]; headings: Heading[] } {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  const headings: Heading[] = [];

  /** Items of the list currently being collected, if any. */
  let list: string[] = [];
  let ordered = false;

  const flushList = () => {
    if (!list.length) return;
    const items = list.map((item, i) => (
      <li key={`li-${blocks.length}-${i}`}>{inline(item, `li-${blocks.length}-${i}`)}</li>
    ));
    blocks.push(
      ordered ? (
        <ol key={`ol-${blocks.length}`} className={css("blOl")}>
          {items}
        </ol>
      ) : (
        <ul key={`ul-${blocks.length}`} className={css("blUl")}>
          {items}
        </ul>
      ),
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushList();
      continue;
    }

    const heading = /^##\s+(.*)$/.exec(line);
    if (heading) {
      flushList();
      const text = heading[1].trim();
      const id = slugify(text);
      headings.push({ id, text });
      blocks.push(
        <h2 key={`h-${id}`} id={id} className={css("blH2")}>
          {inline(text, `h-${id}`)}
        </h2>,
      );
      continue;
    }

    const bullet = /^-\s+(.*)$/.exec(line);
    if (bullet) {
      if (ordered) flushList();
      ordered = false;
      list.push(bullet[1]);
      continue;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      if (!ordered) flushList();
      ordered = true;
      list.push(numbered[1]);
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className={css("blP")}>
        {inline(line, `p-${blocks.length}`)}
      </p>,
    );
  }

  flushList();
  return { blocks, headings };
}
